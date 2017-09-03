const express = require('express');
const path = require('path');
const pgp = require('pg-promise')();
const bodyParser = require('body-parser');
const sql = require('./database.js');
const passport = require('passport');
const passportStrategies = require('./passport-strats');
const authenticateUser = require('./auth-check')
const validation = require('./validation')
const app = express();
const PORT = process.env.PORT || 5000;


function logError(error) {
  console.log(error)
}

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
  // TODO: validate form
  // TODO: make sure current password matches
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

/**
 * Sign Up
 */
app.post('/auth/signup',(req, res, next) => {
  // Trim inputs
  let {name, email, password, confirm} = req.body
  req.body.name = name.trim()
  req.body.email = email.trim()
  req.body.password = password.trim()
  req.body.confirm = confirm.trim()
  next()
}, (req, res, next) => {
  // Validate
  const {name, email, password, confirm} = req.body

  // check form errors
  let errors = validation.validateSignup(name, email, password, confirm)

  // check name availablity
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
}, (req, res, next) => {
  // Register new user
  return passport.authenticate('local-signup', (error) => {
    if (error) {
      logError(error)
      return res.status(500).end()
    }
    return next()
  })(req, res, next)
}, (req, res, next) => {
  // Log in new user
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
})

/**
 * Log In
 */
app.post('/auth/login', (req, res, next) => {
  // TODO: Validate form inputs

  return passport.authenticate('local-login', (err, token, userData) => {
    // if (err) {
    //   return res.status(200).json({
    //     success: true,
    //     login: false,
    //     message: 'You have successfully signed up',
    //     payload: null
    //   });
    // }

    // return res.json({
    //   success: true,
    //   login: true,
    //   message: 'You have successfully signed up and logged in',
    //   payload: {
    //     token: token,
    //     user: userData.name
    //   }
    // })
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


sql.nameIsAvailable(db, 'zach '.trim())
  .then(result => {
    console.log('name is ' + result)
  })
  .then(() => {
    return sql.emailIsAvailable(db, 'zach303@msn.com')
  })
  .then(result => {
    console.log('email is ' + result)
  })
