import React, {Component} from 'react'
import {formatDate} from './Utility'
import {Link} from 'react-router-dom'

class UserPageContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      error: null,
      decks: []
    }
  }

  componentDidMount() {
    fetch(`/api/user/${this.props.match.params.id}`, {
      method: 'GET'
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
          user: json.user,
          decks: json.decks
        })
      }).catch(e => {
        let msg

        if (e.message === '404') {
          msg = 'This user could not be found'
        }
        else {
          msg = 'Something went wrong on our end and we could not retrieve the deck'
        }
        this.setState({error: msg})
      })
  }

  render() {
    const {user, error, decks} = this.state
    
    if (user) {
      return (
        <UserPage
          name={user.name}
          joined={user.joined}
          decks={decks}
        />
      )
    }
    else {
      return <div>{error}</div>
    }
  }
}

const UserPage = ({name, joined, decks}) => (
  <div>
    <h2>{name}</h2>
    <div>Member since {formatDate(joined)}</div>
    {
      decks.length > 0 ?
      <div>
        <h4>Public Decks</h4>
        <ul className="deck-list">
          {decks.map(deck => (
            <li key={deck.id}>
              <Link to={`/cards/${deck.id}`}>
                {deck.title}
              </Link>
            </li>
            ))}  
        </ul>
      </div>
      : null
    }
    
  </div>
)

export default UserPageContainer
