const express = require('express')
const router = express.Router()
const authenticateUser = require('../auth-check')
const sql = require('../database')
const logError = require('../log-error')

const getUser = function(req, res, next) {
  const db = req.app.get('db')
  const user_id = req.decoded_token.sub

  sql.getUser(db, user_id)
    .then(user => {
      res.status(200).json({
        user: {
          name: user.name,
          id: user.id,
          email: user.email
        }
      })
    })
    .catch(e => {
      logError(e)
      res.status(500).end()
    })
}

router.get('/user', [authenticateUser, getUser])

module.exports = router
