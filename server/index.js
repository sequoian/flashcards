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
const db = sql.connectToDatabase()
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



const signup_routes = require('./routes/signup')
const login_routes = require('./routes/login')
const passchange_routes = require('./routes/passchange')
const deck_routes = require('./routes/deck')
const deck_merge_routes = require('./routes/deck-merge')
const deck_list_routes = require('./routes/deck-list')
app.use('/auth', signup_routes)
app.use('/auth', login_routes)
app.use('/auth', passchange_routes)
app.use('/api', deck_routes)
app.use('/api', deck_merge_routes)
app.use('/api', deck_list_routes)


// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../react/build', 'index.html'));
});

// Listen for incoming requests
app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});
