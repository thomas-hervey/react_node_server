module.exports = (req, res, next) => {
	// if no logged in user, terminate request
	if (!req.user) {
		return res.status(401).send({ error: 'You must login' })
	}
	// if there is a user, let user continue on to request handler
	next()
}
