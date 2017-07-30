import React, { Component } from 'react';
import DeckForm from './DeckForm';
import localAPI from './Model';
import {Link, withRouter} from 'react-router-dom';
import {validateDeck} from './Validation'

class EditDeck extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deck: null,
      errors: []
    }
    this.updateDeck = this.updateDeck.bind(this);
    this.deleteDeck = this.deleteDeck.bind(this);
  }

  componentDidMount() {
    // fetch deck from database
    fetch(`/api/deck/${this.props.match.params.id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`status ${response.status}`);
        }
        return response.json();
      })
      .then(json => {
        // set delete status and key for cards
        json.cards.forEach((card, idx) => {
          card.delete = false;
          card.key = idx;
        })
        
        this.setState({
          deck: json
        })
      }).catch(e => {
        console.log(e)
      })
  }

  // API Update
  updateDeck(id, title, cards) {
    const deck = {
      id: id,
      title: title,
      cards: cards
    }

    // validate
    const errors = validateDeck(deck)

    if (errors.length > 0) {
      this.setState({
        errors: errors
      })
      return false;
    }
    
    fetch('/api/deck',
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(deck)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`status ${response.status}`);
        }
        return response.json();
      })
      .then(json => {
        this.props.history.replace(`/cards/${json.deck_id}`)
      })
      .catch(e => {
        console.log(e);
      })
  }

  deleteDeck() {
    if (window.confirm('Are you sure you want to delete this deck?')) {
      localAPI.deleteDeck(this.state.deck.id);
      this.props.history.replace('/');
    }
  }

  render() {
    const {deck} = this.state;
    const cancelPath = deck ? `/cards/${deck.id}` : '/';
    return (
      deck ?
        <div> 
          <Link to={cancelPath}>Back</Link>
          <h2>Edit Deck</h2>
          <button onClick={this.deleteDeck} className='deleteBtn'>Delete</button>
          <DeckForm 
            id={deck.id}
            title={deck.title}
            cards={deck.cards}
            onSubmit={this.updateDeck}
            cancelPath={cancelPath}
            validation={this.state.errors}
          />
        </div> : 
        <p>Deck not found</p>
    )
  }
}

export default withRouter(EditDeck);