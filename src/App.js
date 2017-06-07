import React, { Component } from 'react';
import './App.css';

const flashcards = [
  {
    title: 'Regular Expressions',
    cards: [
      {
        front: '\w',
        back: 'word character'
      },
      {
        front: '\d',
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
  render() {
    return (
      <div className="App">
        <CardPage 
          set={flashcards[0]}
        />
      </div>
    );
  }
}

class CardPage extends Component {
  render() {
    const {set} = this.props;
    return (
      <div>
        <CardInfo
          setTitle={set.title}
          setLength={set.cards.length}
          cardIndex={2}
          cardSide={false}
        />
        <Card
          face={set.cards[2].back}
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
)

const CardInfo = ({setTitle, setLength, cardIndex, cardSide}) => (
  <div>
    <h2>{setTitle}</h2>
    <div>{cardIndex + 1}/{setLength}</div>
    <div>{cardSide ? 'Front' : 'Back'}</div>
  </div>
)

const Card = ({face}) => (
  <div>
    {face}
  </div>
)

export default App;
