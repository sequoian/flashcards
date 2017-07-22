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
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    const deck = localAPI.getDeck(
      parseInt(this.props.match.params.id, 10)
    );
    this.setState({
      deck: deck
    });

    window.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown)
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

  handleKeyDown(event) {
    switch (event.key) {
      case 'ArrowUp':
        this.flipCard();
        break;
      case 'ArrowDown':
        this.flipCard();
        break;
      case 'ArrowLeft':
        this.previousCard();
        break;
      case 'ArrowRight':
        this.nextCard();
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <DeckPage
        onKeyPress={() => console.log('keydown')}
        onClick={() => console.log('clicked')}
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
    if (deck.cards.length > 0) {
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
          <CardInfo
            deckID={deck.id}
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
        <NoCards deck={deck} />
      )
    }
  }
  else {
    return (
      <NoDeck />
    )
  }
}

const NoCards = ({deck}) => (
  <div>
    <Link to={`/`}>Back</Link>  
    <h2>{deck.title}</h2>
    <Link to={`/edit/${deck.id}`}>Edit</Link>
    <div>There are no cards in this deck.  Add some <Link to={`/edit/${deck.id}`}>here</Link>.</div>
  </div>
) 

const NoDeck = () => (
  <div>
    <Link to={`/`}>Back</Link>
    <div>This deck could not be found</div>
  </div>
)

const CardControls = ({getPrevious, getNext, flipCard}) => (
  <div>
    <button onClick={getPrevious}>Previous</button>
    <button onClick={flipCard}>Flip</button>
    <button onClick={getNext}>Next</button>
  </div>
);

const CardInfo = ({deckID, deckTitle, deckLength, cardIndex, cardSide}) => (
  <div>
    <h2>{deckTitle}</h2>
    <Link to={`/edit/${deckID}`}>Edit</Link>
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
