const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readingList')

// Make the relations
User.hasMany(Blog)
Blog.belongsTo(User)

// User.sync({ alter: true })
// Blog.sync({ alter: true })

User.belongsToMany(Blog, { through: ReadingList, as: 'read' })
Blog.belongsToMany(User, { through: ReadingList, as: 'unread' })

module.exports = {
  Blog,
  User,
  ReadingList,
}
