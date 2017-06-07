import React, { Component } from 'react';
import './App.css';

const c = [
  {
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
]


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flashcards: [],
      activeSetIndex: null
    }
  }

  componentDidMount() {
    this.setState({
      flashcards: c,  // should pull from json file(s)
      activeSetIndex: 0  // for testing
    });
  }

  render() {
    const {flashcards, activeSetIndex} = this.state;
    let page = null;
    if (flashcards[activeSetIndex]) {
      page = (
        <CardPage 
          set={flashcards[activeSetIndex]}
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

class CardPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeCardIndex: 0,
      showingFront: true
    }
  }

  render() {
    const {set} = this.props;
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
        <CardInfo
          setTitle={set.title}
          setLength={set.cards.length}
          cardIndex={activeCardIndex}
          cardSide={showingFront}
        />
        <Card
          face={face}
        />
        <CardControls />
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
  <div>
    {face}
  </div>
);

export default App;
