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

// a variation on auth check
const decodeUser = function(req, res, next) {
  req.decoded_token.sub = null

  if(!req.headers.authorization) {
    return next()
  }
  else {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, secret.jwt, (err, decoded) => {
      if (err) {
        return next()
      }
  
      const user_id = decoded.sub;
      const db = req.app.get('db')
      
      sql.getUser(db, user_id)
        .then(success => {
          req.decoded_token.sub = decoded.sub;
          return next()
        })
        .catch(failure => {
          return next()
        })
    })
  }
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

router.get('/deck/:deckID', [authenticateUser, getDeck])

router.delete('/deck/:deckID', [authenticateUser, checkDeletePermission, deleteDeck])

module.exports = router
