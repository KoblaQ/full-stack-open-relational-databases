const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

// CREATE A NEW USER
usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  // validate password length befor hashing
  if (password.length < 3) {
    return response
      .status(400)
      .json({ error: 'password length needs to be longer than 3 characters' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

// GET ALL USERS
usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    url: 1,
    title: 1,
    author: 1,
  })
  response.json(users)
})

module.exports = usersRouter
