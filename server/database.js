const pgp = require('pg-promise')();
const secret = require('./secret.json');

exports.connect_to_db = function() {
  if (process.env.NODE_ENV === 'production') {
    // connect to heroku database
    return pgp(process.env.DATABASE_URL);
  }
  else {
    // connect to local database
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

/**
 * Return list of decks that are associated with the user
 * Gets decks where the user is the author
 * TODO: get decks that the user has saved/favorited
 */
exports.get_user_decks = function(db, userID) {
  return db.query(`
    SELECT d.id, d.title, u.name AS author FROM 
    decks d INNER JOIN users u ON (d.author = u.id) WHERE d.author = $1
    ORDER BY d.id ASC
    `, userID)
}

/**
 * Return deck with associated cards
 * TODO: check if user is the author OR if deck is public
 */
exports.getDeck = function(db, userID, deckID) {
  return db.tx(t => {
    let result = null;
    return t.one(`SELECT id, title FROM decks WHERE id = $1`, deckID)
      .then((deck) => {
        result = deck;
        return db.query(`
          SELECT id, front, back FROM cards 
          WHERE deck_id = $1 ORDER BY placement ASC
        `, deckID)
      })
      .then((cards) => {
        result.cards = cards;
        return result;
      });
  });
}

exports.delete_deck = function(db, deckID) {
  return db.none(`
    DELETE FROM decks WHERE id = $1
  `, deckID)
}

/**
 * Merge deck and associated cards
 * Inserts new deck or updates existing deck
 * Inserts, updates, or deletes cards to reflect deck.cards
 * TODO: separate commands into functions for neatness
 * TODO: if deck is inserted but cards fail, it should roll back and not insert the deck, give user error
 */
exports.merge_deck = function(db, userID, deck) {
  return db.tx(t => {
    // Deck Command
    // TODO: get is_public from deck data
    let deck_command = null;
    if (deck.id === null) {
      deck_command = () => db.one(`
        INSERT INTO decks (title, author, is_public)
        VALUES ($1, $2, $3) RETURNING id
      `, [deck.title, userID, false]) ;
    }
    else {
      deck_command = () => db.none(`
        UPDATE decks SET title = $1, last_updated = CURRENT_TIMESTAMP
        WHERE id = $2
      `, [deck.title, deck.id]);
    }

    let deck_id = deck.id;
    return deck_command()  // merge deck
      .then(id_obj => {
        const id = id_obj ? id_obj.id : null;
        if (id) {
          // associate cards with new deck
          deck.cards.forEach(card => {
            card.deck_id = id;
            deck_id = id;
          });
        }

        // Card Commands
        const card_commands = deck.cards.map(card => {
          if (card.delete) {
            return t.none(`
              DELETE FROM cards WHERE id = $[id] AND deck_id = $[deck_id]
            `, card);
          }
          else if (card.id === null) {
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

        return t.batch(card_commands);  // merge cards
      })
      .then(() => {
        return deck_id;
      })
  })
}

exports.updateDeck = function(db, deck) {
  return db.tx(t => {
    // update decks table
    return t.none(`
      UPDATE decks SET title = $1, last_updated = CURRENT_TIMESTAMP
      WHERE id = $2
    `, [deck.title, deck.id])
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

exports.user_exists = function(db, id) {
  return db.one(`
    SELECT 1 FROM users WHERE id = $1
  `, id)
}

exports.get_user = function(db, id) {
  return db.one(`
    SELECT id, name, email FROM users WHERE id = $1
  `, id)
}

exports.get_user_by_email = function(db, email) {
  return db.one(`
    SELECT id, name, password FROM users WHERE email = $1
  `, email)
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
