import React, { Component } from 'react';
import DeckForm from './DeckForm';
import {Link, withRouter} from 'react-router-dom';
import Validation from './Validation'
import Auth from './Auth'

class EditDeck extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deck: null,
      errors: {},
      error_msg: null
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
          throw new Error(`status ${response.status}`);
        }
        return response.json();
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
        console.log(e)
      })
  }

  // API Update
  updateDeck(id, title, cards) {
    const deck = {
      id: id,
      title: title,
      cards: cards
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
        if (e.message === '403') {
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
          if (e.message === '403') {
            alert("You do not have permission to do that")
          }
          else {
            this.setState({error_msg: 'Something went wrong on our end.'})
          }
        })
    }
  }

  render() {
    const {deck} = this.state;
    const cancelPath = deck ? `/cards/${deck.id}` : '/';
    return (
      deck ?
        <div> 
          <Link to={cancelPath}>Back</Link>
          <h2>Edit Deck</h2>
          <button onClick={this.deleteDeck} className='deleteBtn'>Delete</button>
          <DeckForm 
            id={deck.id}
            title={deck.title}
            cards={deck.cards}
            onSubmit={this.updateDeck}
            cancelPath={cancelPath}
            errors={this.state.errors}
            error_msg={this.state.error_msg}
          />
        </div> : 
        <p>Deck not found</p>
    )
  }
}

export default withRouter(EditDeck);