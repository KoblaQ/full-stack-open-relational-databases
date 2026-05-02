const jwt = require('jsonwebtoken')
const { SECRET } = require('./config.js')
const { User, Session } = require('../models')
const { response } = require('express')

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      // req.token = authorization.substring(7)
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }

  // const user = await Session.findByPk(req.decodedToken.id)
  const token = authorization.substring(7)
  const session = await Session.findOne({ where: { token } })
  req.token = token

  if (!session) {
    return res.status(401).json({ error: 'session invalid' })
  }

  const user = await User.findByPk(req.decodedToken.id)
  req.user = user
  // Check if user is disabled
  if (!user || user.disabled === true) {
    return res.status(403).json({ error: 'User account disabled/invalid' })
  }

  next()
}

// User Authentication
// const userAuthenticator = async (req, res, next) => {
//   const session = await Session.findByPk(user.id)

//   // Check if the session exists
//   // const session = await Session.findOne({
//   //   where: { token: req.decodedToken },
//   // })

//   if (!session) {
//     return res.status(401).json({ error: 'session invalid' })
//   }
//   const user = await Session.findByPk(req.decodedToken.id)

//   // Check if user is disabled
//   if (!user || user.disabled === true) {
//     return response.status(403).json({ error: 'User account disabled/invalid' })
//   }
//   // if (!user) {
//   //   return res.status(401).json({ error: 'user not found' })
//   // }

//   next()
// }

module.exports = { tokenExtractor }
