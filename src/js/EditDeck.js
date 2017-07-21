import React, { Component } from 'react';
import DeckForm from './DeckForm';
import localAPI from './Model';
import {withRouter} from 'react-router-dom';

class EditDeck extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deck: null
    }
    this.updateDeck = this.updateDeck.bind(this);
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
    // redirect to deck page upon success
    this.props.history.replace(`/cards/${deck.id}`)
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
          cancelPath={`/cards/${deck.id}`}
        /> : 
        <p>Deck not found</p>
    )
  }
}

export default withRouter(EditDeck);