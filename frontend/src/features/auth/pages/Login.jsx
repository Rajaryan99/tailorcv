import '../auth.form.scss'
import { Link } from 'react-router-dom'

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

              <p>Dont have an account? <Link to={"/register"} className='authLink'>Register</Link></p>

      </div>
    </main>
  )
}
