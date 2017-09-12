import React, {Component} from 'react'
import Auth from './Auth'

class VoteContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      upvotes: 0,
      downvotes: 0,
      user_vote: null,
      error: null
    }
    this.vote = this.vote.bind(this)
  }

  componentDidMount() {
    fetch(`/api/votes/${this.props.deck_id}`, {
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
        this.setState({
          upvotes: json.upvotes,
          downvotes: json.downvotes,
          user_vote: json.user_vote
        })
      }).catch(e => {
        this.setState({
          error: 'Something went wrong on our end and we could not retrieve the votes'
        })
      })
  }

  vote(choice) {
    if (choice === 'up') {
      this.setState({
        user_vote: this.state.user_vote === 'up' ? null : 'up'
      })
    }
    else {
      this.setState({
        user_vote: this.state.user_vote === 'down' ? null : 'down'
      })
    }
  }

  render() {
    const {upvotes, downvotes, user_vote, error} = this.state
    return (
      <Vote
        upvotes={upvotes}
        downvotes={downvotes}
        user_vote={user_vote}
        vote={this.vote}
        error={error}
      />
    )
  }
}

const Vote = ({upvotes, downvotes, user_vote, vote, error}) => (
  <form>
    <h5>Vote</h5>
    <div className="errors">{error}</div>
    <div>Score: {upvotes - downvotes} (Good: {upvotes}, Bad: {downvotes})</div>
    <button
      className={user_vote === 'up' ? "vote-btn voted" : "vote-btn"}
      type="button"
      onClick={() => vote('up')}
    >
      Good
    </button>
    <button
      className={user_vote === 'down' ? "vote-btn voted" : "vote-btn"}
      type="button"
      onClick={() => vote('down')}
    >
      Bad
    </button>

  </form>
)

export default VoteContainer
