const Note = require('./note')
const User = require('./user')

// Add the foreign keys
User.hasMany(Note)
Note.belongsTo(User)

// make the possible schema changes

// User.sync({ alter: true })
// Note.sync({ alter: true })

module.exports = {
  Note,
  User,
}
