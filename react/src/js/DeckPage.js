import React, { Component } from 'react'
import Deck from './Deck'
import Flashcards from './Flashcards'
import EditDeck from './EditDeck'
import Auth from './Auth'
import {Route, Switch, withRouter} from 'react-router-dom'

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
    this.updateDeck = this.updateDeck.bind(this)
  }

  componentDidMount() {
    this.fetchDeck()
  }

  fetchDeck() {
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

  updateDeck() {
    this.fetchDeck()
  }

  renderDeck() {
    const {deck, error, shuffle, facing} = this.state
    if (deck) {
      return (
        <Deck
          deck={deck}
          shuffle={shuffle}
          facing={facing}
          enterFlashcards={this.enterFlashcards}
          changeFacing={this.changeFacing}
          changeShuffle={this.changeShuffle}
        />  
      )
    }
    else if (error) {
      return <Error error={error} />
    }
    else {
      return null
    }
  }

  renderEdit() {
    const {deck, error} = this.state
    if (deck) {
      return (
        <EditDeck 
          deck={deck} 
          updateDeck={this.updateDeck} 
        />
      )
    }
    else if (error) {
      return <Error error={error} />
    }
    else {
      return null
    }
  }

  renderFlashcards() {
    const {deck, shuffle, facing, error} = this.state
    const default_front = facing === 'front'
    
    if (deck) {
      return (
        <Flashcards
          deck={deck}
          shuffle={shuffle}
          defaultFront={default_front}
        />
      )
    }
    else if (error) {
      return <Error error={error} />
    }
    else {
      return null
    }
  }

  render() {
    const {match} = this.props
    return (
      <Switch>
        <Route
          exact path={`${match.url}`}
          render={() => this.renderDeck()}
        />
        <Route
          path={`${match.url}/flashcards`}
          render={() => this.renderFlashcards()}
        />
        <Route
          path={`${match.url}/edit`}
          render={() => this.renderEdit()}
        />
      </Switch>
    )
  }    
}

const Error = ({error}) => (
  <div>{error}</div>
)

export default withRouter(DeckPage)
