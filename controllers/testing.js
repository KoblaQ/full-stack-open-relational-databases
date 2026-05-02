const router = require('express').Router()

const { User, Blog, Session, ReadingList } = require('../models')

router.get('/', async (req, res) => {
  return res.status(200).end()
})

router.post('/api/reset', async (req, res) => {
  try {
    await Blog.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true,
    })
    await User.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true,
    })
    await Session.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true,
    })
    await ReadingList.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true,
    })

    return res.status(204).end()
  } catch (error) {
    return res.status(400).json(error)
  }
})

module.exports = router
