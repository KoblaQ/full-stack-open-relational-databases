const router = require('express').Router()

const { User, Blog } = require('../models')

router.get('/', async (req, res) => {
  return res.status(200).end()
})

router.post('/api/reset', async (req, res) => {
  try {
    await User.destroy({
      truncate: true,
      cascade: true,
    })
    await Blog.destroy({
      truncate: true,
      cascade: true,
    })
    return res.status(204).end()
  } catch (error) {
    return res.status(400).json(error)
  }
})

module.exports = router
