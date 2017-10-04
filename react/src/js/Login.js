import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import Auth from './Auth'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

class LoginContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      errors: {},
      error_msg: null,
      submitting: false
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
    if (this.state.submitting) {
      return null
    }

    this.setState({submitting: true})

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
            error_msg: 'Please fix the errors below'
          })
        }
        else {
          this.setState({
            errors: {},
            error_msg: json.message
          })
        }
        this.setState({submitting: false})  
      })
      .catch(error => {
        this.setState({
          error_msg: 'Something went wrong on our end.',
          submitting: false
        })
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
    const {email, password, errors, error_msg, submitting} = this.state
    return (
      <Login
        email={email}
        password={password}
        handleChange={this.handleChange}
        handleSubmit={this.login}
        errors={errors}
        error_msg={error_msg}
        disable_submit={submitting}
      />
    )
  }
}

const Login = ({email, password, handleChange, handleSubmit, errors, error_msg, disable_submit}) => (
  <div>
    <h1>Log In</h1>
    <form>
      <div className="errors">
        {error_msg}
      </div>
      <TextField
        name="email"
        type="email"
        floatingLabelText="Email"
        floatingLabelFixed={true}
        value={email}
        onChange={handleChange}
        errorText={errors.email}
      />
      <br />
      <TextField
        name="password"
        type="password"
        floatingLabelText="Password"
        floatingLabelFixed={true}
        value={password}
        onChange={handleChange}
        errorText={errors.password}
      />
      <br />
      <RaisedButton
        label="Log In"
        primary={true}
        onClick={handleSubmit}
        style={{margin: '25px 0'}}
        disabled={disable_submit}
      />
    </form>
  </div>
)

export default withRouter(LoginContainer)
