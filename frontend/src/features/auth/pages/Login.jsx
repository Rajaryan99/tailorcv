import '../auth.form.scss'

export default function Login() {

  const handleSubmit = (e) => {
    e.preventDefault()
  }
  return (
    <main>
      <div className="formContainer">
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>

          <div className="inputGroup">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Enter email address" />
          </div>
          <div className="inputGroup">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Enter password" />
          </div>

          <button className="button primary-button">
              login
          </button>

       </form>
      </div>
    </main>
  )
}
