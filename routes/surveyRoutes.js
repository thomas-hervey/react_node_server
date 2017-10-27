const _ = require('lodash');
const Path = require('path-parser');
const { URL } = require('url')
const mongoose = require('mongoose')
const requireLogin = require('../middlewares/requireLogin')
const requireCredits = require('../middlewares/requireCredits')
const Mailer = require('../services/Mailer')
const surveyTemplate = require('../services/emailTemplates/surveyTemplate')

const Survey = mongoose.model('surveys')

module.exports = app => {

	app.get('/api/surveys', requireLogin, async (req, res) => {
		const surveys = await Survey.find({ _user: req.user.id }) // get a user's surveys
			.select({ recipients: false }) // don't include recipients field
		res.send(surveys)
	})

	app.get('/api/surveys/:surveyId/:choice', (req, res) => {
		res.send('Thanks for voting!')
	})

	app.post('/api/surveys/webhooks', (req, res) => {
		const p = new Path('/api/surveys/:surveyId/:choice') // create path object
		_.chain(req.body)
			.map(({ email, url }) => {
				const match = p.test(new URL(url).pathname) // extract just route from url
				if (match) {
					return { email, surveyId: match.surveyId, choice: match.choice }
				}
			})
			.compact() // return only event objects, no null or undefined
			.uniqBy('email', 'surveyId') // remove duplicates from the same email & survey
			.each(({ surveyId, email, choice }) => { // loop over events, and query mongo for a PARTICULAR survey
				Survey.updateOne({
					_id: surveyId,
					recipients: {
						$elemMatch: { email: email, response: false}
					}
				}, {
					$inc: { [choice]: 1 }, // key interpolation to get the choice
					$set: { 'recipients.$.responded': true }, // set recipient response to 'true'
					lastSent: new Date()
				}).exec() // execute the query
			})
			.value()

		res.send({})
	})

	app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
		const { title, subject, body, recipients } = req.body

		const survey = new Survey({
			title,
			subject,
			body,
			// split CSV of emails, and return email object w/ unique ID
			recipients: recipients.split(',').map(email => ({ email: email.trim() })),
			// user id: a property created by mongo model
			_user: req.user.id,
			dateSent: Date.now()
		})

		// send an email
		const mailer = new Mailer(survey, surveyTemplate(survey))

		try {
			await mailer.send()
			await survey.save()
			req.user.credits -= 1
			const user = await req.user.save() // get a copy of the user as the old one is stale
			res.send(user)
		} catch (err) {
			console.log(err)
			res.status(422).send(err) // unprocessable entity
		}
	})
}
