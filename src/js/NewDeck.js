import React, { Component } from 'react';
import DeckForm from './DeckForm';
import localAPI from './Model';

class NewDeck extends Component {
  addDeck(title, cards) {
    const deck = {
      title: title,
      cards: cards
    }
    localAPI.addDeck(deck);
  }

  render() {
    return (
      <DeckForm 
        onSubmit={this.addDeck}
      />
    )
  }
}

export default NewDeck;