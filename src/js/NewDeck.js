import React, { Component } from 'react';
import DeckForm from './DeckForm';
import localAPI from './Model';

class NewDeck extends Component {
  addDeck(id, title, cards) {
    const deck = {
      id: id,
      title: title,
      cards: cards
    }
    localAPI.addDeck(deck);
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

export default NewDeck;