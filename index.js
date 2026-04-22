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

class Blog extends Model {}

Blog.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    author: { type: DataTypes.TEXT },
    url: { type: DataTypes.TEXT, allowNull: false },
    title: { type: DataTypes.TEXT, allowNull: false },
    likes: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  { sequelize, underscored: true, timestamps: false, modelName: 'blog' },
)

Blog.sync()

// GET all blogs
app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.findAll()
  console.log(JSON.stringify(blogs, null, 2))
  res.json(blogs)
})

// POST a blog
app.post('/api/blogs', async (req, res) => {
  try {
    console.log(req.body)
    const blog = await Blog.create({ ...req.body })
    return res.json(blog)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

// DELETE blog by id
app.delete('/api/blogs/:id', async (req, res) => {
  const id = req.params.id

  const blogToDelete = await Blog.findByPk(req.params.id)
  if (blogToDelete) {
    await Blog.destroy({ where: { id: id } })
    return res.status(204).end()
  } else {
    return res.status(404).json({ error: 'blog not found' })
  }
})

const PORT = process.env.PORT || 3001

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully')
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error('Unable to connect to the database: ', error)
  })
