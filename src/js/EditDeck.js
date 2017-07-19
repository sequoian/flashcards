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

  render() {
    const {deck} = this.state;
    return (
      deck ? 
        <DeckForm 
          title={deck.title}
          cards={deck.cards}
        /> : 
        <p>Deck not found</p>
    )
  }
}

export default EditDeck;