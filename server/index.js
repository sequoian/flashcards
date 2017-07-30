const express = require('express');
const path = require('path');
const pgp = require('pg-promise')();
const bodyParser = require('body-parser');
const sql = require('./database.js')

const app = express();
const PORT = process.env.PORT || 5000;

// Parse POST data
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// Priority serve any static files.
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, '../react/build')));
}

// Connect to database
const db = sql.connect_to_db()


/** Routes **/

// user deck list
app.get('/api/deck-list', function (req, res) {
  const userID = 1;  // TODO: get user ID from cookie or other method for permission

  sql.get_user_decks(db, userID)
    .then((query) => {
      res.json(query);
    })
    .catch((error) => {
      console.log(error)
    })
})

// deck data
app.get('/api/deck/:deckID', function (req, res) {
  const userID = 1;  // TODO: get user ID from cookie or other method for permission
  const deckID = parseInt(req.params.deckID);

  sql.get_deck(db, userID, deckID)
    .then((query) => {
      res.json(query);
    })
    .catch((error) => {
      console.log(error)
    })
})

// add or edit deck
app.post('/api/deck/:deckID', function (req, res) {
  const userID = 1;  // TODO: get user ID from cookie or other method for permission
  const deckID = parseInt(req.params.deckID);  // TODO: is deck id even needed?

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
    .then(() => {
      res.sendStatus(200);
    })
    .catch(error => {
      console.log(error)
    })
})

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../react/build', 'index.html'));
});

// Listen for incoming requests
app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});
