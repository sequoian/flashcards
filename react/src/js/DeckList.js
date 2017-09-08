import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import Auth from './Auth'

class DeckListContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      decks: [],
      error: null
    }
  }

  getUserList() {
    // fetch list from database
    fetch('/api/deck-list', {
      method: 'GET',
      headers: {
        'Authorization': `bearer ${Auth.getToken()}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        else {
          return response.json()
        }
        
      })
      .then(json => {
        if (json.length > 0) {
          this.setState({
            decks: json
          })
        }
        else {
          this.setState({
            error: 'You do not have any flashcard decks at the moment'
          })
        }
        
      }).catch(e => {
        let msg
        const error = e.message
        if (error === '401') {
          msg = 'You need to be logged in to view your flashcard decks'
        }
        else {
          msg = 'Something went wrong on our end and we could not retrieve your flashcard decks'
        }
        this.setState({
          error: msg
        })
      })
  }

  componentDidMount() {
    this.getUserList()
  }

  render() {
    const {decks, error} = this.state
    return (
      <DeckList
        decks={decks}
        error={error}
      />
    ) 
  }
}

const DeckList = ({decks, error}) => (
  <div>
    <Link to={'/new'}>Create New Deck</Link>
    <h3>My Flashcard Decks</h3>
    <div>{error}</div>
    <ul className="deck-list">
      {decks.map(deck => (
        <li key={deck.id}>
          <Link to={`/cards/${deck.id}`}>
            {deck.title}
          </Link>
        </li>
        ))}  
    </ul>
  </div>
);

export default DeckListContainer;
