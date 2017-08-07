import React from 'react';
import {Link} from 'react-router-dom';

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
  <span>Please <Link to="/signup">sign up</Link> or <Link to="/login">log in</Link></span>
)

export default Header;
