const express = require('express')
const router = express.Router()
const passport = require('passport')
const validation = require('../validation')
const sql = require('../database')
const logError = require('../log-error')


const trimInputs = function(req, res, next) {
  const {name, email, password, confirm} = req.body
  try {
    req.body.name = name.trim()
    req.body.email = email.trim()
    req.body.password = password.trim()
    req.body.confirm = confirm.trim()
    next()
  }
  catch (error) {
    res.status(400).end()
  }
}

const validateForm = function(req, res, next) {
  const {name, email, password, confirm} = req.body

  // check form errors
  let errors = validation.validateSignup(name, email, password, confirm)

  // check name availablity
  const db = req.app.get('db')
  return sql.nameIsAvailable(db, name)
    .then(available => {
      if (!available && !errors.hasOwnProperty('name')) {
        errors.name = 'That name is already taken'
      }
    })
    // check email availability
    .then(() => {
      return sql.emailIsAvailable(db, email)
    })
    .then(available => {
      if (!available && !errors.hasOwnProperty('email')) {
        errors.email = 'That email is already taken'
      }
    })
    .then(() => {
      // respond with errors if there are any
      if (Object.keys(errors).length !== 0) {
        return res.status(400).json({
          success: false,
          message: 'Please fix the following errors',
          errors: errors
        }).end()
      }
      else {
        return next()
      }
    })
    .catch(e => {
      logError(e)
      return res.status(500).end()
    })
}

const signup = function(req, res, next) {
  return passport.authenticate('local-signup', (error) => {
    if (error) {
      logError(error)
      return res.status(500).end()
    }
    return next()
  })(req, res, next)
}

const login = function(req, res, next) {
  return passport.authenticate('local-login', (error, token, userData) => {
    if (error) {
      logError(error)
      return res.status(200).json({
        success: true,
        login: false,
        message: 'You have successfully signed up',
        payload: null
      });
    }
    else {
      return res.status(200).json({
        success: true,
        login: true,
        message: 'You have successfully signed up and logged in',
        payload: {
          token: token,
          user: userData.name
        }
      })
    }
  })(req, res, next)
}

router.post('/signup', [trimInputs, validateForm, signup, login])

module.exports = router
