import React, {Component} from 'react'
import ValidationErrors from './ValidationErrors'
import Validation from './Validation'
import Auth from './Auth'

class ChangePasswordContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      password: '',
      confirm: '',
      errors: []
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
    const {password, confirm} = this.state
    const errors = Validation.validatePasswordChange(password, confirm)

    if (errors.length > 0) {
      this.setState({errors: errors})
      return false
    }

    fetch('/api/change-password',
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Authorization': `bearer ${Auth.getToken()}`
        },
        body: JSON.stringify({
          password: password
        })
      })
      .then(json => {
        console.log('password changed')
      })
      .catch(error => {
        errors.push(['Something went wrong'])
        this.setState({errors: errors})
      })
  }

  render() {
    const {password, confirm, errors} = this.state
    return (
      <ChangePassword 
        password={password}
        confirm={confirm}
        errors={errors}
        handleChange={this.handleChange}
        handleSubmit={this.handleSubmit}
      />
    )
  }
}

const ChangePassword = ({password, confirm, errors, handleChange, handleSubmit}) => (
  <form>
    <div>Change password</div>
    {errors.length > 0 ? <ValidationErrors errors={errors} /> : null }
    <label htmlFor="password"></label>
    <input 
      type="password"
      name="password"
      id="password"
      value={password}
      onChange={handleChange}
    />
    <label htmlFor="confirm"></label>
    <input
      type="password"
      name="confirm"
      id="confirm"
      value={confirm}
      onChange={handleChange}
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
