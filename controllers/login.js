const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const User = require('../models/user')
const Session = require('../models/session')

router.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({
    where: { username: body.username },
  })

  // Check if password matches
  const passwordCorrect =
    user === null
      ? false
      : await bcrypt.compare(body.password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password',
    })
  }

  // Send payload to tokens
  const userForToken = {
    username: user.username,
    id: user.id,
    disabled: user.disabled,
  }

  const token = jwt.sign(userForToken, SECRET, { expiresIn: '5m' })

  // Check if user is disabled

  if (user.disabled === true) {
    return response.status(403).json({ error: 'User account disabled' })
  }

  // Create session
  const newSession = await Session.create({
    userId: user.id,
    token,
  })
  request.token = newSession.token

  response.status(200).send({
    token,
    username: user.username,
    name: user.name,
    disabled: user.disabled,
  })
})

module.exports = router
