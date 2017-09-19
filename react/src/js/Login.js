import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import Auth from './Auth'
import LabeledInput from './LabeledInput'

class LoginContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      errors: {},
      error_msg: null
    }
    this.handleChange = this.handleChange.bind(this)
    this.login = this.login.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown)
  }

  handleChange(event) {
    const {name, value} = event.target
    this.setState({
      [name]: value
    })
  }

  login() {
    const {email, password} = this.state

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
        if (response.status > 400) {
          throw new Error(response.status)
        }
        else {
          return response.json()
        }
      })
      .then(json => {
        if (json.success) {
          Auth.authenticateUser(json.payload.token)
          this.props.loginUser()
          this.props.history.replace('/my-cards')
        }
        else if (json.errors) {
          this.setState({
            errors: json.errors,
            error_msg: json.message
          })
        }
        else {
          this.setState({
            errors: {},
            error_msg: json.message
          })
        }  
      })
      .catch(error => {
        this.setState({error_msg: 'Something went wrong on our end.'})
      })
  }

  handleKeyDown(event) {
    switch (event.key) {
      case 'Enter':
        this.login();
        break;
      default:
        break;
    }
  }

  render() {
    const {email, password, errors, error_msg} = this.state
    return (
      <Login
        email={email}
        password={password}
        handleChange={this.handleChange}
        handleSubmit={this.login}
        errors={errors}
        error_msg={error_msg}
      />
    )
  }
}

const Login = ({email, password, handleChange, handleSubmit, errors, error_msg}) => (
  <div>
    <h2>Log In</h2>
    <form>
      <div className="errors">
        {error_msg}
      </div>
      <LabeledInput
        name="email"
        type="text"
        label="Email"
        value={email}
        onChange={handleChange}
        error={errors.email}
      />
      <LabeledInput
        name="password"
        type="password"
        label="Password"
        value={password}
        onChange={handleChange}
        error={errors.password}
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
