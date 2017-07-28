const express = require('express');
const path = require('path');
const pgp = require('pg-promise')();

const app = express();
const PORT = process.env.PORT || 5000;

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../react/build')));

// Connect to database
let db = null;

if (process.env.NODE_ENV === 'production') {
  db = pgp(process.env.DATABASE_URL)
}
else {
  const secret = require('./secret.json');
  const connection = {
    host: 'localhost',
    port: 5432,
    database: 'testdb',
    user: 'postgres',
    password: secret.pgpass
  }
  db = pgp(connection)
}

// Answer API requests.
// test
app.get('/api', function (req, res) {
  res.set('Content-Type', 'application/json');
  res.send('{"message":"Hello from the custom server!"}');
});

// deck list
app.get('/api/deck-list', function (req, res) {
  const userID = 1;  // TODO: get user ID from cookie or other method

  db.query(`SELECT d.id, d.title, u.name AS author FROM 
    decks d INNER JOIN users u ON (d.author = u.id) WHERE d.author = $1`, userID)
  .then((data) => {
    res.json(data);
  })
  .catch((error) => {
    console.log(error)
  })
})

// deck data
app.get('/api/deck/:deckID', function (req, res) {
  const deckID = parseInt(req.params.deckID);
  let result = null;
  db.one(`SELECT id, title FROM decks WHERE id = $1`, deckID)
    .then((data) => {
      result = data;
      return db.query(`SELECT * FROM cards WHERE deck_id = $1`, deckID)
    })
    .then((data) => {
      result.cards = data;
      res.json(result);
    })
    .catch((error) => {
      console.log(error)
    })
})

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../react/build', 'index.html'));
});

app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});