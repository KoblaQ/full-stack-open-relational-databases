import { useState } from 'react'

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false)

  const showWhenVisible = { display: visible ? '' : 'none' }

  const buttonLabel = visible ? 'hide' : 'view'

  const toggleVisibility = () => {
    setVisible(!visible)
    // console.log(blog)
    // console.log(user)
    // console.log('blog.user.name:', blog.user.name)
    // console.log('Type of blog.user.name:', typeof blog.user.name)

    // console.log('user.name:', user.name)
    // console.log('Type of user.name:', typeof user.name)
    // console.log('typeof blog.user:', typeof blog.user)
    // console.log('typeof user:', typeof user)
    // console.log('typeof blog:', typeof blog)
    // console.log(
    //   'blogOwner:',
    //   typeof blog.user === 'object' ? blog.user.name : blog.user
    // )
    // console.log('typeof blogOwner:', blog.user.id)
  }

  // Update the likes in the blog object
  const updateLikes = (event) => {
    event.preventDefault()

    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
    }
    // console.log('Updated blog:', updatedBlog)
    updateBlog(updatedBlog)
  }

  const handleDeleteBlog = (event) => {
    event.preventDefault()
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlog(blog.id)
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }
  return (
    <div style={blogStyle} className="blog">
      <p>
        {blog.title} {blog.author}{' '}
        <button onClick={toggleVisibility}>{buttonLabel}</button>
      </p>
      <div style={showWhenVisible} className="blogDetails">
        <a href={blog.url} className="blogUrl">
          {blog.url}
        </a>
        <p className="blogLikes">
          likes {blog.likes} <button onClick={updateLikes}>like</button>
        </p>
        {blog.user.name === user.name && (
          <button
            style={{ backgroundColor: '#24A0ED' }}
            onClick={handleDeleteBlog}
          >
            remove
          </button>
        )}
      </div>
    </div>
  )
}

export default Blog
