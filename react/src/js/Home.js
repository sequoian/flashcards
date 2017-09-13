import React from 'react'
import Auth from './Auth'
import DeckList from './DeckList'
import Browse from './Browse'

const Home = () => {
  if (Auth.isUserAuthenticated()) {
    return <DeckList />
  }
  else {
    return (
    <div>
      <Browse />
    </div>
    ) 
  } 
}

export default Home
