import React, { Component } from 'react';
import DeckForm from './DeckForm';
import localAPI from './Model';

class EditDeck extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deck: null
    }
  }

  componentDidMount() {
    const deck = localAPI.getDeck(
      parseInt(this.props.match.params.id, 10)
    );
    this.setState({
      deck: deck
    });
  }

  updateDeck(id, title, cards) {
    const deck = {
      id: id,
      title: title,
      cards: cards
    }
    localAPI.updateDeck(deck.id, deck);
  }

  render() {
    const {deck} = this.state;
    return (
      deck ? 
        <DeckForm 
          id={deck.id}
          title={deck.title}
          cards={deck.cards}
          onSubmit={this.updateDeck}
        /> : 
        <p>Deck not found</p>
    )
  }
}

export default EditDeck;