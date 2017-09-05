import React, {Component} from 'react'
import Auth from './Auth'
import LabeledInput from './LabeledInput'

class ChangePasswordContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      old_password: '',
      password: '',
      confirm: '',
      errors: {},
      error_msg: null,
      success_msg: null
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    const {name, value} = event.target
    this.setState({
      [name]: value
    })
  }

  handleSubmit() {
    const {password, confirm, old_password} = this.state

    fetch('/auth/change-password',
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Authorization': `bearer ${Auth.getToken()}`
        },
        body: JSON.stringify({
          old_password: old_password,
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
          this.setState({
            errors: {},
            success_msg: json.message,
            error_msg: null,
            old_password: '',
            password: '',
            confirm: ''
          })
        }
        else {
          this.setState({
            errors: json.errors,
            error_msg: json.message,
            success_msg: null
          })
        }  
      })
      .catch(error => {
        this.setState({error_msg: 'Something went wrong on our end.'})
      })
  }

  render() {
    const {old_password, password, confirm, errors, error_msg, success_msg} = this.state
    return (
      <ChangePassword 
        old_password={old_password}
        password={password}
        confirm={confirm}
        errors={errors}
        error_msg={error_msg}
        handleChange={this.handleChange}
        handleSubmit={this.handleSubmit}
        success_msg={success_msg}
      />
    )
  }
}

const ChangePassword = ({old_password, password, confirm, errors, error_msg, handleChange, handleSubmit, success_msg}) => (
  <form>
    <div className="errors">
      {error_msg}
    </div>
    <div className="success">
      {success_msg}
    </div>
    <LabeledInput
      name="old_password"
      type="password"
      label="Old Password"
      value={old_password}
      onChange={handleChange}
      error={errors.old_password}
    />
    <LabeledInput
      name="password"
      type="password"
      label="New Password"
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
      Submit
    </button>
  </form>
)

export default ChangePasswordContainer
