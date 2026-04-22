require('dotenv').config()
const { Sequelize, QueryTypes } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
})

const main = async () => {
  try {
    // connect to database and retrieve blogs
    await sequelize.authenticate()
    console.log('Connection has been established successfully')
    const notes = await sequelize.query('SELECT * FROM blogs', {
      type: QueryTypes.SELECT,
    })

    // Print the notes in readable format in the console
    notes.map((note) => {
      console.log(`${note.author}: '${note.title}', ${note.likes} likes`)
    })

    sequelize.close()
  } catch (error) {
    console.error('Unable to connect to the database: ', error)
  }
}

main()
