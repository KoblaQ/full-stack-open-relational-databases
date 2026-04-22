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
    await sequelize.authenticate()
    console.log('Connection has been established successfully')
    const notes = await sequelize.query('SELECT * FROM blogs', {
      type: QueryTypes.SELECT,
    })

    notes.map((note) => {
      console.log(`${note.author}: '${note.title}', ${note.likes} likes`)
    })

    // console.log(notes)
    sequelize.close()
  } catch (error) {
    console.error('Unable to connect to the database: ', error)
  }
}

main()
