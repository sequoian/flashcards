import React, { Component } from 'react';
import DeckForm from './DeckForm';
import localAPI from './Model';
import {withRouter} from 'react-router-dom';
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

    // validate
    const errors = validateDeck(deck)

    if (errors.length > 0) {
      this.setState({
        errors: errors
      })
      return false;
    }

    // update database
    localAPI.updateDeck(deck.id, deck);

    // redirect to deck page upon success
    this.props.history.replace(`/cards/${deck.id}`)
  }

  deleteDeck() {
    if (window.confirm('Are you sure you want to delete this deck?')) {
      localAPI.deleteDeck(this.state.deck.id);
      this.props.history.replace('/');
    }
  }

  render() {
    const {deck} = this.state;
    return (
      deck ?
        <div> 
          <button onClick={this.deleteDeck}>Delete</button>
          <DeckForm 
            id={deck.id}
            title={deck.title}
            cards={deck.cards}
            onSubmit={this.updateDeck}
            cancelPath={`/cards/${deck.id}`}
            validation={this.state.errors}
          />
        </div> : 
        <p>Deck not found</p>
    )
  }
}

export default withRouter(EditDeck);