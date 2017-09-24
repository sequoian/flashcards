const pgp = require('pg-promise')();

exports.connectToDatabase = function() {
  if (process.env.NODE_ENV === 'production') {
    // connect to heroku database
    return pgp(process.env.DATABASE_URL);
  }
  else {
    // connect to local database
    const secret = require('./secret.json');
    const connection = {
      host: 'localhost',
      port: 5432,
      database: 'testdb',
      user: 'postgres',
      password: secret.pgpass
    };
    return pgp(connection);
  }
}

exports.getUserDecks = function(db, user_id) {
  return db.query(`
    SELECT d.id, d.title, u.name AS author FROM 
    decks d INNER JOIN users u ON (d.author = u.id) WHERE d.author = $1
    ORDER BY d.title ASC
  `, user_id)
}

exports.getDeck = function(db, deck_id) {
  return db.tx(t => {
    let result = null
    return t.one(`
      SELECT d.id, d.title, d.date_created, d.last_updated, d.is_public, u.name AS author, d.author AS author_id
      FROM decks d INNER JOIN users u ON (d.author = u.id) WHERE d.id = $1
    `, deck_id)
      .then((deck) => {
        result = deck
        return t.query(`
          SELECT id, front, back FROM cards 
          WHERE deck_id = $1 ORDER BY placement ASC
        `, deck_id)
      })
      .then((cards) => {
        result.cards = cards
        return result
      })
  })
}

exports.deleteDeck = function(db, deck_id) {
  return db.none(`
    DELETE FROM decks WHERE id = $1
  `, deck_id)
}

exports.updateDeck = function(db, deck) {
  return db.tx(t => {
    // update decks table
    return t.none(`
      UPDATE decks SET title = $1, last_updated = CURRENT_TIMESTAMP, is_public = $3
      WHERE id = $2
    `, [deck.title, deck.id, deck.is_public])
      .then(() => {
        // update cards table
        const card_commands = deck.cards.map(card => {
          if (card.delete) {
            return t.none(`
              DELETE FROM cards WHERE id = $[id] AND deck_id = $[deck_id]
            `, card)
          }
          else if (!card.id) {
            return t.none(`
              INSERT INTO cards (front, back, placement, deck_id)
              VALUES ($[front], $[back], $[placement], $[deck_id])
            `, card);
          }
          else {
            return t.none(`
              UPDATE cards SET front = $[front], back = $[back], placement = $[placement]
              WHERE id = $[id] AND deck_id = $[deck_id]
            `, card)
          }
        })

        return t.batch(card_commands)
      })
  })
}

exports.addDeck = function(db, deck, user_id) {
  let deck_id = null
  return db.tx(t => {
    // add deck
    return t.one(`
      INSERT INTO decks (title, author, is_public)
      VALUES ($1, $2, $3) RETURNING id
    `, [deck.title, user_id, deck.is_public])
      .then(result => {   
        deck_id = result.id
        
        // assign cards to new deck
        deck.cards.forEach(card => {
          card.deck_id = deck_id  
        })

        // add cards
        const card_commands = deck.cards.map(card => {
          if (!card.delete) {
            return t.none(`
              INSERT INTO cards (front, back, placement, deck_id)
              VALUES ($[front], $[back], $[placement], $[deck_id])
            `, card)
          }
        })

        return t.batch(card_commands)
      })
      .then(() => {
        // finally, return id of new deck
        return deck_id  
      })
  })
}

exports.addUser = function(db, name, email, password) {
  return db.none(`
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
  `, [name, email, password])
}

exports.userLogin = function(db, email) {
  return db.one(`
    SELECT id, name, password FROM users WHERE email = $1
  `, email)
}

exports.getPassword = function(db, id) {
  return db.one(`
    SELECT password FROM users WHERE id = $1
  `, id)
}

exports.changePassword = function(db, id, new_password) {
  return db.none(`
    UPDATE users SET password = $1 WHERE id = $2
  `, [new_password, id])
}

exports.getUser = function(db, id) {
  return db.one(`
    SELECT id, name, email, date_joined FROM users WHERE id = $1
  `, id)
}

exports.nameIsAvailable = function(db, name) {
  return db.one(`
    SELECT 1 FROM users WHERE name = $1
  `, name)
    .then(success => {
      return false
    })
    .catch(failure => {
      return true
    })
}

exports.emailIsAvailable = function(db, email) {
  return db.one(`
    SELECT 1 FROM users WHERE email = $1
  `, email)
    .then(success => {
      return false
    })
    .catch(failure => {
      return true
    })
}

exports.hasDeckPermission = function(db, user_id, deck_id) {
  return db.one(`
    SELECT 1 FROM decks WHERE id = $1 AND author = $2
  `, [deck_id, user_id])
    .then(success => {
      return true
    })
    .catch(failure => {
      return false
    })
}

exports.getUserPublicDecks = function(db, user_id) {
  return db.query(`
    SELECT d.id, d.title, u.name AS author FROM 
    decks d INNER JOIN users u ON (d.author = u.id) 
    WHERE d.author = $1 AND d.is_public = true
    ORDER BY d.title ASC
  `, user_id)
}

exports.getDeckVotes = function(db, deck_id) {
  return db.query(`
    SELECT vote FROM deck_votes WHERE deck_id = $1
  `, deck_id)
}

exports.getUserVote = function(db, deck_id, user_id) {
  return db.oneOrNone(`
    SELECT vote FROM deck_votes 
    WHERE deck_id = $1 AND user_id = $2 AND vote != 0
  `, [deck_id, user_id])
}

exports.upsertVote = function(db, deck_id, user_id, vote) {
  return db.none(`
    INSERT INTO deck_votes (user_id, deck_id, vote) 
      VALUES ($1, $2, $3)
    ON CONFLICT (user_id, deck_id)
    DO UPDATE SET 
      vote = EXCLUDED.vote, 
      date_voted = CURRENT_TIMESTAMP
  `, [user_id, deck_id, vote])
}

exports.deckIsPublic = function(db, deck_id) {
  return db.one(`
    SELECT is_public FROM decks WHERE id = $1
  `, deck_id)
    .then(deck => {
      if (deck.is_public) {
        return true
      }
      else {
        return false
      }
    })
}

exports.getPublicDecks = function(db, sorting) {
  let order_by
  if (sorting === 'score_desc') order_by = 'ORDER BY score DESC';
  else if (sorting === 'score_asc') order_by = 'ORDER BY score ASC';
  else if (sorting === 'date_desc') order_by = 'ORDER BY d.date_created DESC';
  else order_by = 'ORDER BY d.date_created ASC';

  return db.query(`
    SELECT d.id, 
      d.title, 
      u.name AS author, 
      d.author AS author_id,
      d.date_created,
      (SELECT COALESCE(SUM(vote), 0) FROM deck_votes WHERE deck_id = d.id) AS score
    FROM decks d INNER JOIN users u ON (d.author = u.id) 
    WHERE d.is_public = true ${order_by} 
  `)
}
