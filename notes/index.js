require('dotenv').config()
const { Sequelize, QueryTypes, Model, DataTypes } = require('sequelize')
const express = require('express')
const app = express()

app.use(express.json())

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
})

// const main = async () => {
//   try {
//     await sequelize.authenticate()
//     // console.log('Connection has been established successfully.')
//     const notes = await sequelize.query('SELECT * FROM notes', {
//       type: QueryTypes.SELECT,
//     })
//     console.log(notes)
//     // sequelize.close()
//   } catch (error) {
//     console.error('Unable to connect to the database: ', error)
//   }
// }

// main()

class Note extends Model {}
Note.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    important: {
      type: DataTypes.BOOLEAN,
    },
    date: {
      type: DataTypes.DATE,
    },
  },
  { sequelize, underscored: true, timestamps: false, modelName: 'note' },
)

app.get('/api/notes', async (req, res) => {
  // try {
  // await sequelize.authenticate()
  // console.log('Connection has been established successfully.')
  const notes = await Note.findAll()
  res.json(notes)
  // } catch (error) {
  //   console.error('Unable to connect to the database: ', error)
  // }
  // sequelize.close()
})

// Post with build
// app.post('/api/notes', async (req, res) => {
//   console.log(req.body)
//   const note = Note.build(req.body)
//   note.important = true
//   await note.save()
//   return res.json(note)
// })

// Post with create
app.post('/api/notes', async (req, res) => {
  try {
    console.log(req.body)
    const note = await Note.create({ ...req.body, date: new Date() })
    return res.json(note)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

const PORT = process.env.PORT || 3001

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error('Unable to connect to the database: ', error)
  })
