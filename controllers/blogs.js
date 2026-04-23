const router = require('express').Router()

const { Blog } = require('../models')

// Blog Finding middleware
const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  if (!req.blog) {
    return res.status(404).end()
  }
  next()
}

// GET all blogs
router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
  // console.log(JSON.stringify(blogs, null, 2))
  res.json(blogs)
})

// GET blog by id
router.get('/:id', blogFinder, async (req, res) => {
  res.json(req.blog)
})

// POST a blog
router.post('/', async (req, res) => {
  try {
    console.log(req.body)
    const blog = await Blog.create({ ...req.body })
    return res.json(blog)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

// UPDATE blog likes
router.put('/:id', blogFinder, async (req, res) => {
  req.blog.likes = req.body.likes
  await req.blog.save()
  res.json(req.blog)
})

// DELETE blog by id
router.delete('/:id', blogFinder, async (req, res) => {
  await req.blog.destroy()
  return res.status(204).end()
})

module.exports = router
