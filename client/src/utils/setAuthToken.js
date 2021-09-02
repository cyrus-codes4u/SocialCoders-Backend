import axios from 'axios'

const setAuthToken = (token) => {
  // sets a default to send the token with each request
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token
  } else {
    delete axios.defaults.headers.common['x-auth-token']
  }
}

export default setAuthToken
