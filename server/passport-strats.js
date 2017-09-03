const jwt = require('jsonwebtoken');
const PassportLocalStrategy = require('passport-local').Strategy;
const secret = require('./secret.json');
const sql = require('./database')

/**
 * Passport.js strategies
 */
exports.LoginStrategy = new PassportLocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, password, done) => {
  const db = req.app.get('db')

  sql.userLogin(db, email, password)
    .then(user => {
      const payload = {sub: user.id}
      const token = jwt.sign(payload, secret.jwt)
      const data = {name: user.name}
      
      return done(null, token, data)
    })
    .catch(e => {
      return done(e)
    })
})

exports.SignupStrategy = new PassportLocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, (req, email, password, done) => {
  const name = req.body.name
  const db = req.app.get('db')

  sql.addUser(db, name, email, password)
    .then(() => {
      return done(null)
    })
    .catch(e => {
      return done(e);
    })
})