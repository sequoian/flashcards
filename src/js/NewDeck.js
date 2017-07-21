import React, { Component } from 'react';
import DeckForm from './DeckForm';
import localAPI from './Model';
import {withRouter} from 'react-router-dom';

class NewDeck extends Component {
  constructor(props) {
    super(props);
    this.addDeck = this.addDeck.bind(this);
  }

  addDeck(id, title, cards) {
    const deck = {
      id: id,
      title: title,
      cards: cards
    }
    localAPI.addDeck(deck);
    // redirect to new deck upon success
    this.props.history.replace(`/cards/${deck.id}`)
  }

  render() {
    return (
      <DeckForm 
        onSubmit={this.addDeck}
        cancelPath={'/'}
      />
    )
  }
}

export default withRouter(NewDeck);