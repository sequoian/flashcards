const express = require('express')
const router = express.Router()
const authenticateUser = require('../auth-check')
const decodeUser = require('../decode-user')
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

  sql.deleteDeck(db, deck_id)
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

const getDeck = function(req, res, next) {
  const db = req.app.get('db')
  const deck_id = parseInt(req.params.deckID)
  const user_id = req.decoded_token.sub

  sql.getDeck(db, deck_id)
    .then(deck => {
      if (deck.is_public || deck.author_id === user_id) {
        res.status(200).json(deck)
      }
      else {
        return res.status(403).end()
      }
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

router.get('/deck/:deckID', [decodeUser, getDeck])

router.delete('/deck/:deckID', [authenticateUser, checkDeletePermission, deleteDeck])

module.exports = router
