const express = require('express')
const router = express.Router()
const authenticateUser = require('../auth-check')
const validation = require('../validation')
const sql = require('../database')
const logError = require('../log-error')

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
  
  sql.changePassword(db, user_id, old_password, password) 
    .then(result => {
      if (result.rowCount > 0) {
        res.status(200).json({
          success: true,
          message: 'Password successfully changed',
        })
      }
      else {
        // if no rows were changed, the update query did not match a user
        // assume it was the old password at fault
        res.status(400).json({
          success: false,
          message: 'Old password does not match the one in our records',
          errors: {}
        })
      }
    })
    .catch(e => {
      logError(e)
      res.status(500).end()
    })
}

router.post('/change-password', [authenticateUser, trimInputs, validateForm, changePassword])

module.exports = router
