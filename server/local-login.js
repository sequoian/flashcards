const jwt = require('jsonwebtoken');
const PassportLocalStrategy = require('passport-local').Strategy;
const secret = require('./secret.json');
const sql = require('./database')

exports.LoginStrategy = new PassportLocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, 
  // callback
  (req, email, password, done) => {
    const userData = {
      email: email.trim(),
      password: password.trim()
    };

    // find user by email address
    sql.get_user_by_email(req.app.get('db'), userData.email)
      .then(user => {
        // check if passwords match
        // TODO: using hashing
        if (user.password === userData.password) {
          // on success, create token string
          const payload = {
            sub: user.id
          }

          const token = jwt.sign(payload, secret.jwt);
          const data = {
            name: user.name
          };

          return done(null, token, data);
        }
        else {
          const error = new Error('Incorrect email or password')
          return done(error)
        }
      })
      .catch(e => {
        const error = new Error('Incorrect email or password')
        return done(error)
      })
})