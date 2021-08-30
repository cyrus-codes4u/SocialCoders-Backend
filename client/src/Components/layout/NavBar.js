import React from 'react'

const NavBar = () => {
  return (
    <nav className='navbar bg-dark'>
      <h1>
        <Link to='/'>
          <i /> SocialCoders
        </Link>
      </h1>
      <ul>
        <li>
          <Link to='/'>Developers</Link>
        </li>
        <li>
          <Link to='/register'>Register</Link>
        </li>
        <li>
          <Link to='/login'>Login</Link>
        </li>
      </ul>
    </nav>
  )
}

export default NavBar
