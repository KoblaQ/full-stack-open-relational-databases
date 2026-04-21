import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> creates a new blog', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByLabelText('title:')
  const authorInput = screen.getByLabelText('author:')
  const urlInput = screen.getByLabelText('url:')

  const createButton = screen.getByText('create')

  await user.type(titleInput, 'Testing BlogForm title')
  await user.type(authorInput, 'Blog Author')
  await user.type(urlInput, 'www.fullstackopen.com')

  await user.click(createButton)

  // console.log(createBlog.mock.calls)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Testing BlogForm title')
  expect(createBlog.mock.calls[0][0].author).toBe('Blog Author')
  expect(createBlog.mock.calls[0][0].url).toBe('www.fullstackopen.com')
})
