import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import Auth from './Auth'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

class SignupContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      email: '',
      password: '',
      confirm: '',
      errors: [],
      error_msg: null,
      submitting: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.submit = this.submit.bind(this)
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

  submit() {
    if (this.state.submitting) {
      return null
    }

    this.setState({submitting: true})

    const {name, email, password, confirm} = this.state
    
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
          password: password,
          confirm: confirm
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
          if (json.login) {
            Auth.authenticateUser(json.payload.token)
            this.props.loginUser()
          }    
          this.props.history.replace('/my-cards')
        }
        else {
          this.setState({
            errors: json.errors,
            error_msg: 'Please fix the errors below'
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
        this.submit();
        break;
      default:
        break;
    }
  }

  render() {
    const {name, email, password, confirm, errors, error_msg, submitting} = this.state
    return (
      <Signup
        name={name}
        email={email}
        password={password}
        confirm={confirm}
        handleChange={this.handleChange}
        handleSubmit={this.submit}
        errors={errors}
        error_msg={error_msg}
        disable_submit={submitting}
      />
    )
  }
}

const Signup = ({name, email, password, confirm, handleChange, handleSubmit, errors, error_msg, disable_submit}) => (
  <div>
    <h1>Sign Up</h1>
    <form>
      <div className="errors">
        {error_msg}
      </div>
      <TextField
        name="name"
        floatingLabelText="Name"
        floatingLabelFixed={true}
        value={name}
        onChange={handleChange}
        errorText={errors.name}
      />
      <br />
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
      <TextField
        name="confirm"
        type="password"
        floatingLabelText="Confirm Password"
        floatingLabelFixed={true}
        value={confirm}
        onChange={handleChange}
        errorText={errors.confirm}
      />
      <br />
      <RaisedButton
        label="Sign Up"
        primary={true}
        onClick={handleSubmit}
        style={{margin: '25px 0'}}
        disabled={disable_submit}
      />
    </form>
  </div>
)

export default withRouter(SignupContainer)
