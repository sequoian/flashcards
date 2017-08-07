import React, { Component } from 'react'

class LoginContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: ''
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
    console.log('submitted')
  }

  render() {
    const {email, password} = this.state
    return (
      <Login
        email={email}
        password={password}
        handleChange={this.handleChange}
        handleSubmit={this.login}
      />
    )
  }
}

const Login = ({email, password, handleChange, handleSubmit}) => (
  <form>
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
)

export default LoginContainer
