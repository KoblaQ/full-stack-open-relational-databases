const router = require('express').Router()
const Session = require('../models/session')
// const { tokenExtractor } = require('../util/middleware')

router.delete('/', async (request, response) => {
  try {
    const session = await Session.findByPk(request.body.userId)

    if (!session) {
      return response.status(404).json({ error: 'Session not found' })
    }

    await session.destroy()

    return response.status(204).json({ message: 'Logged out successfully' })
  } catch (error) {
    response.status(500).json({ error: error.message })
  }
})

module.exports = router
