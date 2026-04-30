const router = require('express').Router()
const { tokenExtractor } = require('../util/middleware')

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

router.put('/:id', tokenExtractor, async (req, res) => {
  const readingListEntry = await ReadingList.findByPk(req.params.id)
  console.log(readingListEntry)

  if (!readingListEntry) {
    return res.status(400).json({ error: 'Reading list entry not found' })
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
