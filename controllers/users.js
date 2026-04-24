const bcrypt = require('bcrypt')

const router = require('express').Router()

const { User, Blog } = require('../models')

// GET all users
router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['passwordHash'] }, // exclude the password
  })
  res.json(users)
})

// CREATE a new user
router.post('/', async (req, res) => {
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
    return res.status(400).json({ error })
  }
})

// UPDATE user's name with username in params
router.put('/:username', async (req, res) => {
  const user = await User.findOne({ where: { username: req.params.username } })

  if (user) {
    user.name = req.body.name
    const updatedUser = await user.save()
    res.json(updatedUser)
  } else {
    return res.status(404).end()
  }
})

module.exports = router
