import React, {Component} from 'react'
import ChangePassword from './ChangePassword'
import {formatDate} from './Utility'

class UserProfileContainer extends Component {
  constructor(props) {
    super(props)
    const user = this.props.user
    this.state = {
      name: user ? user.name : null,
      email: user ? user.email : null,
      joined: user ? user.joined : null
    }
  }

  render() {
    if (this.props.user) {
      const {name, email, joined} = this.props.user
      return (
        <div> 
          <UserProfile 
            name={name}
            email={email}
            joined={joined}
          />
        </div>
      )
    }
    else {
      return (
        <div>You must be logged in to view your profile</div>
      )
    } 
  }
}

const UserProfile = ({name, email, joined}) => (
  <div>
    <h1>Profile</h1>
    <div>User: {name}</div>
    <div>Email: {email}</div>
    <div>Member since {formatDate(joined)}</div>
    <hr className="profile-hr" />
    <h2>Change Password</h2>
    <ChangePassword />
  </div>
)

export default UserProfileContainer
