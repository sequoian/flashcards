import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import ChangePassword from './ChangePassword'
import Auth from './Auth'

class UserProfileContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      email: ''
    }
  }

  componentDidMount() {
    fetch('/api/user', {
      method: 'GET',
      headers: {
        'Authorization': `bearer ${Auth.getToken()}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`status ${response.status}`);
        }
        return response.json();
      })
      .then(json => {
        console.log(json)
        this.setState({
          name: json.user.name,
          email: json.user.email
        })
      })
      .catch(e => {
        console.log(e)
      })
  }

  render() {
    const {name, email} = this.state
    return (
      <UserProfile 
        name={name}
        email={email}
      />
    )
  }
}

const UserProfile = ({name, email}) => (
  <div className="user-form">
    <Link to={'/'}>Back</Link>
    <div>User: {name}</div>
    <div>Email: {email}</div>
    <hr />
    <h3>Change Password</h3>
    <ChangePassword />
  </div>
)

export default UserProfileContainer
