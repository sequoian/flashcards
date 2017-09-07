import React, { Component } from 'react';
import DeckForm from './DeckForm';
import {Link, withRouter} from 'react-router-dom';
import Validation from './Validation'
import Auth from './Auth'

class NewDeck extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      error_msg: null
    }
    this.addDeck = this.addDeck.bind(this);
  }

  addDeck(id, title, cards) {
    const deck = {
      id: id,
      title: title,
      cards: cards
    }

    fetch('/api/add-deck',
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
          throw new Error()
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
        this.setState({error_msg: 'Something went wrong on our end.'})
      })
  }

  render() {
    const cancelPath = '/'
    return (
      <div>
        <Link to={cancelPath}>Back</Link>
        <h2>New Deck</h2>
        <DeckForm 
          onSubmit={this.addDeck}
          cancelPath={cancelPath}
          errors={this.state.errors}
          error_msg={this.state.error_msg}
        />
      </div>
    )
  }
}

export default withRouter(NewDeck);
