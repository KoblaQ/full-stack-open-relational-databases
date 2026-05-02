const router = require('express').Router()
const { tokenExtractor } = require('../util/middleware')

const { ReadingList, User, Blog } = require('../models')

router.post('/', async (req, res) => {
  const { blogId, userId } = req.body

  if (!blogId || !userId) {
    return res.status(400).json({ error: 'Blog id or User id missing' })
  }

  const user = await User.findByPk(userId)
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  const blog = await Blog.findByPk(blogId)
  if (!blog) {
    return res.status(404).json({ error: 'Blog not found' })
  }

  try {
    const readingList = await ReadingList.create({
      user_id: userId,
      blog_id: blogId,
    })
    res.json(readingList)
    console.log(typeof readingList)
    console.log(readingList instanceof ReadingList)
    console.log(readingList.toJSON())
    console.log(readingList)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.put('/:id', tokenExtractor, async (req, res) => {
  const readingListEntry = await ReadingList.findByPk(req.params.id)
  console.log(readingListEntry)

  if (!readingListEntry) {
    return res.status(404).json({ error: 'Reading list entry not found' })
  }

  try {
    if (readingListEntry.userId === req.decodedToken.id) {
      // readingListEntry.read = !readingListEntry.read
      readingListEntry.read = req.body.read
      await readingListEntry.save()
      res.json(readingListEntry)
    } else {
      res.status(401).json({ error: 'invalid user' })
    }
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

module.exports = router
