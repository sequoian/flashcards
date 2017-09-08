import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import Auth from './Auth'

class DeckPageContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deck: null,
      activeCardIndex: 0,
      showingFront: true,
      defaultFront: true
    };
    this.nextCard = this.nextCard.bind(this);
    this.previousCard = this.previousCard.bind(this);
    this.flipCard = this.flipCard.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.shuffleDeck = this.shuffleDeck.bind(this);
    this.changeDefaultFace = this.changeDefaultFace.bind(this);
  }

  componentDidMount() {
    // fetch deck from database
    fetch(`/api/deck/${this.props.match.params.id}`, {
      method: 'GET',
      headers: {
        'Authorization': `bearer ${Auth.getToken()}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`status ${response.status}`);
        }
        return response.json();
      })
      .then(json => {
        this.setState({
          deck: json
        })
      }).catch(e => {
        console.log(e)
      })

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
        showingFront: prevState.defaultFront ? true : false
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
        showingFront: prevState.defaultFront ? true : false
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

  /**
   * Shuffle deck using the Fisher-Yates Shuffle
   */
  shuffleDeck() {
    const deck = Object.assign({}, this.state.deck);  // copy deck
    const cards = deck.cards;
    let current_idx = cards.length;
    let tmp, random_idx;

    while(current_idx !== 0) {
      random_idx = Math.floor(Math.random() * current_idx);
      current_idx -= 1;

      tmp = cards[current_idx];
      cards[current_idx] = cards[random_idx];
      cards[random_idx] = tmp;
    }

    this.setState({
      deck: deck
    })
  }

  changeDefaultFace() {
    this.setState((prevState) => {
      const face = !prevState.defaultFront
      return {
        defaultFront: face,
        showingFront: face
      }
    })
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
        shuffle={this.shuffleDeck}
        defaultFront={this.state.defaultFront}
        changeDefaultFace={this.changeDefaultFace}
      />
    )
  }    
}

const DeckPage = ({deck, activeCardIndex, showingFront, nextCard, previousCard, 
  flipCard, shuffle, defaultFront, changeDefaultFace}) => {
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
          <Options
            shuffle={shuffle}
            defaultFront={defaultFront}
            changeDefaultFace={changeDefaultFace}
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

const Options = ({shuffle, defaultFront, changeDefaultFace}) => (
  <div>
    <h4>Options</h4>
    <ShuffleDisplay 
      shuffle={shuffle}
    />
    <DefaultFace
      defaultFront={defaultFront}
      changeDefaultFace={changeDefaultFace}
    />
  </div>
)

const DefaultFace = ({defaultFront, changeDefaultFace}) => (
  <div>
    <button
      type="button"
      onClick={changeDefaultFace}
    >
      Default Face: {defaultFront ? 'Front' : 'Back'}
    </button>
  </div>
)

class ShuffleDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false
    }
    this.shuffle = this.shuffle.bind(this)
  }

  shuffle() {
    // shuffle deck
    this.props.shuffle();
    
    // activate shuffle message and clear timer if exists
    this.setState((prevState) => {
      return {
        active: true,
        timer: null
      }
    })

    // TODO: guarantee timer is cleared BEFORE new timer is set
    // set timer to deactivate shuffle message
    const timer = setTimeout(() => {
      this.setState({
        active: false,
        timer: null
      })
    }, 1000);

    // keep track of timer
    this.setState({
      timer: timer
    })
  }

  render() {
    return (
      <div>
        <button 
          type="button" 
          onClick={this.shuffle}
        >
          Shuffle Deck
        </button>
        <span
          className={this.state.active ? 'shuffled-show' : 'shuffled-hide'}
        >
          Shuffled
        </span>
      </div>
    ) 
  }
}

export default DeckPageContainer;
