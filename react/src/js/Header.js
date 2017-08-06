import React, { Component } from 'react';
import Auth from './Auth';

class HeaderContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    }
    this.logOut = this.logOut.bind(this);
  }

  componentDidMount() {
    this.getUser()
      .then(user => {
        console.log(user)
        if (user) {
          this.setState({
            user: user
          })
        }
      })
  }

  getUser() {
    return fetch('/api/user', {
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
        return json.user
      })
      .catch(e => {
        return null
      })
  }

  logOut() {
    Auth.deauthenticatedUser();
    this.setState({
      user: null
    })
  }

  render() {
    return (
      <Header
        user={this.state.user}
        logout={this.logOut}
      />
    )
  }
}

const Header = ({user, logout}) => (
  <div className="header">
    {user ? <UserDisplay user={user} logout={logout} /> : <GuestDisplay />}
  </div>
)

const UserDisplay = ({user, logout}) => (
  <div>
    <span>{`${user} logged in`}</span>
    <button
      type="button"
      onClick={logout}
    >
      Log Out
    </button>
  </div>
)

const GuestDisplay = () => (
  <span>Please log in</span>
)

export default HeaderContainer;
