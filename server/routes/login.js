const express = require('express')
const router = express.Router()
const passport = require('passport')
const validation = require('../validation')
const logError = require('../log-error')

const trimInputs = function(req, res, next) {
  const {email, password} = req.body
  req.body.email = email.trim()
  req.body.password = password.trim()
  next()
}

const validateForm = function(req, res, next) {
  const {email, password} = req.body
  const errors = validation.validateLogin(email, password)

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

const login = function(req, res, next) {
  return passport.authenticate('local-login', (error, token, userData) => {
    if (error) {
      if (error.name === 'QueryResultError') {
        res.status(400).json({
          success: false,
          message: 'Username or password are incorrect',
          errors: null
        })
      }
      else {
        logError(error)
        return res.status(500).end()
      }
    }
    else {
      return res.status(200).json({
        success: true,
        message: 'You have successfully logged in',
        payload: {
          token: token,
          user: userData.name
        }
      })
    }
  })(req, res, next)
}

router.post('/login', [trimInputs, validateForm, login])

module.exports = router
