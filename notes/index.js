const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

app.use(express.json())

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()

// const sequelize = new Sequelize(process.env.DATABASE_URL, {
//   dialect: 'postgres',
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false,
//     },
//   },
// })

// // const main = async () => {
// //   try {
// //     await sequelize.authenticate()
// //     // console.log('Connection has been established successfully.')
// //     const notes = await sequelize.query('SELECT * FROM notes', {
// //       type: QueryTypes.SELECT,
// //     })
// //     console.log(notes)
// //     // sequelize.close()
// //   } catch (error) {
// //     console.error('Unable to connect to the database: ', error)
// //   }
// // }

// // main()

// class Note extends Model {}
// Note.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     content: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//     },
//     important: {
//       type: DataTypes.BOOLEAN,
//     },
//     date: {
//       type: DataTypes.DATE,
//     },
//   },
//   { sequelize, underscored: true, timestamps: false, modelName: 'note' },
// )

// Note.sync()

// // Get all notes

// app.get('/api/notes', async (req, res) => {
//   // try {
//   // await sequelize.authenticate()
//   // console.log('Connection has been established successfully.')
//   const notes = await Note.findAll()
//   // console.log(notes.map((n) => n.toJSON()))
//   // console.log(JSON.stringify(notes))
//   console.log(JSON.stringify(notes, null, 2))
//   res.json(notes)
//   // } catch (error) {
//   //   console.error('Unable to connect to the database: ', error)
//   // }
//   // sequelize.close()
// })

// // Get note by ID
// app.get('/api/notes/:id', async (req, res) => {
//   const note = await Note.findByPk(req.params.id)
//   if (note) {
//     console.log(note.toJSON())
//     return res.json(note)
//   } else {
//     return res.status(404).end()
//   }
// })
// // app.get('/api/notes/:id', async (req, res) => {
// //   const note = await Note.findByPk(req.params.id)
// //   if (note) {
// //     console.log(note)
// //     res.json(note)
// //   } else {
// //     res.status(404).end()
// //   }
// // })

// // Post with build
// // app.post('/api/notes', async (req, res) => {
// //   console.log(req.body)
// //   const note = Note.build(req.body)
// //   note.important = true
// //   await note.save()
// //   return res.json(note)
// // })

// // Post with create
// app.post('/api/notes', async (req, res) => {
//   try {
//     console.log(req.body)
//     const note = await Note.create({ ...req.body, date: new Date() })
//     return res.json(note)
//   } catch (error) {
//     return res.status(400).json({ error })
//   }
// })

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log('Connection has been established successfully.')
//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`)
//     })
//   })
//   .catch((error) => {
//     console.error('Unable to connect to the database: ', error)
//   })
