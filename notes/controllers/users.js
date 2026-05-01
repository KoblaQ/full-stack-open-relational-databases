const router = require('express').Router()
const { tokenExtractor, isAdmin } = require('../util/middleware')

const { User, Note, Team } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: [
      {
        model: Note,
        attributes: {
          exclude: ['usern_id'],
        },
      },
      {
        model: Team,
        attributes: ['name', 'id'],
        through: {
          attributes: [], // add to remove the membership extra table
        },
      },
    ],
  })

  // const adminUsers = await User.scope('admin').findAll()

  // const disabledUsers = await User.scope('disabled').findAll()

  // const fuiUsers = await User.scope({ method: ['name', '%fui%'] }).findAll()
  // // res.json(fuiUsers)

  // // admins with the string jami in their name
  // const jamiUsers = await User.scope('admin', {
  //   method: ['name', '%jami%'],
  // }).findAll()

  // const edem = await User.findOne({ where: { name: 'Edem Coder' } })
  const edem = await User.findByPk(1)
  const cnt = await edem.numberOfNotes()
  console.log(`Edem has created ${cnt} notes`)

  const usersNotes = await User.withNotes(1)
  console.log(JSON.stringify(usersNotes, null, 2))
  usersNotes.forEach((u) => {
    console.log(u.name)
  })

  res.json(users)
})

router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: {
      exclude: [''],
    },
    include: [
      {
        model: Note,
        attributes: { exclude: ['usernId'] },
      },
      {
        model: Note,
        as: 'marked_notes',
        attributes: { exclude: ['usernId'] },
        through: {
          attributes: [],
        },
        include: {
          model: User,
          attributes: ['name'],
        },
      },
      // {
      //   model: Team,
      //   attributes: ['name', 'id'],
      //   through: {
      //     attributes: [],
      //   },
      // },
    ],
  })

  // if (user) {
  //   res.json(user)
  // } else {
  //   res.status(404).end()
  // }

  if (!user) {
    return res.status(404).end()
  }

  // Lazy loading of teams by the getTeams method
  let teams = undefined
  if (req.query.teams) {
    teams = await user.getTeams({
      attributes: ['name'],
      joinTableAttributes: [],
    })
  }

  res.json({ ...user.toJSON(), teams })
})
// router.get('/:id', async (req, res) => {
//   const user = await User.findByPk(req.params.id)

//   if (user) {
//     res.json(user)
//   } else {
//     res.status(404).end()
//   }
// })

// router.get('/:id', async (req, res) => {
//   const user = await User.findByPk(req.params.id, {
//     include: {
//       model: Note,
//     },
//   })

//   if (user) {
//     // can't fields to the model instance (Objects returned by sequelize are not real that we can modify)
//     // user.note_count = user.notes.length
//     // delete user.notes
//     res.json({
//       // Instead create a new object and return the desired fields
//       username: user.username,
//       name: user.name,
//       note_count: user.notes.length,
//     })
//   } else {
//     res.status(404).end()
//   }
// })

router.put('/:username', tokenExtractor, isAdmin, async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username,
    },
  })

  if (user) {
    user.disabled = req.body.disabled
    await user.save()
    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router
