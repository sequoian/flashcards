const express = require('express')
const router = express.Router()
const authenticateUser = require('../auth-check')
const sql = require('../database')
const logError = require('../log-error')

const getUserDecks = function(req, res, next) {
  const db = req.app.get('db')
  const user_id = req.decoded_token.sub
  
  sql.getUserDecks(db, user_id)
    .then(result => {
      res.status(200).json(result)
    })
    .catch(e => {
      logError(e)
      res.status(500).end()
    })
}

const getPublicDecks = function(req, res, next) {
  const db = req.app.get('db')
  const sorting = req.params.sorting

  sql.getPublicDecks(db, sorting)
    .then(decks => {
      res.status(200).json(decks)
    })
    .catch(error => {
      logError(error)
      res.status(500).end()
    })
}

router.get('/deck-list', [authenticateUser, getUserDecks])
router.get('/public-decks/:sorting', getPublicDecks)

module.exports = router
