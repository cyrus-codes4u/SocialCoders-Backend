import './App.css'
import NavBar from './components/layout/NavBar'
import Landing from './components/layout/Landing'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
//Redux
import store from './components/layout/store'
import { Provider } from 'react-redux' // connects redux to react app

function App() {
  return (
    <Provider store={store}>
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
    </Provider>
  )
}

export default App
