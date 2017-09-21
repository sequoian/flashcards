import React, {Component} from 'react'
import Auth from './Auth'
import UpvoteIcon from 'material-ui/svg-icons/action/thumb-up'
import DownvoteIcon from 'material-ui/svg-icons/action/thumb-down'
import IconButton from 'material-ui/IconButton'

class Vote extends Component {
  constructor(props) {
    super(props)
    this.state = {
      upvotes: 0,
      downvotes: 0,
      user_vote: null,
      error: null
    }
    this.upvote = this.upvote.bind(this)
    this.downvote = this.downvote.bind(this)
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
          user_vote: json.user_vote,
          error: null
        })
      }).catch(e => {
        this.setState({
          error: 'Something went wrong on our end and we could not retrieve the votes'
        })
      })
  }

  upvote() {
    this.vote(1)
  }

  downvote() {
    this.vote(-1)
  }

  vote(choice) {
    fetch(`/api/cast-vote/${this.props.deck_id}`, 
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': `bearer ${Auth.getToken()}`
      },
      body: JSON.stringify({vote: choice})
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
        const user_vote = json.user_vote === 1 ? 'up' : 'down'
        this.setState({
          upvotes: json.upvotes,
          downvotes: json.downvotes,
          user_vote: user_vote,
          error: null
        })
      })
      .catch(error => {
        const status = error.message
        let msg

        if (status === '401') {
          msg = 'You must be logged in to vote'
        }
        else if (status === '403') {
          msg = 'Voting is only allowed on public decks'
        }
        else {
          msg = 'Something went wrong and we could not submit your vote'
        }

        this.setState({error: msg})
      })
  }

  render() {
    const {upvotes, downvotes, user_vote, error} = this.state
    return (
      <div>
        <ErrorDisplay error={error} />
        <VoteControls
          user_vote={user_vote}
          upvote={this.upvote}
          downvote={this.downvote}
        />
        <PointDisplay 
          upvotes={upvotes}
          downvotes={downvotes}
        />
      </div>
    )
  }
}

const ErrorDisplay = ({error}) => (
  <div className="errors">{error}</div>
)

const VoteControls = ({user_vote, upvote, downvote}) => (
  <div>
    <IconButton
      onClick={upvote}
    >
      <UpvoteIcon
        color={user_vote === 'up' ? "#0a6d98" : "#000"}
      />
    </IconButton>
    <IconButton
      onClick={downvote}
    >
      <DownvoteIcon 
        color={user_vote === 'down' ? "#0a6d98" : "#000"}
      />
    </IconButton>
  </div>
)

const PointDisplay = ({upvotes, downvotes}) => {
  const percentage = Math.floor(upvotes / (upvotes + downvotes) * 100)
  return (
    <div>
      <div>Score: {upvotes - downvotes}</div>
      <div>
        {!isNaN(percentage) ?
        `${percentage} % positive of ${upvotes + downvotes} votes`
        : 'No votes'
        }
      </div>
    </div>
  )
}

export default Vote
