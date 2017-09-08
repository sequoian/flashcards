import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import ChangePassword from './ChangePassword'

class UserProfileContainer extends Component {
  constructor(props) {
    super(props)
    const user = this.props.user
    this.state = {
      name: user ? user.name : null,
      email: user ? user.email : null
    }
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
