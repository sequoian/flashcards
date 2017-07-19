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
    return cards.map((set) => {
      return {
        id: set.id,
        title: set.title
      }
    })
  },
  getSet: function(id) {
    const cards = this.fetch(this.key);
    const thisSet = set => set.id === id;
    // return the set that matches the id
    return cards.find(thisSet);
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
          <Route path='/cards' component={DeckPage} />
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

/*
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flashcards: [],
      activeSetIndex: null
    }
    this.activateSet = this.activateSet.bind(this);
  }

  componentDidMount() {
    
    this.setState({
      flashcards: flashcards
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const {flashcards} = this.state;
    if (flashcards !== prevState.flashcards) {
      storeLocally('flashcards', flashcards);
    }
  }

  activateSet(id) {
    this.setState({
      activeSetIndex: id
    });
  }

  render() {
    const {flashcards, activeSetIndex} = this.state;
    let page = null;
    if (activeSetIndex === null) {
      page = (
        <SetList
          list={flashcards}
          nav={this.activateSet}
        />
      );
    }
    else if (flashcards[activeSetIndex]) {
      page = (
        <CardPage 
          set={flashcards[activeSetIndex]}
          toList={() => this.activateSet(null)}
        />
      );
    }
    else {
      page = 'Could not find flashcards.';
    }
    return (
      <div className="App">
        {page}
      </div>
    );
  }
}


const SetList = ({list, nav}) => (
  <ul className="set-list">
    {list.map((set, idx) => (
      <SetLink 
        key={idx} // TODO: change from idx to id
        set={set}
        toSet={() => nav(idx)} // TODO: change from idx to id
      />
    ))}
  </ul>
);

const SetLink = ({set, toSet}) => (
  <li>
    <a // TODO: use react router
      href="#" 
      onClick={event => {
        event.preventDefault()
        toSet()
      }}>
        {set.title}
      </a>
  </li>
);

class CardPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeCardIndex: 0,
      showingFront: true
    };
    this.nextCard = this.nextCard.bind(this);
    this.previousCard = this.previousCard.bind(this);
    this.flipCard = this.flipCard.bind(this);
  }

  nextCard() {
    const cards = this.props.set.cards;
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
    const cards = this.props.set.cards;
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
    const {set, toList} = this.props;
    const {activeCardIndex, showingFront} = this.state
    const activeCard = set.cards[activeCardIndex];
    let face = null;
    if (activeCard) {
      face = showingFront ? activeCard.front : activeCard.back;
    }
    else {
      face = 'Could not find card';
    }
    return (
      <div>
        <button onClick={toList}>Back</button>
        <CardInfo
          setTitle={set.title}
          setLength={set.cards.length}
          cardIndex={activeCardIndex}
          cardSide={showingFront}
        />
        <Card
          face={face}
        />
        <CardControls 
          getNext={this.nextCard}
          getPrevious={this.previousCard}
          flipCard={this.flipCard}
        />
      </div>
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

const CardInfo = ({setTitle, setLength, cardIndex, cardSide}) => (
  <div>
    <h2>{setTitle}</h2>
    <div>{cardIndex + 1}/{setLength}</div>
    <div>{cardSide ? 'Front' : 'Back'}</div>
  </div>
);

const Card = ({face}) => (
  <div className="card">
    {face}
  </div>
);

*/

export default App;
