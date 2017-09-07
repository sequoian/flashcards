const express = require('express')
const router = express.Router()
const authenticateUser = require('../auth-check')
const sql = require('../database')
const logError = require('../log-error')

const checkDeletePermission = function(req, res, next) {
  const db = req.app.get('db')
  const user_id = req.decoded_token.sub
  const deck_id = parseInt(req.params.deckID)

  sql.hasDeckPermission(db, user_id, deck_id)
    .then(result => {
      if (result) {
        next()
      }
      else {
        res.status(403).end()
      }
    })
    .catch(e => {
      logError(e)
      res.status(500).end()
    })
}

const deleteDeck = function(req, res, next) {
  const db = req.app.get('db')
  const deck_id = parseInt(req.params.deckID)

  sql.deletDeck(db, deck_id)
    .then(() => {
      res.status(200).json({
        success: true,
        message: 'Deck was successfully deleted'
      })
    })
    .catch(error => {
      logError(error)
      res.status(500).end()
    })
}

const decodeUser = function(req, res, next) {
  // TODO: create function
  // A variation of authenticateUser, to be used instead on GET
  // instead of returning 401, simply set user to null
  next()
}

const checkGetPermission = function(req, res, next) {
  // TODO: create function
  // if user is author, allow
  // if not a user, or user is not author, allow only if deck is public
  next()
}

const getDeck = function(req, res, next) {
  const db = req.app.get('db')
  const deck_id = parseInt(req.params.deckID)

  sql.getDeck(db, deck_id)
    .then((query) => {
      res.status(200).json(query)
    })
    .catch((error) => {
      if (error.name === 'QueryResultError') {
        res.status(404).end()  // could not find the deck
      }
      else {
        logError(error)
        res.status(500).end()
      }  
    })
}

router.get('/deck/:deckID', [authenticateUser, checkGetPermission, getDeck])

router.delete('/deck/:deckID', [authenticateUser, checkDeletePermission, deleteDeck])

module.exports = router
