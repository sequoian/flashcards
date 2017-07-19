import React, { Component } from 'react';
import './App.css';
import {Route, Link, Switch} from 'react-router-dom';

// used for testing purposes
const defaultCards = [
  {
    id: 1,
    title: 'Regular Expressions',
    cards: [
      {
        front: '\\w',
        back: 'word character'
      },
      {
        front: '\\d',
        back: 'digit'
      },
      {
        front: '[ ]',
        back: 'character set: match any character in the set'
      },
    ]
  },
  {
    id: 2,
    title: 'Vim Commands',
    cards: [
      {
        front: 'w',
        back: 'move cursor forward by one word'
      },
      {
        front: 'b',
        back: 'move cursor backward by one word'
      },
      {
        front: 'A',
        back: 'append text to the end of the current line'
      }
    ]
  },
];

const localAPI = {
  key: 'flashcards',

  getList: function() {
    const cards = this.fetch(this.key);
    // return only the id and title, not the cards
    return cards.map((deck) => {
      return {
        id: deck.id,
        title: deck.title
      }
    })
  },

  getDeck: function(id) {
    const cards = this.fetch(this.key);
    const thisDeck = deck => deck.id === id;
    // return the set that matches the id
    return cards.find(thisDeck);
  },

  fetch: function(key) {
    const data = localStorage.getItem(key);
    return JSON.parse(data) || [];
  },

  store: function(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

function testLocalStorage() {
  const test = 'test';
  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  }
  catch(e) {
    return false;
  }
}

// for testing purposes
function hydrateLocalStorage() {
  localAPI.store('flashcards', defaultCards)
}


class App extends Component {
  componentDidMount() {
    // for testing purposes
    if (localAPI.fetch('flashcards').length < 1 && testLocalStorage()) {
      hydrateLocalStorage();
    }
  }
  
  render() {
    return (
      <div>
        <Switch>
          <Route exact path='/' component={DeckListContainer} />
          <Route path='/cards/:id' component={DeckPageContainer} />
        </Switch>
      </div>
    )  
  }
}

class DeckListContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      decks: []
    }
  }

  componentDidMount() {
    const decks = localAPI.getList();
    this.setState({
      decks: decks
    });
  }

  render() {
    return (
      <DeckList
        decks={this.state.decks}
      />
    );
  }
}

const DeckList = ({decks}) => (
  <ul className="deck-list">
    {decks.map(deck => (
      <li key={deck.id}>
        <Link to={`/cards/${deck.id}`}>
          {deck.title}
        </Link>
      </li>
      ))}  
  </ul>
);

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

export default App;
