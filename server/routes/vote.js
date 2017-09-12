const express = require('express')
const router = express.Router()
const authenticateUser = require('../auth-check')
const decodeUser = require('../decode-user')
const sql = require('../database')
const logError = require('../log-error')

const getScore = function(req, res, next) {
  const db = req.app.get('db')
  const user_id = req.decoded_token.sub
  const deck_id = parseInt(req.params.deckID)

  const response = {
    upvotes: 0,
    downvotes: 0,
    user_vote: null
  }

  sql.getDeckVotes(db, deck_id)
    // get upvotes and downvotes
    .then(results => {
      results.forEach(deck => {
        if (deck.vote === 1) {
          response.upvotes += 1
        }
        else if (deck.vote === -1) {
          response.downvotes += 1
        }
        
        if (user_id) {
          return sql.getUserVote(db, deck_id, user_id)
        }
        else {
          return null
        }
      })
    })
    // get user vote
    .then(result => {
      if (result) {
        if (result.vote != 0) {
          response.user_vote = result.vote === 1 ? 'up' : 'down'
        }
      }
      
      // send response
      return res.status(200).json(response)
    })
    .catch(error => {
      logError(error)
      res.status(500).end()
    })
}

router.get('/votes/:deckID', [decodeUser, getScore])

module.exports = router