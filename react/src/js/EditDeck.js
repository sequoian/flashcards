import React, { Component } from 'react'
import DeckForm from './DeckForm'
import {withRouter} from 'react-router-dom'
import Auth from './Auth'
import {BackLinkHistory} from './HistoryLink'
import FlatButton from 'material-ui/FlatButton'

class EditDeck extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      error_msg: null
    }
    this.updateDeck = this.updateDeck.bind(this);
    this.deleteDeck = this.deleteDeck.bind(this);
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
        const {history, location} = this.props
        if (json.success) {
          this.props.updateDeck()
          if (location.state && location.state.hasOwnProperty('from')) {
            history.goBack()
          }
          else {
            history.push(`/deck/${json.id}`)
          }
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
    const {deck} = this.props
    const {error_msg, errors} = this.state
    const cancelPath = `/deck/${deck.id}`
    
    return (
      <div>
        <Header 
          cancelPath={cancelPath}
        />
        <FlatButton
          label="Delete Deck"
          onClick={this.deleteDeck}
        />
        <UserWarning
          is_author={deck.is_author}
        />
        <DeckForm 
          id={deck.id}
          title={deck.title}
          is_public={deck.is_public}
          cards={deck.cards}
          onSubmit={this.updateDeck}
          cancelPath={cancelPath}
          errors={errors}
          error_msg={error_msg}
        />
      </div>
    )
  }
}

const Header = ({cancelPath}) => {
  return (
    <div>
      <BackLinkHistory 
        to={cancelPath}
        value="Back to deck"  
      />
      <h2>Edit Deck</h2>
    </div>
  )
}

const UserWarning = ({is_author}) => {
  if (!Auth.isUserAuthenticated()) {
    return (
      <div className="warning">
        Warning: You must be logged in to edit flashcard decks.
      </div>
    )
  }
  else if (!is_author) {
    return (
      <div className="warning">
        Warning: Only the author of a flashcard deck can edit it.
      </div>
    )
  }
  else {
    return null
  }
}

export default withRouter(EditDeck);