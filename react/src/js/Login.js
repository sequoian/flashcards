import React, { Component } from 'react';

const Login = ({email, password, handleChange}) => (
  <form>
    <label htmlFor="email">
      Email
    </label>
    <input 
      type="text" 
      name="email" 
      id="email" 
      value={email}
      onChange={handleChange} 
    />
    <label htmlFor="password">
      Password
    </label>
    <input 
      type="password" 
      name="password" 
      id="password" 
      value={password}
      onChange={handleChange} 
    />
    <button type="button">
      Log in
    </button>
  </form>
)

export default Login
