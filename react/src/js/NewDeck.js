import React, { Component } from 'react';
import DeckForm from './DeckForm';
import {withRouter} from 'react-router-dom';
import Auth from './Auth'

class NewDeck extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      error_msg: null,
      submitting: false
    }
    this.addDeck = this.addDeck.bind(this);
  }

  addDeck(id, title, cards, is_public) {
    if (this.state.submitting) {
      return null
    }

    this.setState({submitting: true})
    
    const deck = {
      id: id,
      title: title,
      cards: cards,
      is_public: is_public
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
          throw new Error(response.status)
        }
        else {
          return response.json()
        }  
      })
      .then(json => {
        if (json.success) {
          this.props.history.replace(`/deck/${json.id}`)
        }
        else {
          this.setState({
            errors: json.errors,
            error_msg: 'Please fix the errors below'
          })
        }
        this.setState({submitting: false})
      })
      .catch(e => {
        if (e.message === '401') {
          this.setState({error_msg: 'You must be logged in to do that'})
        }
        else {
          this.setState({error_msg: 'Something went wrong on our end.'})
        }
        this.setState({submitting: false})
      })
  }

  render() {
    const cancelPath = '/'
    return (
      <div>
        <h1>Create Flashcards</h1>
        {!Auth.isUserAuthenticated() ? <NoUserWarning /> : null}
        <DeckForm 
          onSubmit={this.addDeck}
          cancelPath={cancelPath}
          errors={this.state.errors}
          error_msg={this.state.error_msg}
          disable_submit={this.state.submitting}
        />
      </div>
    )
  }
}

const NoUserWarning = () => (
  <div className="warning">
    Warning: You must be logged in to create a new flashcard deck.
  </div>
)

export default withRouter(NewDeck);
