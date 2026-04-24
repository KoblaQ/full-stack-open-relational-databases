const Note = require('./note')
const User = require('./user')

// Add the foreign keys
User.hasMany(Note)
Note.belongsTo(User)

Note.sync({ alter: true })
User.sync({ alter: true })

module.exports = {
  Note,
  User,
}
