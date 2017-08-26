import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import Auth from './Auth'

class DeckListContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      decks: []
    }
  }

  componentDidMount() {
    // fetch list from database
    fetch('/api/deck-list', {
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
        //console.log(json)
        this.setState({
          decks: json
        })
      }).catch(e => {
        console.log(e)
      })
  }

  render() {
    if (this.state.decks.length > 0) {
      return (
        <DeckList
          decks={this.state.decks}
        />
      );
    }
    else {
      return (
        <p>
          You do not have any flashcard decks.  
          You can create some <Link to="/new">here</Link>.
        </p>
      )
    }
    
  }
}

const DeckList = ({decks}) => (
  <div>
    <Link to={'/new'}>Create New Deck</Link>
    <h3>My Decks</h3>
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