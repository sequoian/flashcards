import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import ValidationErrors from './ValidationErrors'
import Auth from './Auth'
import Validation from './Validation'

class SignupContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      email: '',
      password: '',
      errors: []
    }
    this.handleChange = this.handleChange.bind(this)
    this.submit = this.submit.bind(this)
  }

  handleChange(event) {
    const {name, value} = event.target
    this.setState({
      [name]: value
    })
  }

  submit() {
    const {name, email, password} = this.state
    const errors = Validation.validateSignup(name, email, password)

    if (errors.length > 0) {
      this.setState({errors: errors})
      return false
    }
    
    fetch('/auth/signup',
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password
        })
      })
      .then(response => {
        if (!response.ok && response.status !== 400) {
          console.log(response.status)
          throw new Error(`status ${response.status}`)
        }
        return response.json()
      })
      .then(json => {
        if (json.success) {
          Auth.authenticateUser(json.token)
          this.props.history.replace('/')
        }
        else {
          errors.push([json.message])
          this.setState({errors: errors})
        }
      })
      .catch(error => {
        errors.push(['Something went wrong'])
        this.setState({errors: errors})
      })
  }

  render() {
    const {name, email, password, errors} = this.state
    return (
      <Signup
        name={name}
        email={email}
        password={password}
        handleChange={this.handleChange}
        handleSubmit={this.submit}
        errors={errors}
      />
    )
  }
}

const Signup = ({name, email, password, handleChange, handleSubmit, errors}) => (
  <div>
    <h2>Sign Up</h2>
    <form>
      {errors.length > 0 ? <ValidationErrors errors={errors} /> : null }
      <label htmlFor="name">
        User Name
      </label>
      <input 
        type="text" 
        name="name" 
        id="name" 
        value={name}
        onChange={handleChange} 
      />
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
        Sign Up
      </button>
    </form>
  </div>
)

export default withRouter(SignupContainer)
