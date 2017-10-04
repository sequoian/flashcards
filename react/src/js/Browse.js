import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {formatDateRelative} from './Utility'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import CircularProgress from 'material-ui/CircularProgress'

class BrowseContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      decks: [],
      sorting: this.getSorting() || 'date_desc',
      error: null,
      fetching: false
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
    this.setState({fetching: true})
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
          error: null,
          fetching: false
        })
      })
      .catch(error => {
        this.setState({
          error: 'Something went wrong on our end and we could not retrieve any decks',
          fetching: false
        })
      }) 
  }

  changeSorting(event, index, value) {
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
    const {decks, sorting, error, fetching} = this.state
    return (
      <div>
        <BrowsePage>
          <Sorting
            sorting={sorting}
            handleChange={this.changeSorting}
          />
          {fetching ? 
          <CircularProgress 
            className="circ-progress"
          /> : null}
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
    <h1>Browse Public Decks</h1>
    {children}
  </div>
)

const DeckList = ({decks, error}) => (
  <div>
    <div className="errors">{error}</div>
    <ul className="browse-list">
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
  <div className="browse-list-item">
    <div className="list-item-title">
      <Link to={`/deck/${deck.id}`}>
        {deck.title}
      </Link>
    </div>
    <div className="list-item-info">
      <span>
        By <Link to={`/user/${deck.author_id}`}>
          {deck.author}
        </Link>
      </span>
      <br />
      <span>
        Created {formatDateRelative(deck.date_created)}
      </span>
      <span>
        {deck.score} points
      </span>
    </div>
  </div>
)

const Sorting = ({sorting, handleChange}) => (
  <div>
    <SelectField
      value={sorting}
      onChange={handleChange}
      floatingLabelText="Sort decks"
    >
      <MenuItem
        value='date_desc'
        primaryText="By newest"
      />
      <MenuItem
        value='date_asc'
        primaryText="By oldest"
      />
      <MenuItem
        value='score_desc'
        primaryText="By highest score"
      />
      <MenuItem
        value='score_asc'
        primaryText="By lowest score"
      />
    </SelectField>
  </div>
)

export default withRouter(BrowseContainer)
