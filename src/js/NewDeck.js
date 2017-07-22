import React, { Component } from 'react';
import DeckForm from './DeckForm';
import localAPI from './Model';
import {Link, withRouter} from 'react-router-dom';
import {validateDeck} from './Validation'

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
    const errors = validateDeck(deck)

    if (errors.length > 0) {
      this.setState({
        errors: errors
      })
      return false;
    }

    localAPI.addDeck(deck);
    // redirect to new deck upon success
    this.props.history.replace(`/cards/${deck.id}`)
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
