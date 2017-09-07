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

router.get('/deck-list', [authenticateUser, getUserDecks])

module.exports = router
