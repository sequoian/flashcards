import React from 'react';
import {Link} from 'react-router-dom';

const Header = ({user, logout}) => (
  <div className="header">
    <Nav />
    {user ? <UserDisplay user={user} logout={logout} /> : <GuestDisplay />}
  </div>
)

const Nav = () => (
  <nav>
    <ul>
      <li><Link to="/">Browse</Link></li>
      <li><Link to="/my-cards">My Flashcards</Link></li>  
      <li><Link to="/new">Create Flashcards</Link></li>
    </ul>
  </nav>
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
  <span><Link to="/signup">Sign Up</Link> | <Link to="/login">Log In</Link></span>
)

export default Header;
