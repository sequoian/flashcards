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
      })

      if (user_id) {
        return sql.getUserVote(db, deck_id, user_id)
      }
      else {
        return null
      }
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

const checkVotePermission = function(req, res, next) {
  const db = req.app.get('db')
  const deck_id = parseInt(req.params.deckID)

  sql.deckIsPublic(db, deck_id)
    .then(result => {
      if (result) {
        next()
      }
      else {
        res.status(403).end()
      }
    })
    .catch(error => {
      logError(error)
      res.status(500).end()
    })
}

const castVote = function(req, res, next) {
  const db = req.app.get('db')
  const vote = req.body.vote
  const deck_id = parseInt(req.params.deckID)
  const user_id = req.decoded_token.sub

  sql.upsertVote(db, deck_id, user_id, vote)
    .then(result => {
      return sql.getDeckVotes(db, deck_id)
      // get upvotes and downvotes
        
      
    })
    .then(results => {
      let upvotes = 0
      let downvotes = 0

      results.forEach(deck => {
        if (deck.vote === 1) {
          upvotes += 1
        }
        else if (deck.vote === -1) {
          downvotes += 1
        }
      })

      res.status(200).json({
        user_vote: vote,
        upvotes: upvotes,
        downvotes: downvotes
      })
    })
    .catch(error => {
      logError(error)
      res.status(500).end()
    })
}

router.get('/votes/:deckID', [decodeUser, getScore])
router.post('/cast-vote/:deckID', [authenticateUser, checkVotePermission, castVote])

module.exports = router