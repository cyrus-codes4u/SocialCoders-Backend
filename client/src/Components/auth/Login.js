import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Login = () => {
  const [formState, setFormState] = useState({
    email: '',
    password: '',
  })

  const updateForm = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Success')
  }

  return (
    <React.Fragment>
      <h1 className='large text-primary'>Sign In</h1>
      <p className='lead'>
        <i className='fas fa-user' />
        Login to Account
      </p>
      <form className='form' onSubmit={handleSubmit()}>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={formState.email}
            onChange={updateForm()}
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            minLength='6'
            value={formState.password}
            onChange={updateForm()}
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Login' />
      </form>
      <p className='my-1'>
        {' '}
        Don't have account? <Link to='/register'> Sign up</Link>
      </p>
    </React.Fragment>
  )
}

export default Login
