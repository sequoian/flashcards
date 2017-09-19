import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import Auth from './Auth'

class DeckListContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      decks: [],
      error: null
    }
  }

  getUserList() {
    // fetch list from database
    fetch('/api/deck-list', {
      method: 'GET',
      headers: {
        'Authorization': `bearer ${Auth.getToken()}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        else {
          return response.json()
        }
        
      })
      .then(json => {
        if (json.length > 0) {
          this.setState({
            decks: json
          })
        }
        else {
          this.setState({
            error: 'You do not have any flashcard decks at the moment'
          })
        }
        
      }).catch(e => {
        let msg
        const error = e.message
        
        if (error === '401') {
          msg = 'You need to be logged in to view your flashcard decks'
        }
        else {
          msg = 'Something went wrong on our end and we could not retrieve your flashcard decks'
        }
        this.setState({
          error: msg
        })
      })
  }

  componentDidMount() {
    if (Auth.isUserAuthenticated()) {
      this.getUserList()
    }
  }

  render() {
    const {decks, error} = this.state
    if (Auth.isUserAuthenticated()) {
      return (
        <div>
          <Header />
          <DeckList
            decks={decks}
            error={error}
          />
        </div>
      ) 
    }
    else {
      return (
        <div>
          <Header />
          <NoUser />
        </div>
      )
    }
    
  }
}

const Header = () => (
  <h3>My Flashcards</h3>
)

const DeckList = ({decks, error}) => (
  <div>
    <div>{error}</div>
    <ul className="deck-list">
      {decks.map(deck => (
        <li key={deck.id}>
          <DeckItem
            title={deck.title}
            id={deck.id}
          />
        </li>
        ))}  
    </ul>
  </div>
)

const DeckItem = ({title, id}) => (
  <Link to={`/deck/${id}`}>
    {title}
  </Link>
)

const NoUser = () => (
  <div>
    You must <Link to='/signup'>sign up</Link> for an account or <Link to='/login'>log in</Link> to
    view your flashcards.
  </div>
)

export default DeckListContainer;
