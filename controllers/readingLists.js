const router = require('express').Router()

const { ReadingList, User, Blog } = require('../models')

router.post('/', async (req, res) => {
  const { blogId, userId } = req.body

  const user = await User.findByPk(userId)
  if (!user) {
    return res.status(400).json({ error: 'User not found' })
  }

  const blog = await Blog.findByPk(blogId)
  if (!blog) {
    return res.status(400).json({ error: 'Blog not found' })
  }

  try {
    const readingList = await ReadingList.create({ userId, blogId })
    res.json(readingList)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

module.exports = router
