const express = require('express')
const router = express.Router()
const authenticateUser = require('../auth-check')
const sql = require('../database')
const logError = require('../log-error')

const getProfile = function(req, res, next) {
  const db = req.app.get('db')
  const user_id = req.decoded_token.sub

  sql.getUser(db, user_id)
    .then(user => {
      res.status(200).json({
        user: {
          name: user.name,
          id: user.id,
          email: user.email,
          joined: user.date_joined
        }
      })
    })
    .catch(e => {
      logError(e)
      res.status(500).end()
    })
}

const getUser = function(req, res, next) {
  const db = req.app.get('db')
  const user_id = parseInt(req.params.userID)

  sql.getUser(db, user_id)
    .then(user => {
      res.status(200).json({
        name: user.name,
        joined: user.date_joined
      })
    })
    .catch(e => {
      logError(e)
      res.status(500).end()
    })
}

router.get('/profile', [authenticateUser, getProfile])
router.get('/user/:userID', [getUser])

module.exports = router
