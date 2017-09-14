const jwt = require('jsonwebtoken');
const secret = require('./secret.json');
const sql = require('./database')

module.exports = (req, res, next) => {
  // check for token
  if(!req.headers.authorization) {
    return res.status(401).end();
  }

  // verify token is legit
  const token = req.headers.authorization.split(' ')[1];
  const jwt_key = process.env.NODE_ENV === 'production' ? process.env.JWT_KEY : secret.jwt
  jwt.verify(token, jwt_key, (err, decoded) => {
    // check if verification failed
    if (err) {
      return res.status(401).end();
    }

    // check if user exists
    const user_id = decoded.sub;
    const db = req.app.get('db')
    
    sql.getUser(db, user_id)
      .then(success => {
        req.decoded_token = decoded;
        return next();
      })
      .catch(failure => {
        return res.status(401).end();
      })
  })
}
