import React, {Component} from 'react'

class VoteContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      upvotes: 25,
      downvotes: 4,
      user_vote: null
    }
    this.vote = this.vote.bind(this)
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
    const {upvotes, downvotes, user_vote} = this.state
    return (
      <Vote
        upvotes={upvotes}
        downvotes={downvotes}
        user_vote={user_vote}
        vote={this.vote}
      />
    )
  }
}

const Vote = ({upvotes, downvotes, user_vote, vote}) => (
  <form>
    <h5>Vote</h5>
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
