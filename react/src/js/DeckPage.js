import React, { Component } from 'react'
import Deck from './Deck'
import Flashcards from './Flashcards'
import Auth from './Auth'
import {Link} from 'react-router-dom'
import {BackLink} from './HistoryLink'

class DeckPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      deck: null,
      error: null,
      shuffle: false,
      facing: 'front',
      page: 'deck'
    }
    this.changeFacing = this.changeFacing.bind(this)
    this.changeShuffle = this.changeShuffle.bind(this)
    this.enterFlashcards = this.enterFlashcards.bind(this)
    this.enterDeck = this.enterDeck.bind(this)
  }

  componentDidMount() {
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
  }

  changeFacing(event) {
    this.setState({
      facing: event.target.value
    })
  }

  changeShuffle(event) {
    this.setState({
      shuffle: event.target.checked
    })
  }

  enterDeck() {
    this.setState({
      page: 'deck'
    })
  }

  enterFlashcards() {
    this.setState({
      page: 'flashcards'
    })
  }

  enterEdit() {
    this.setState({
      page: 'edit'
    })
  }

  renderDeck() {
    const {deck, error, shuffle, facing} = this.state
    if (deck) {
      return (
        <div>
          <BackLink />
          <Deck
            deck={deck}
            shuffle={shuffle}
            facing={facing}
            enterFlashcards={this.enterFlashcards}
            changeFacing={this.changeFacing}
            changeShuffle={this.changeShuffle}
          />  
        </div>
      )
    }
    else if (error) {
      return (
        <div>
          <BackLink />
          <Error error={error} />
        </div>
      )
    }
    else {
      return <BackLink />
    }
  }

  renderEdit() {

  }

  renderFlashcards() {
    const {deck, shuffle, facing} = this.state
    const default_front = facing === 'front'

    return (
      <Flashcards
        deck={deck}
        shuffle={shuffle}
        defaultFront={default_front}
        exit={this.enterDeck}
      />
    )
  }

  render() {
    const page = this.state.page
    if (page === 'flashcards') {
      return this.renderFlashcards()
    }
    else if (page === 'edit') {
      return this.renderEdit()
    }
    else {
      return this.renderDeck()
    }
  }    
}

const Error = ({error}) => (
  <div>{error}</div>
)

export default DeckPage
