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
app.get('/api', function (req, res) {
  res.set('Content-Type', 'application/json');
  res.send('{"message":"Hello from the custom server!"}');
});

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../react/build', 'index.html'));
});

app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});