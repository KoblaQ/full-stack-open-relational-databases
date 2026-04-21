import Notification from './Notification'

const LoginForm = ({
  password,
  setPassword,
  username,
  setUsername,
  handleLogin,
  notification,
}) => {
  return (
    <form onSubmit={handleLogin}>
      <h2>log in to application</h2>
      <Notification message={notification.message} type={notification.type} />
      <div>
        <label>
          username
          <input
            name="username"
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password{' '}
          <input
            name="password"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )
}

export default LoginForm
