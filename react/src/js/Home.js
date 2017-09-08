import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import Auth from './Auth'
import DeckList from './DeckList'

const Home = () => {
  if (Auth.isUserAuthenticated()) {
    return <DeckList />
  }
  else {
    return (
    <div>
      Welcome to my flashcards app! 
      Please sign up or log in to create some flashcards.
    </div>
    ) 
  } 
}

export default Home
