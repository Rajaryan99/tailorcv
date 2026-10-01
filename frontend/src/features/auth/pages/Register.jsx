export default function Register() {
  const handleSubmit = (e) => {
    e.preventDefault()
  }
  return (
    <main>
      <div className="formContainer">
        <h1>Register</h1>

        <form onSubmit={handleSubmit}>

            <div className="inputGroup">
            <label htmlFor="username">Username</label>
            <input type="username" id="username" placeholder="Enter your username" />
          </div>
          <div className="inputGroup">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Enter email address" />
          </div>
          <div className="inputGroup">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Enter password" />
          </div>

          <button className="button primary-button">
              Register
          </button>

       </form>
      </div>
    </main>
  )

}
