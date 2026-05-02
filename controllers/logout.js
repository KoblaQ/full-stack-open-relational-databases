const router = require('express').Router()
const Session = require('../models/session')
const { tokenExtractor } = require('../util/middleware')

router.delete('/', tokenExtractor, async (request, response) => {
  try {
    await Session.destroy({
      where: { userId: request.decodedToken.id },
    })

    return response.status(204).end()
    // json({ message: 'Logged out successfully' })
  } catch (error) {
    response.status(500).json({ error: error.message })
  }
})

module.exports = router
