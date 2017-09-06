import React, { Component } from 'react';
import DeckForm from './DeckForm';
import {Link, withRouter} from 'react-router-dom';
import Validation from './Validation'
import Auth from './Auth'

class NewDeck extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: []
    }
    this.addDeck = this.addDeck.bind(this);
  }

  addDeck(id, title, cards) {
    const deck = {
      id: id,
      title: title,
      cards: cards
    }

    // validate
    const errors = Validation.validateDeck(deck)

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
        'Content-Type': 'application/json',
        'Authorization': `bearer ${Auth.getToken()}`
      },
      body: JSON.stringify({deck: deck})
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

  render() {
    const cancelPath = '/'
    return (
      <div>
        <Link to={cancelPath}>Back</Link>
        <h2>New Deck</h2>
        <DeckForm 
          onSubmit={this.addDeck}
          cancelPath={cancelPath}
          validation={this.state.errors}
        />
      </div>
    )
  }
}

export default withRouter(NewDeck);
