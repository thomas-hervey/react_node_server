const sendgrid = require('sendGrid')
const helper = sendgrid.mail // simply calling 'mail' 'helper', instead of es6 destructuring
const keys = require('../config/keys')

// similar syntax to react component declaration
class Mailer extends helper.Mail {
	constructor({ subject, recipients }, content) {
		super()

		this.sgApi = sendgrid(keys.sendGridKey)
		this.from_email = new helper.Email('no-reply@emaily.com')
		this.subject = subject
		this.body = new helper.Content('text/html', content)
		this.recipients = this.formatAddresses(recipients)

		this.addContent(this.body) // register body w/ built-in base-class function
		this.addClickTracking() // enable click tracking
		this.addRecipients() // process list of recipients
	}

	formatAddresses(recipients) {
		return recipients.map(({ email }) => {
			return new helper.Email(email)
		})
	}

	// helper for sendgrid for click tracking & link substitution
	addClickTracking() {
		const trackingSettings = new helper.TrackingSettings()
		const clickTracking = new helper.ClickTracking(true, true)

		trackingSettings.setClickTracking(clickTracking)
		this.addTrackingSettings(trackingSettings)
	}

	addRecipients() {
		const personalize = new helper.Personalization()
		this.recipients.forEach(recipient => {
			personalize.addTo(recipient)
		})
		this.addPersonalization(personalize)
	}

	async send() {
		const request = this.sgApi.emptyRequest({
			method: 'POST',
			path: '/v3/mail/send',
			body: this.toJSON()
		})

		const response = await this.sgApi.API(request)
		return response
	}
}

module.exports = Mailer
