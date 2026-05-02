const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readingList')
const Session = require('./session')

// Make the relations
User.hasMany(Blog)
Blog.belongsTo(User)
// Session.belongsTo(User)

// User.sync({ alter: true })
// Blog.sync({ alter: true })

User.belongsToMany(Blog, { through: ReadingList, as: 'readings' })
Blog.belongsToMany(User, { through: ReadingList, as: 'unread' })

module.exports = {
  Blog,
  User,
  ReadingList,
  Session,
}
