// Recieves array of blogs and returns value 1
const dummy = (blogs) => {
  return 1
}

// Recieves array of blogs and returns total number of likes
const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }
  return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0)
}

// Recieves array of blogs and returns the blog with most likes
const favoriteBlog = (blogs) => {
  const favorite = blogs.reduce((maxLikes, blog) => {
    return blog.likes > maxLikes.likes ? blog : maxLikes
  })

  return blogs.length === 0 ? {} : favorite
}

// Recieves array of blogs and returns the author with most blogs and the number of blogs
const mostBlogs = (blogs) => {
  const listOfAuthors = blogs.reduce((count, blog) => {
    count[blog.author] = (count[blog.author] || 0) + 1
    return count
  }, {})
  const mostBlogsAuthor = Object.keys(listOfAuthors).reduce((author, max) =>
    listOfAuthors[author] > listOfAuthors[max] ? author : max
  )
  return {
    author: mostBlogsAuthor,
    blogs: listOfAuthors[mostBlogsAuthor],
  }
}

// Recieves array of blogs and returns the author with most likes and the number of likes
const mostLikes = (blogs) => {
  const mostLiked = blogs.reduce((max, blog) => {
    return blog.likes > max.likes ? blog : max
  })

  return blogs.length === 0
    ? {}
    : {
        author: mostLiked.author,
        likes: mostLiked.likes,
      }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
