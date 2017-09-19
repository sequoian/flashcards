import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import Auth from './Auth'
import LabeledInput from './LabeledInput'

class SignupContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      email: '',
      password: '',
      confirm: '',
      errors: [],
      error_msg: null
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
        this.submit();
        break;
      default:
        break;
    }
  }

  render() {
    const {name, email, password, confirm, errors, error_msg} = this.state
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
      />
    )
  }
}

const Signup = ({name, email, password, confirm, handleChange, handleSubmit, errors, error_msg}) => (
  <div>
    <h2>Sign Up</h2>
    <form>
      <div className="errors">
        {error_msg}
      </div>
      <LabeledInput
        name="name"
        type="text"
        label="Name"
        value={name}
        onChange={handleChange}
        error={errors.name}
      />
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
      <LabeledInput
        name="confirm"
        type="password"
        label="Confirm Password"
        value={confirm}
        onChange={handleChange}
        error={errors.confirm}
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
