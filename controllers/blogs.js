const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const router = require('express').Router()
const { Op } = require('sequelize')

const { Blog, User } = require('../models')

// Blog Finding middleware
const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  if (!req.blog) {
    return res.status(404).end()
  }
  next()
}

// Errorhandler middleware
const errorHandler = (error, request, response, next) => {
  if (error.name === 'SequelizeValidationError') {
    return response
      .status(400)
      .json({ error: error.errors.map((err) => err.message) })
  }
  // console.log(error.message)
  next(error)
}

// Token extractor middleware
const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch (error) {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }

  next()
}

// GET all blogs
router.get('/', async (req, res, next) => {
  try {
    const where = {}

    if (req.query.search) {
      where[Op.or] = [
        {
          title: {
            [Op.iLike]: `%${req.query.search}%`,
          },
        },
        {
          author: {
            [Op.iLike]: `%${req.query.search}%`,
          },
        },
      ]
    }

    const blogs = await Blog.findAll({
      attributes: { exclude: ['userId'] },
      include: {
        model: User,
        attributes: ['name'],
      },
      where,
      order: [['likes', 'DESC']],
      // order: sequelize.col('likes'),
    })
    // console.log(JSON.stringify(blogs, null, 2))
    res.json(blogs)
  } catch (error) {
    next(error)
  }
})

// GET blog by id
router.get('/:id', blogFinder, async (req, res, next) => {
  try {
    res.json(req.blog)
  } catch (error) {
    next(error)
  }
})

// POST/Create a new blog
router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    // console.log(req.body)
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({ ...req.body, userId: user.id })

    return res.json(blog)
  } catch (error) {
    // return res.status(400).json({ error })
    next(error)
  }
})

// UPDATE blog likes
router.put('/:id', blogFinder, async (req, res, next) => {
  try {
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.blog)
  } catch (error) {
    next(error)
  }
})

// DELETE blog by id
router.delete('/:id', tokenExtractor, blogFinder, async (req, res, next) => {
  try {
    if (req.blog.userId === req.decodedToken.id) {
      await req.blog.destroy()
      return res.status(204).end()
    } else {
      return res.status(401).json({ error: 'Invalid user' })
    }
  } catch (error) {
    next(error)
  }
})

router.use(errorHandler)

module.exports = router
