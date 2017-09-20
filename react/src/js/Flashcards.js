import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {BackLinkHistory} from './HistoryLink'

class Flashcards extends Component {
  constructor(props) {
    super(props)
    const {deck, defaultFront, shuffle} = this.props
    this.state = {
      deck: shuffle ? this.shuffleDeck(deck) : deck,
      activeCardIndex: 0,
      showingFront: defaultFront,
      defaultFront: defaultFront
    }
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.nextCard = this.nextCard.bind(this)
    this.previousCard = this.previousCard.bind(this)
    this.flipCard = this.flipCard.bind(this)
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown)
  }

  shuffleDeck(deck_ref) {
    const deck = JSON.parse(JSON.stringify(deck_ref))  // deep copy
    const cards = deck.cards
    let current_idx = cards.length
    let tmp, random_idx

    // Fisher-Yates shuffle
    while(current_idx !== 0) {
      random_idx = Math.floor(Math.random() * current_idx)
      current_idx -= 1

      tmp = cards[current_idx]
      cards[current_idx] = cards[random_idx]
      cards[random_idx] = tmp
    }

    return deck
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
    })
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
    })
  }

  flipCard() {
    this.setState({
      showingFront: !this.state.showingFront
    })
  }

  handleKeyDown(event) {
    switch (event.key) {
      case 'ArrowUp':
        this.flipCard()
        break
      case 'ArrowDown':
        this.flipCard()
        break
      case 'ArrowLeft':
        this.previousCard()
        break
      case 'ArrowRight':
        this.nextCard()
        break
      default:
        break
    }
  }

  render() {
    const {deck, activeCardIndex, showingFront} = this.state
    const activeCard = deck.cards[activeCardIndex]

    return (
      <div>
        <Header
          title={deck.title}
        />
        <CardInfo
          deck_length={deck.cards.length}
          index={activeCardIndex}
          side={showingFront}
        />
        <CardFace
          face={showingFront ? activeCard.front : activeCard.back}
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

const Header = withRouter(({title, match}) => {
  const id = match.url.split('/')[2]
  return (
    <div>
      <h2>{title}</h2>
      <BackLinkHistory 
        to={`/deck/${id}`}
        value="Back"  
      />
    </div>
  )
})

const CardInfo = ({index, deck_length, side}) => (
  <div>
    <div>{index + 1}/{deck_length}</div>
    <div>{side ? 'Front' : 'Back'}</div>
  </div>
)

const CardFace = ({face}) => (
  <div className="card">
    {face}
  </div>
)

const CardControls = ({getPrevious, getNext, flipCard}) => (
  <div>
    <button onClick={getPrevious}>Previous</button>
    <button onClick={flipCard}>Flip</button>
    <button onClick={getNext}>Next</button>
  </div>
)

export default Flashcards
