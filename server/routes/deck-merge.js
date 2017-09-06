const express = require('express')
const router = express.Router()
const authenticateUser = require('../auth-check')
const validation = require('../validation')
const sql = require('../database')
const logError = require('../log-error')

const trimInputs = function(req, res, next) {
  try {
    req.body.deck.title = req.body.deck.title.trim()

    req.body.deck.cards.forEach(card => {
      card.front = card.front.trim()
      card.back = card.back.trim()
    })

    next()
  }
  catch(error) {
    res.status(400).end()
  }
}

const validateForm = function(req, res, next) {
  const errors = validation.validateDeck(req.body.deck)

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

const checkPermission = function(req, res, next) {
  const db = req.app.get('db')
  const user_id = req.decoded_token.sub
  const deck = req.body.deck

  if (deck.id) {
    sql.hasDeckPermission(db, user_id, deck.id)
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
  else {
    res.status(400).end()
  }
}

const finalizeCards = function(req, res, next) {
  const deck = req.body.deck
  deck.cards.forEach((card, idx) => {
    card.placement = idx
    card.deck_id = deck.id
  })
  next()
}

const updateDeck = function(req, res, next) {
  const db = req.app.get('db')
  const deck = req.body.deck

  sql.updateDeck(db, deck)
    .then(() => {
      res.status(200).json({
        success: true,
        message: 'Deck successfully updated',
        id: deck.id
      })
    })
    .catch(e => {
      logError(e)
      res.status(500).end()
    })
}

const createDeck = function(req, res, next) {
  const db = req.app.get('db')
  const user_id = req.decoded_token.sub
  const deck = req.body.deck

  sql.addDeck(db, deck, user_id)
    .then(id => {
      res.status(200).json({
        success: true,
        message: 'Deck successfully added',
        id: id
      })
    })
    .catch(e => {
      logError(e)
      res.status(500).end()
    })
}

router.post('/update-deck', [authenticateUser, trimInputs, validateForm, 
  checkPermission, finalizeCards, updateDeck
])

router.post('/add-deck', [authenticateUser, trimInputs, validateForm, 
  finalizeCards, createDeck
])

module.exports = router
