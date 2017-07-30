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

/*
app.post('/api/deck/:deckID', function (req, res) {
  const deckID = parseInt(req.params.deckID);

  //console.log(req.body)

  db.tx(t => {
    const deck_update = t.none(`
      UPDATE decks SET title = $[title]
      WHERE id = $[id]
      `, req.body); 

    const card_upsert = req.body.cards.map(card => {
      return t.none(`
        INSERT INTO cards (id, deck_id, front, back, placement)
        VALUES ($[id], $[deck_id], $[front], $[back], $[placement])
        ON CONFLICT (id) DO UPDATE SET
          front = EXCLUDED.front,
          back = EXCLUDED.back,
          placement = EXCLUDED.placement
      `, card);
    });

    return t.batch([deck_update, card_upsert])
  })
  res.send('worked')
})
*/

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../react/build', 'index.html'));
});

// Listen for incoming requests
app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});
