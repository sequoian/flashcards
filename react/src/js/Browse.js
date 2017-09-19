import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {formatDate} from './Utility'


class BrowseContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      decks: [],
      sorting: this.getSorting() || 'date_desc',
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
    const value = event.target.value
    this.storeSorting(value)
    this.setState({
      sorting: value
    })
  }

  getSorting() {
    return sessionStorage.getItem('sorting')
  }

  storeSorting(value) {
    sessionStorage.setItem('sorting', value)
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
            error={error}
          />
        </BrowsePage>
      </div>
    )
  }
}

const BrowsePage = ({children}) => (
  <div>
    <h2>Browse Public Decks</h2>
    {children}
  </div>
)

const DeckList = ({decks, error}) => (
  <div>
    <div className="errors">{error}</div>
    <ul className="deck-list">
      {decks.map(deck => (
        <li key={deck.id}>
          <DeckListItem
            deck={deck}
          />
        </li>
        ))}  
    </ul>
  </div>
)

const DeckListItem = ({deck}) => (
  <div>
    <div>
      <Link to={`/deck/${deck.id}`}>
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

export default withRouter(BrowseContainer)
