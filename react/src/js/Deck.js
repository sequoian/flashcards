import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import Auth from './Auth'
import Card from './Card'
import Options from './DeckOptions'

class DeckPageContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deck: null,
      error: null,
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
          throw new Error(response.status)
        }
        else {
          return response.json()
        }
      })
      .then(json => {
        this.setState({
          deck: json
        })
      }).catch(e => {
        let msg
        const error = e.message

        if (error === '403') {
          msg = 'You do not have permission to view this deck'
        }
        else if (error === '404') {
          msg = 'This deck could not be found'
        }
        else {
          msg = 'Something went wrong on our end and we could not retrieve the deck'
        }
        this.setState({error: msg})
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
    const deckPage = !this.state.deck ? null : (
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
    return (
      <div>
        <Link to={`/`}>Back</Link>
        <div>{this.state.error}</div>
        {deckPage}
      </div>
    )
  }    
}

const DeckPage = ({deck, activeCardIndex, showingFront, nextCard, previousCard, 
  flipCard, shuffle, defaultFront, changeDefaultFace}) => {
    const header = (
      <DeckHeader
        title={deck.title}
        id={deck.id}
      />
    )

    if (deck.cards.length > 0) {
      const activeCard = deck.cards[activeCardIndex]
      return (
        <div>
          {header}
          <Card
            activeCard={deck.cards.length > 0 ? deck.cards[activeCardIndex] : null}
            activeCardIndex={activeCardIndex}
            showingFront={showingFront}
            nextCard={nextCard}
            previousCard={previousCard}
            flipCard={flipCard}
            deckLength={deck.cards.length}
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
        <div>
          {header}
          There are no cards in your deck.
        </div>
      )
    }
}

const DeckHeader = ({title, id}) => (
  <div>
    <h2>{title}</h2>
    <Link to={`/edit/${id}`}>Edit</Link>
  </div>
)

export default DeckPageContainer
