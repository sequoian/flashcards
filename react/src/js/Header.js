import React from 'react';
import {Link} from 'react-router-dom';

const Header = ({user, logout}) => (
  <div className="header">
    <Link
      to="/"
      className="logo"
    >
      Flashcards
    </Link>
    {user ? <UserDisplay user={user} logout={logout} /> : <GuestDisplay />}
  </div>
)

const UserDisplay = ({user, logout}) => (
  <span>
    <span><Link to={`/profile`}>{user.name}</Link> is logged in</span>
    <button
      type="button"
      onClick={logout}
    >
      Log Out
    </button>
  </span>
)

const GuestDisplay = () => (
  <span>Please <Link to="/signup">sign up</Link> or <Link to="/login">log in</Link></span>
)

export default Header;
