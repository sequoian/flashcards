import React, { Component } from 'react';
import DeckForm from './DeckForm';
import {withRouter} from 'react-router-dom';
import Auth from './Auth'

class EditDeck extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deck: null,
      errors: {},
      error_msg: null,
      fetch_result: null
    }
    this.updateDeck = this.updateDeck.bind(this);
    this.deleteDeck = this.deleteDeck.bind(this);
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
        // set delete status and key for cards
        json.cards.forEach((card, idx) => {
          card.delete = false;
          card.key = idx;
        })
        
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
        this.setState({fetch_result: msg})
      })
  }

  // API Update
  updateDeck(id, title, cards, is_public) {
    const deck = {
      id: id,
      title: title,
      cards: cards,
      is_public: is_public
    }
    
    fetch('/api/update-deck',
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': `bearer ${Auth.getToken()}`
      },
      body: JSON.stringify({deck: deck})
    })
      .then(response => {
        if (response.status > 400) {
          throw new Error(response.status)
        }
        else {
          return response.json()
        }  
      })
      .then(json => {
        if (json.success) {
          this.props.history.replace(`/cards/${json.id}`)
        }
        else {
          this.setState({
            errors: json.errors,
            error_msg: json.message
          })
        }
      })
      .catch(e => {
        if (e.message === '401') {
          this.setState({error_msg: 'You must be logged in to do that'})
        }
        else if (e.message === '403') {
          this.setState({error_msg: 'You do not have permission to do that'})
        }
        else {
          this.setState({error_msg: 'Something went wrong on our end.'})
        }       
      })
  }

  deleteDeck() {
    if (window.confirm('Are you sure you want to delete this deck?')) {
      fetch(`/api/deck/${this.props.match.params.id}`,
      {
        method: 'DELETE',
        headers: {
        'Authorization': `bearer ${Auth.getToken()}`
      }
      })
        .then(response => {
          if (response.status > 400) {
            throw new Error(response.status)
          }
          else {
            return response.json
          }
        })
        .then(json => {
          this.props.history.replace('/');
        })
        .catch(e => {
          if (e.message === '401') {
            alert('You must be logged in to do that')
          }
          else if (e.message === '403') {
            alert("You do not have permission to do that")
          }
          else {
            this.setState({error_msg: 'Something went wrong on our end.'})
          }
        })
    }
  }

  render() {
    const {deck, fetch_result} = this.state;
    const cancelPath = deck ? `/cards/${deck.id}` : '/'
    return (
      <div>
        <h2>Edit Deck</h2>
        {deck ?
        <div>
          <button onClick={this.deleteDeck} className='deleteBtn'>Delete</button>
          <DeckForm 
            id={deck.id}
            title={deck.title}
            is_public={deck.is_public}
            cards={deck.cards}
            onSubmit={this.updateDeck}
            cancelPath={cancelPath}
            errors={this.state.errors}
            error_msg={this.state.error_msg}
          />
        </div>
        : fetch_result
      }
      </div>
    )
  }
}

export default withRouter(EditDeck);