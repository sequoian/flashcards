import React, { Component } from 'react'
import {Link, withRouter} from 'react-router-dom'
import ValidationErrors from './ValidationErrors'
import Auth from './Auth'
import Validation from './Validation'

class LoginContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      errors: []
    }
    this.handleChange = this.handleChange.bind(this)
    this.login = this.login.bind(this)
  }

  handleChange(event) {
    const {name, value} = event.target
    this.setState({
      [name]: value
    })
  }

  login() {
    const {email, password} = this.state
    const errors = Validation.validateLogin(email, password)

    if (errors.length > 0) {
      this.setState({errors: errors})
      return false
    }

    fetch('/auth/login',
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`status ${response.status}`)
        }
        return response.json()
      })
      .then(json => {
        Auth.authenticateUser(json.token)
        this.props.history.replace('/')
      })
      .catch(error => {
        console.log(error)
        errors.push(['Incorrect email or password'])
        this.setState({errors: errors})
      })
  }

  render() {
    const {email, password, errors} = this.state
    return (
      <Login
        email={email}
        password={password}
        handleChange={this.handleChange}
        handleSubmit={this.login}
        errors={errors}
      />
    )
  }
}

const Login = ({email, password, handleChange, handleSubmit, errors}) => (
  <div>
    <Link to={`/`}>Back</Link>
    <form>
      {errors.length > 0 ? <ValidationErrors errors={errors} /> : null }
      <label htmlFor="email">
        Email
      </label>
      <input 
        type="text" 
        name="email" 
        id="email" 
        value={email}
        onChange={handleChange} 
      />
      <label htmlFor="password">
        Password
      </label>
      <input 
        type="password" 
        name="password" 
        id="password" 
        value={password}
        onChange={handleChange} 
      />
      <button
        type="button"
        onClick={handleSubmit}
      >
        Log in
      </button>
    </form>
  </div>
)

export default withRouter(LoginContainer)
