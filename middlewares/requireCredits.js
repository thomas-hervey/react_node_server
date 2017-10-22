module.exports = (req, res, next) => {
	// if not enough credits on account
	if (req.user.credits < 1) {
		return res.status(403).send({ error: 'Not enough credits' })
	}
	// if user has enough credits, let user continue on to request handler
	next()
}
