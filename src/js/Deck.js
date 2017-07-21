import React, { Component } from 'react';
import localAPI from './Model'
import {Link} from 'react-router-dom';

class DeckPageContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deck: null,
      activeCardIndex: 0,
      showingFront: true
    };
    this.nextCard = this.nextCard.bind(this);
    this.previousCard = this.previousCard.bind(this);
    this.flipCard = this.flipCard.bind(this);
  }

  componentDidMount() {
    const deck = localAPI.getDeck(
      parseInt(this.props.match.params.id, 10)
    );
    this.setState({
      deck: deck
    });
  }

  nextCard() {
    const cards = this.state.deck.cards;
    this.setState((prevState) => {
      let newIndex = prevState.activeCardIndex + 1;
      if (newIndex >= cards.length) {
        newIndex = 0;
      }
      return {
        activeCardIndex: newIndex,
        showingFront: true
      }
    });
  }

  previousCard() {
    const cards = this.state.deck.cards;
    this.setState((prevState) => {
      let newIndex = prevState.activeCardIndex - 1;
      if (newIndex < 0) {
        newIndex = cards.length - 1;
      }
      return {
        activeCardIndex: newIndex,
        showingFront: true
      }
    });
  }

  flipCard() {
    this.setState((prevState) => {
      return {
        showingFront: !prevState.showingFront
      }
    });
  }

  render() {
    return (
      <DeckPage
        deck={this.state.deck}
        activeCardIndex={this.state.activeCardIndex}
        showingFront={this.state.showingFront}
        nextCard={this.nextCard}
        previousCard={this.previousCard}
        flipCard={this.flipCard}
      />
    )
  }    
}

const DeckPage = ({deck, activeCardIndex, showingFront, nextCard, previousCard, flipCard}) => {
  if (deck) {
    const activeCard = deck.cards[activeCardIndex];
    let face = null;
    if (activeCard) {
      face = showingFront ? activeCard.front : activeCard.back;
    }
    else {
      face = 'Could not find card';
    }
    return (
      <div>
        <Link to={`/`}>Back</Link>
        <Link to={`/edit/${deck.id}`}>Edit</Link>
        <CardInfo
          deckTitle={deck.title}
          deckLength={deck.cards.length}
          cardIndex={activeCardIndex}
          cardSide={showingFront}
        />
        <Card
          face={face}
        />
        <CardControls 
          getNext={nextCard}
          getPrevious={previousCard}
          flipCard={flipCard}
        />
      </div>
    )
  }
  else {
    return (
      <div>Deck could not be found</div>
    )
  }
}

const CardControls = ({getPrevious, getNext, flipCard}) => (
  <div>
    <button onClick={getPrevious}>Previous</button>
    <button onClick={flipCard}>Flip</button>
    <button onClick={getNext}>Next</button>
  </div>
);

const CardInfo = ({deckTitle, deckLength, cardIndex, cardSide}) => (
  <div>
    <h2>{deckTitle}</h2>
    <div>{cardIndex + 1}/{deckLength}</div>
    <div>{cardSide ? 'Front' : 'Back'}</div>
  </div>
);

const Card = ({face}) => (
  <div className="card">
    {face}
  </div>
);

export default DeckPageContainer;
