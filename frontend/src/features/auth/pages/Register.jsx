import { useState } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

export default function Register() {

  const navigate  = useNavigate()
  const {loading, handleRegister}  = useAuth()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')



  const handleSubmit = async (e) => {
    e.preventDefault()
    await handleRegister({username, email, password})
    navigate('/');

  }


  if(loading){
    return (<main><h1>Loading.......</h1></main>)
  }

  
  return (
    <main>
      <div className="formContainer">
        <h1>Register</h1>

        <form onSubmit={handleSubmit}>

            <div className="inputGroup">
            <label htmlFor="username">Username</label>
            <input
            onChange={(e) => {setUsername(e.target.value)}}
             type="username" id="username" placeholder="Enter your username" />
          </div>
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
              Sign up
          </button>

          <Link to="/login" className='secondary-auth-button'>
            Login
          </Link>

       </form>

       <p>Already have an account? <Link to={"/login"} className="authLink">Login</Link></p>
      </div>
    </main>
  )

}
