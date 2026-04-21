import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog /> component', () => {
  let updateBlog

  beforeEach(() => {
    const blog = {
      title: 'Testing blog title in component',
      author: 'Author for test',
      url: 'www.fullstackopen.com',
      likes: 2,
      user: { name: 'Tester' },
    }
    const user = {
      name: 'Tester',
    }
    updateBlog = vi.fn()
    render(<Blog blog={blog} updateBlog={updateBlog} user={user} />)
  })

  test('renders the blog title and author and not the url nor number of likes', () => {
    const blogTitleAndAuthor = screen.getByText(
      'Testing blog title in component Author for test'
    )

    const blogUrl = screen.queryByText('www.fullstackopen.com')
    const blogLikes = screen.queryByText('likes 2')

    // screen.debug(blogTitleAndAuthor)
    // screen.debug(blogLikes)

    expect(blogTitleAndAuthor).toBeVisible(
      'Testing blog title in component Author for test'
    )
    expect(blogUrl).toBeDefined()
    expect(blogUrl).not.toBeVisible() // Expects the blog url to be hidden
    expect(blogLikes).toBeDefined()
    expect(blogLikes).not.toBeVisible() // Expects the blog likes to be hidden
  })

  test('blog URL and number of likes are shown when the view button is clicked', async () => {
    const userLiker = userEvent.setup()
    const viewButton = screen.getByText('view')

    const blogUrl = screen.getByText('www.fullstackopen.com')
    const blogLikes = screen.getByText('likes 2')

    // expect(blogUrl).not.toBeVisible()
    // screen.debug(viewButton)
    // screen.debug(blogUrl)
    await userLiker.click(viewButton)

    // screen.debug(viewButton)

    expect(blogUrl).toBeVisible()
    expect(blogLikes).toBeVisible()
  })

  test('number of likes increase when like button is clicked twice', async () => {
    const userLiker = userEvent.setup()
    const likeButton = screen.getByText('like')

    // screen.debug(blogLikes)

    await userLiker.click(likeButton)
    expect(updateBlog.mock.calls).toHaveLength(1)
    await userLiker.click(likeButton)

    // screen.debug(blogLikes)
    // console.log(updateBlog.mock.calls)

    expect(updateBlog.mock.calls).toHaveLength(2)
  })
})
