import React, {Component} from 'react'
import Auth from './Auth'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

class ChangePasswordContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      old_password: '',
      password: '',
      confirm: '',
      errors: {},
      error_msg: null,
      success_msg: null,
      submitting: false
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
    if (this.state.submitting) {
      return null
    }

    this.setState({submitting: true})

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
          this.setState({submitting: false})
        }  
      })
      .catch(error => {
        if (error.message === '401') {
          this.setState({error_msg: 'You must be logged in to do that'})
        }
        else {
          this.setState({error_msg: 'Something went wrong on our end.'})
        }
        this.setState({submitting: false})
      })
  }

  render() {
    const {old_password, password, confirm, errors, error_msg, success_msg, submitting} = this.state
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
        disable_submit={submitting}
      />
    )
  }
}

const ChangePassword = ({old_password, password, confirm, errors, error_msg, handleChange, handleSubmit, success_msg, disable_submit}) => (
  <form>
    <div className="errors">
      {error_msg}
    </div>
    <div className="success">
      {success_msg}
    </div>
    <TextField
      name="old_password"
      type="password"
      floatingLabelText="Old Password"
      floatingLabelFixed={true}
      value={old_password}
      onChange={handleChange}
      errorText={errors.old_password}
    />
    <br />
    <TextField
      name="password"
      type="password"
      floatingLabelText="New Password"
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
      onClick={handleSubmit}
      label="Submit"
      primary={true}
      disabled={disable_submit}
    />
  </form>
)

export default ChangePasswordContainer
