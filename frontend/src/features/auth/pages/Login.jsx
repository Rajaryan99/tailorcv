import '../auth.form.scss'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {

  const {loading, handleLogin} = useAuth() 
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    await handleLogin({email, password})
    navigate('/home')
  }

  if(loading){
    return (<main><h1>Loading.......</h1></main>)
  }
  return (
    <main>
      <div className="formContainer">
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>

          <div className="inputGroup">
            <label htmlFor="email">Email</label>
            <input
            onChange={(e) => {setEmail(e.target.value)}}
             type="email" id="email" placeholder="Enter email address" />
          </div>
          <div className="inputGroup">
            <label htmlFor="password">Password</label>
            <input
            onChange={(e) => {setPassword(e.target.value)}}
             type="password" id="password" placeholder="Enter password" />
          </div>

          <button className="button primary-button auth-submit-button">
              Login
          </button>

          <Link to="/register" className='secondary-auth-button'>
            Sign up
          </Link>

       </form>

              <p>Dont have an account? <Link to={"/register"} className='authLink'>Register</Link></p>

      </div>
    </main>
  )
}
