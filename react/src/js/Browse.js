import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {formatDate} from './Utility'
import Auth from './Auth'


class BrowseContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      decks: [],
      sorting: 'date_desc',
      error: null
    }
    this.changeSorting = this.changeSorting.bind(this)
  }

  componentDidMount() {
    this.getPublicDecks()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.sorting !== prevState.sorting) {
      this.getPublicDecks()
    }
  }

  getPublicDecks() {
    fetch(`/api/public-decks/${this.state.sorting}`, {method: 'GET'})
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
          decks: json,
          error: null
        })
      })
      .catch(error => {
        this.setState({
          error: 'Something went wrong on our end and we could not retrieve any decks'
        })
      }) 
  }

  changeSorting(event) {
    this.setState({
      sorting: event.target.value
    })
  }

  render() {
    const {decks, sorting, error} = this.state
    return (
      <div>
        <BrowsePage>
          <Sorting
            sorting={sorting}
            handleChange={this.changeSorting}
          />
          <DeckList
            decks={decks}
          />
        </BrowsePage>
      </div>
    )
  }
}

const BrowsePage = ({children}) => (
  <div>
    {Auth.isUserAuthenticated() ? <Link to='/'>Back</Link> : null}
    <h2>Browse Public Decks</h2>
    {children}
  </div>
)

const DeckList = ({decks}) => (
  <ul className="deck-list">
    {decks.map(deck => (
      <li key={deck.id}>
        <DeckListItem
          deck={deck}
        />
      </li>
      ))}  
  </ul>
)

const DeckListItem = ({deck}) => (
  <div>
    <div>
      <Link to={`/cards/${deck.id}`}>
        {deck.title}
      </Link>
    </div>
    <div>
      By <Link to={`/user/${deck.author_id}`}>
        {deck.author}
      </Link>
    </div>
    <div>
      Score: {deck.score}
    </div>
    <div>
      Created {formatDate(deck.date_created)}
    </div>
  </div>
)

const Sorting = ({sorting, handleChange}) => (
  <div>
    {'Sort: '} 
    <select
      value={sorting}
      onChange={handleChange}
    >
      <option value='date_desc'>By date created (newest)</option>
      <option value='date_asc'>By date created (oldest)</option> 
      <option value='score_desc'>By score (highest)</option>
      <option value='score_asc'>By score (lowest)</option>
    </select>
  </div>
)

export default BrowseContainer
