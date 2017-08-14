const express = require('express');
const path = require('path');
const pgp = require('pg-promise')();
const bodyParser = require('body-parser');
const sql = require('./database.js');
const passport = require('passport');
const passportStrategies = require('./passport-strats');
const authenticateUser = require('./auth-check')
const app = express();
const PORT = process.env.PORT || 5000;

// Parse POST data
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// user auth initialization
app.use(passport.initialize());
const localLoginStrategy = passportStrategies.LoginStrategy;
passport.use('local-login', localLoginStrategy);
const localSignupStrategy = passportStrategies.SignupStrategy;
passport.use('local-signup', localSignupStrategy);

// Priority serve any static files.
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, '../react/build')));
}

// Connect to database
const db = sql.connect_to_db()
// Make database available to middleware
app.set('db', db);


/** Routes **/

// user name
app.get('/api/user', [authenticateUser, function (req, res) {
  const userID = req.decoded_token.sub;
  sql.get_user(db, userID)
    .then(user => {
      return res.json({
        success: true,
        user: {
          name: user.name,
          id: user.id,
          email: user.email
        }
      })
    })
    .catch(e => {
      return res.status(401).end();
    })
}])

app.post('/api/change-password', [authenticateUser, function (req, res) {
  const userID = req.decoded_token.sub;
  const newPass = req.body.password
  sql.change_password(db, newPass, userID)
    .then(() => {
      res.sendStatus(200)
    })
    .catch(e => {
      console.log(e)
    })
}])

// user deck list
app.get('/api/deck-list', [authenticateUser, function (req, res) {
  const userID = req.decoded_token.sub;
  sql.get_user_decks(db, userID)
    .then((query) => {
      res.json(query);
    })
    .catch((error) => {
      console.log(error)
    })
}])

// deck data
app.route('/api/deck/:deckID')
.all(authenticateUser)
.get(function (req, res) {
  const userID = req.decoded_token.sub;
  const deckID = parseInt(req.params.deckID);

  sql.get_deck(db, userID, deckID)
    .then((query) => {
      res.json(query);
    })
    .catch((error) => {
      console.log(error)
    })
})
.delete(function (req, res) {
  const userID = req.decoded_token.sub;
  const deckID = parseInt(req.params.deckID);
  // TODO: check that user is author of deck

  sql.delete_deck(db, deckID)
    .then(() => {
      res.sendStatus(200);
    })
    .catch(error => {
      console.log(error);
    })
})

// add or edit deck
app.post('/api/deck', [authenticateUser, function (req, res) {
  const userID = req.decoded_token.sub;

  // Validation
  // TODO: validate that user is author of deck
  // TODO: double check frontend validation (keep DRY)
  const deck = req.body;

  // calculate card placement and deck id's
  deck.cards.forEach((card, idx) => {
    card.placement = idx;
    card.deck_id = deck.id;
  })

  sql.merge_deck(db, userID, deck)
    .then((data) => {
      res.json({deck_id: data});
    })
    .catch(error => {
      console.log(error)
    })
}])

// Signup
app.post('/auth/signup', (req, res, next) => {
  // TODO: validate form inputs

  // TODO: id not used?
  return passport.authenticate('local-signup', (err, id) => {
    if (err) {
      let message
      if (err.code === '23505') {
        message = 'That username or email already exists'
      }
      else {
        message = 'Failed to add user'
      }
      return res.status(400).json({
        success: false,
        message: message
      })
    }

    // TODO: can i just redirect to login auth instead?
    return passport.authenticate('local-login', (err, token, userData) => {
      if (err) {
        console.log(err)
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      return res.json({
        success: true,
        message: 'You have successfully signed up and logged in',
        token: token
      })
    })(req, res, next)
  })(req, res, next)
})

// Login
app.post('/auth/login', (req, res, next) => {
  // TODO: Validate form inputs

  return passport.authenticate('local-login', (err, token, userData) => {
    if (err) {
      console.log(err)
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    return res.json({
      success: true,
      message: 'You have successfully logged in',
      token,
      user: userData
    })
  })(req, res, next)
})

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../react/build', 'index.html'));
});

// Listen for incoming requests
app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});
