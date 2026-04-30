const bcrypt = require('bcrypt')

const router = require('express').Router()
const { Op } = require('sequelize')

const { User, Blog } = require('../models')

// Error handler middleware
const errorHandler = (error, request, response, next) => {
  console.log(error)
  if (error.name === 'SequelizeValidationError') {
    return response
      .status(400)
      .json({ error: error.errors.map((err) => err.message) })
  } else if (error.name === 'SequelizeUniqueConstraintError') {
    return response
      .status(400)
      .json({ error: error.errors.map((err) => err.message) })
  } else {
    return response.json(error)
  }

  next(error)
}

// GET all users
router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['passwordHash'] }, // exclude the password
    include: {
      model: Blog,
      attributes: {
        exclude: ['userId'],
      },
    },
  })
  res.json(users)
})

// GET user by id
// added query parameters in request

router.get('/:id', async (req, res, next) => {
  const where = {}

  if (req.query.read) {
    // console.log(req.query.read)
    where.read = { [Op.eq]: req.query.read }
  }

  try {
    const user = await User.findByPk(req.params.id, {
      attributes: {
        exclude: ['id', 'passwordHash', 'createdAt', 'updatedAt'],
      },
      include: [
        {
          model: Blog,
          as: 'readings',
          attributes: { exclude: ['createdAt', 'updatedAt', 'userId'] },
          through: {
            attributes: ['read', 'id'],
            where, // filters the read or unread blogs from the list
          },
        },
      ],
      // where
    })

    if (user) {
      res.json(user)
    } else {
      return res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

// CREATE a new user
router.post('/', async (req, res, next) => {
  const { name, username, password } = req.body

  // convert the password to hashed value
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = {
    name,
    username,
    passwordHash,
  }

  try {
    const savedUser = await User.create(user)
    res.json(savedUser)
  } catch (error) {
    next(error)
  }
})

// UPDATE user's name with username in params
router.put('/:username', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { username: req.params.username },
    })

    if (user) {
      user.name = req.body.name
      const updatedUser = await user.save()
      res.json(updatedUser)
    } else {
      return res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

router.use(errorHandler)

module.exports = router
