import './App.css'
import NavBar from './components/layout/NavBar'
import Landing from './components/layout/Landing'
import Register from './components/layout/auth/Register'
import Login from './components/layout/auth/Login'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

function App() {
  return (
    <Router className='App'>
      <NavBar />
      <Route exact path='/' component={Landing} />

      <section className='container'>
        <Switch>
          <Route exact path='/register' component={Register} />
          <Route exact path='/login' component={Login} />
        </Switch>
      </section>
    </Router>
  )
}

export default App
