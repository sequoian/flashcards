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
    `, userID)
}

/**
 * Return deck with associated cards
 * TODO: check if user is the author OR if deck is public
 */
exports.get_deck = function(db, userID, deckID) {
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

/**
 * Merge deck and associated cards
 * Inserts new deck or updates existing deck
 * Inserts, updates, or deletes cards to reflect deck.cards
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

    return deck_command()
      .then(id => {
        if (id) {
          // associate cards with new deck
          deck.cards.forEach(card => {
            card.deck_id = id
          });
        }
        return t.batch(card_commands);
      })
  })
}
