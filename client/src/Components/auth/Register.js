import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { setAlert } from '../actions/alert'
import { register } from '../actions/auth'
import PropTypes from 'prop-types'

const Register = ({ setAlert, register }) => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  })

  const { name, email, password, password2 } = formState
  const updateForm = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== password2) {
      //passes this message into Actions
      setAlert('Passwords do not match', 'danger')
    } else {
      register({ name, email, password })
    }
  }

  return (
    <React.Fragment>
      <h1 className='large text-primary'>Sign Up</h1>
      <p className='lead'>
        <i className='fas fa-user' />
        Create Account
      </p>
      <form className='form' onSubmit={handleSubmit()}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Name'
            name='name'
            required
            value={name}
            onChange={updateForm()}
          />
        </div>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={updateForm()}
          />
          <small className='form-text'>
            This site uses gravatar so if you would like a preloaded avatar, use
            your gravatar email.
          </small>
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            minLength='6'
            value={password}
            onChange={updateForm()}
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Confirm Password'
            name='password2'
            minLength='6'
            value={password2}
            onChange={updateForm()}
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Register' />
      </form>
      <p className='my-1'>
        {' '}
        Already have account? <Link to='/login'> Sign In</Link>
      </p>
    </React.Fragment>
  )
}

Register.PropTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
}

export default connect(null, { setAlert, register })(Register)
