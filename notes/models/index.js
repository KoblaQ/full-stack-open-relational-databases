const Note = require('./note')
const User = require('./user')
const Team = require('./team')
const Membership = require('./membership')
const UserNotes = require('./userNote')

// Add the foreign keys
User.hasMany(Note)
Note.belongsTo(User)

// make the possible schema changes (obsolete because of the use of migrations now)
// User.sync({ alter: true })
// Note.sync({ alter: true })

User.belongsToMany(Team, { through: Membership })
Team.belongsToMany(User, { through: Membership })

User.belongsToMany(Note, { through: UserNotes, as: 'marked_notes' })
Note.belongsToMany(User, { through: UserNotes, as: 'users_marked' })

// async function printUserNotes() {
//   const user = await User.findByPk(1, {
//     include: {
//       model: Note,
//     },
//   })

//   user.notes.forEach((note) => {
//     console.log('NOTE: ', note.content)
//   })
// }
// printUserNotes()

// async function printUserTeams() {
//   const user = await User.findByPk(1, {
//     include: {
//       model: Team,
//     },
//   })

//   user.teams.forEach((team) => {
//     console.log('TEAM: ', team.name)
//   })
// }
// printUserTeams()

module.exports = {
  Note,
  User,
  Team,
  Membership,
  UserNotes,
}
