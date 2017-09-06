const express = require('express')
const router = express.Router()
const authenticateUser = require('../auth-check')
const validation = require('../validation')
const sql = require('../database')
const logError = require('../log-error')
const bcrypt = require('bcrypt')
const salt_rounds = 10

const trimInputs = function(req, res, next) {
  const {old_password, password, confirm} = req.body
  try {
    req.body.old_password = old_password.trim()
    req.body.password = password.trim()
    req.body.confirm = confirm.trim()
    next()
  }
  catch(error) {
    res.status(400).end()
  }
}

const validateForm = function(req, res, next) {
  const {old_password, password, confirm} = req.body
  const errors = validation.validatePasswordChange(old_password, password, confirm)

  // return errors if there are any
  if (Object.keys(errors).length !== 0) {
    res.status(400).json({
      success: false,
      message: 'Please fix the following errors',
      errors: errors
    }).end()
  }
  else {
    next()
  }
}

const changePassword = function(req, res, next) {
  const db = req.app.get('db')
  const user_id = req.decoded_token.sub
  const {old_password, password} = req.body

  sql.getPassword(db, user_id)
    .then(user => {
      bcrypt.compare(old_password, user.password, (error, result) => {
        if (error) {
          logError(error)
          return res.status(500).end()
        }
        else if (!result) {
          return res.status(400).json({
            success: false,
            message: 'Old password does not match the one in our records',
            errors: {}
          })
        }
        else {
          bcrypt.genSalt(salt_rounds, (error, salt) => {
            if (error) {
              return res.status(500).end()
            }

            bcrypt.hash(password, salt, (error, hash) => {
              if (error) {
                return done(error)
              }

              sql.changePassword(db, user_id, hash)
                .then(() => {
                  return res.status(200).json({
                    success: true,
                    message: 'Password successfully changed',
                  })
                })
                .catch(e => {
                  logError(e)
                  return res.status(500).end()
                })
            })
          })          
        }
      })
    })
    .catch(error => {
      logError(error)
      return res.status(500).end()
    })
}

router.post('/change-password', [authenticateUser, trimInputs, validateForm, changePassword])

module.exports = router
