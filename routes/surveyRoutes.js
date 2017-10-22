const mongoose = require('mongoose')
const requireLogin = require('../middlewares/requireLogin')
const requireCredits = require('../middlewares/requireCredits')
const Mailer = require('../services/Mailer')
const surveyTemplate = require('../services/emailTemplates/surveyTemplate')

const Survey = mongoose.model('surveys')

module.exports = app => {

	app.get('/api/surveys/thanks', (req, res) => {
		res.send('Thanks for voting!')
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
