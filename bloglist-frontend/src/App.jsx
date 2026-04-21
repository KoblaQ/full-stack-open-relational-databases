import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({
    message: null,
    type: null,
  })

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  // UseEffect for the user in localStorage
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token) // Get and set the user jwt from the localStorage
    }
  }, [])

  // UseRef
  const blogFormRef = useRef() // Passed as a prop to the Toggable Component

  // create a blog post helper function
  const addBlog = async (blogObject) => {
    const createdBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(createdBlog))

    setNotification({
      message: `a new blog ${blogObject.title} by ${blogObject.author} added`,
      type: 'success',
    })
    // Make the blog notification vanish after 5 seconds
    setTimeout(() => {
      setNotification({ message: null, type: null })
    }, 5000)
    blogFormRef.current.toggleVisibility() // Hide the blog form after submission
  }

  // Update Blog likes
  const updateBlog = async (blogObject) => {
    // console.log('Updating blog:', blogObject)
    const updatedBlog = await blogService.update(blogObject.id, blogObject)
    // Update the blog state to reflect the new change in likes
    setBlogs(
      blogs.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog))
    )
  }
  // Delete blog
  const deleteBlog = async (id) => {
    await blogService.deleteBlog(id)
    setBlogs(blogs.filter((blog) => blog.id !== id)) // Refresh the blogs after deletion
  }

  // Create Blog form
  const blogForm = () => {
    return (
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
    )
  }

  // Login Helper functions
  const loginForm = () => (
    <LoginForm
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      notification={notification}
      handleLogin={handleLogin}
    />
  )

  // Login Handler
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user)) // Save the logged in user to local storage.
      setUser(user)
      blogService.setToken(user.token) // set the token for the user
      setUsername('')
      setPassword('')
    } catch {
      setNotification({ message: 'wrong username or password', type: 'error' })
      setTimeout(() => {
        setNotification({ message: null, type: null })
      }, 5000)
    }
  }

  // Logout Handler
  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  if (user === null) {
    return loginForm()
  }
  return (
    <div>
      <Notification message={notification.message} type={notification.type} />
      <h2>blogs</h2>
      {user && (
        <div>
          <p>
            {user.name} logged in
            <button onClick={handleLogout}>logout</button>
          </p>
        </div>
      )}

      {blogForm()}

      {
        //Sort the blogs based on the number of likes before rendering them
        blogs
          .sort((firstBlog, secondBlog) => secondBlog.likes - firstBlog.likes)
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              updateBlog={updateBlog}
              deleteBlog={deleteBlog}
              user={user}
            />
          ))
      }
    </div>
  )
}

export default App
