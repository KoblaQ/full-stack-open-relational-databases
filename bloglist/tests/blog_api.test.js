const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  // console.log(blogsAtEnd)
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('unique identifier property of blog posts is named id', async () => {
  const blogsAtEnd = await helper.blogsInDb()
  const blogToTest = blogsAtEnd[0]

  assert.ok(Object.keys(blogToTest).includes('id'))
})

// FAILED TESTS DUE TO AUTHENTICATION REQUIREMENTS IN CONTROLLERS - FIXED
describe('when there is jwt authorization', () => {
  let token = null // Declare the token variable

  // Before each test
  beforeEach(async () => {
    await User.deleteMany({})

    // create user for test case
    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({ username: 'Kafui', name: 'Kafui Q', passwordHash })

    await user.save() // Save the user to the database

    // Login to get the token
    const response = await api
      .post('/api/login')
      .send({ username: user.username, password: 'secret' })

    token = await response.body.token // Save the token for use in tests
  })

  // Run tests
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'Testing post Blog with authorization',
      // author: 'Kafui',
      url: 'https://fullstackopen.com/en/',
      // likes: 100,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    assert.strictEqual(blogsAtEnd[blogsAtEnd.length - 1].title, newBlog.title)
  })

  // Test fails when authentication token is not provided
  test('adding a blog fails without jwt token authorization', async () => {
    const newBlog = {
      title: 'Testing post Blog without authorization token',
      // author: 'Kafui',
      url: 'https://fullstackopen.com/en/',
      // likes: 100,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length) // No change should be recorded
  })

  test('verify that likes property defaults to value 0 if left out', async () => {
    const newBlog = {
      title: 'Testing post Blog missing the likes property',
      url: 'https://fullstackopen.com/en/',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd[blogsAtEnd.length - 1].likes, 0)
  })

  describe('missing title or url', () => {
    test('a blog without title cannot be added', async () => {
      const newBlog = {
        author: 'Kafui',
        url: 'https://fullstackopen.com/en/',
        likes: 99,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('a blog without url cannot be added', async () => {
      const newBlog = {
        title: 'Testing post Blog without a url',
        author: 'Kafui',
        likes: 35,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  test('delete a blog by ID', async () => {
    // Create add the blog to be deleted (Needs the same user to be created first in beforeEach)
    const newBlog = {
      title: 'Testing post Blog to be deleted by ID',
      url: 'https://fullstackopen.com/en/',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    let blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    assert.strictEqual(blogsAtEnd[blogsAtEnd.length - 1].title, newBlog.title)

    // Initiate deletion of the last blog
    const blogsBeforeDelete = await helper.blogsInDb()
    const blogToBeDeleted = blogsBeforeDelete[blogsBeforeDelete.length - 1] // Delete the last one instead

    await api
      .delete(`/api/blogs/${blogToBeDeleted.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)
    blogsAtEnd = await helper.blogsInDb()

    const blogTitles = blogsAtEnd.map((blog) => blog.title)
    assert(!blogTitles.includes(blogToBeDeleted.title))

    assert.strictEqual(blogsAtEnd.length, blogsBeforeDelete.length - 1)
  })
})

test('blog likes can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]
  blogToUpdate.likes = 1000
  await api.put(`/api/blogs/${blogToUpdate.id}`).send(blogToUpdate).expect(200)

  const blogsAtEnd = await helper.blogsInDb()
  const updatedBlog = blogsAtEnd[0]
  assert.strictEqual(updatedBlog.likes, 1000)
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'EdemQ',
      name: 'Edem Quashigah',
      password: 'password',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper status code and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'secret',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper status code and message if username is less than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Ed',
      name: 'Edem Quashigah',
      password: 'password',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(
      result.body.error.includes(
        'User validation failed: username: Path `username` (`Ed`, length 2) is shorter than the minimum allowed length (3).'
      )
    )

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper status code and message if password is less than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'KoblaQ',
      name: 'Edem Quashigah',
      password: 'pa',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(
      result.body.error.includes(
        'password length needs to be longer than 3 characters'
      )
    )

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
