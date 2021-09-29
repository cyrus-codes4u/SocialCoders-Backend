import React, { useEffect } from 'react'
import './App.css'
import NavBar from './components/layout/NavBar'
import Landing from './components/layout/Landing'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Alert from './components/layout/Alert'
import Dashboard from './components/dashboard/Dashboard'
import CreateProfile from './components/profile-forms/CreateProfile'
import EditProfile from './components/profile-forms/EditProfile'
import AddExperience from './components/profile-forms/AddExperience'
import AddEducation from './components/profile-forms/AddEducation'
import PrivateRoute from './components/routing/PrivateRoute'
import Posts from './components/posts/Posts'
import Post from './components/post/Post'
import EditProfile from './components/profile-forms/EditProfile'
import Profiles from './components/profiles/Profiles'
import Profile from './components/profile/Profile'
import './App.css'
//Redux
import store from './components/layout/store'
import { loadUser } from './actions/auth'
import { Provider } from 'react-redux' // connects redux to react app
import setAuthToken from './utils/setAuthToken'

if (localStorage.token) {
  setAuthToken(localStorage.token)
}

function App() {
  useEffect(() => {
    store.dispatch(loadUser())
  }, [])

  return (
    <Provider store={store}>
      <Router className='App'>
        <NavBar />
        <Route exact path='/' component={Landing} />

        <section className='container'>
          <Alert />
          <Switch>
            <Route exact path='/register' component={Register} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/profiles' component={Profiles} />
            <Route exact path='/profiles/:id' component={Profile} />
            <PrivateRoute exact path='/dasboard' component={Dashboard} />
            <PrivateRoute
              exact
              path='/create-profile'
              component={CreateProfile}
            />
            <PrivateRoute exact path='/edit-profile' component={EditProfile} />
            <PrivateRoute
              exact
              path='/add-experience'
              component={AddEducation}
            />
            <PrivateRoute
              exact
              path='/add-education'
              component={AddExperience}
            />
            <PrivateRoute exact path='/posts' component={Posts} />
            <PrivateRoute exact path='/post/:id' component={Post} />
          </Switch>
        </section>
      </Router>
    </Provider>
  )
}

export default App
