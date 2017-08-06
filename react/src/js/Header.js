import React from 'react';

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

export default Header;
