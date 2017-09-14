const sql = require('./database')
const jwt = require('jsonwebtoken')

// a variation on auth check
module.exports = (req, res, next) => {
  req.decoded_token = {}
  req.decoded_token.sub = null

  let jwt_key
  if (process.env.NODE_ENV === 'production') {
    jwt_key = process.env.JWT_KEY
  }
  else {
    const secret = require('./secret.json');
    jwt_key = secret.jwt
  }

  if(!req.headers.authorization) {
    return next()
  }
  else {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, jwt_key, (err, decoded) => {
      if (err) {
        return next()
      }
  
      const user_id = decoded.sub;
      const db = req.app.get('db')
      
      sql.getUser(db, user_id)
        .then(success => {
          req.decoded_token.sub = decoded.sub;
          return next()
        })
        .catch(failure => {
          return next()
        })
    })
  }
}