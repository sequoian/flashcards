const jwt = require('jsonwebtoken');
const PassportLocalStrategy = require('passport-local').Strategy;
const secret = require('./secret.json');
const sql = require('./database')
const bcrypt = require('bcrypt')
const salt_rounds = 10

/**
 * Passport.js strategies
 */
exports.LoginStrategy = new PassportLocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, password, done) => {
  const db = req.app.get('db')

  sql.userLogin(db, email)
    .then(user => {
      bcrypt.compare(password, user.password, (error, result) => {
        if (error) {
          return done(error)
        }
        
        if (result) {
          const jwt_key = process.env.NODE_ENV === 'production' ? process.env.JWT_KEY : secret.jwt
          const payload = {sub: user.id}
          const token = jwt.sign(payload, jwt_key)
          const data = {name: user.name}
          
          return done(null, token, data)
        }
        else {
          const e = new Error('No Match')
          return done(e)
        }
      }) 
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

  bcrypt.genSalt(salt_rounds, (error, salt) => {
    if (error) {
      return done(error)
    }

    bcrypt.hash(password, salt, (error, hash) => {
      if (error) {
        return done(error)
      }

      sql.addUser(db, name, email, hash)
        .then(() => {
          return done(null)
        })
        .catch(e => {
          return done(e);
        })
    })
  }) 
})