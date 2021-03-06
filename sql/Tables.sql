/*
 * Flashcard Database
 *
 */

CREATE TABLE users (
  id                SERIAL PRIMARY KEY,
  name              text NOT NULL UNIQUE,
  email             text NOT NULL UNIQUE,
  password          text NOT NULL,
  date_joined       timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE decks (
  id            SERIAL PRIMARY KEY,
  title         text NOT NULL,
  author        integer REFERENCES users ON DELETE CASCADE NOT NULL,
  date_created  timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_updated  timestamp,
  is_public     boolean NOT NULL
);

CREATE TABLE cards (
  id        SERIAL PRIMARY KEY,
  front     text NOT NULL DEFAULT '',
  back      text NOT NULL DEFAULT '',
  placement integer NOT NULL,
  deck_id   integer REFERENCES decks ON DELETE CASCADE NOT NULL
);

CREATE TABLE deck_votes (
  user_id       integer REFERENCES users ON DELETE CASCADE NOT NULL,
  deck_id       integer REFERENCES decks ON DELETE CASCADE NOT NULL,
  vote          smallint NOT NULL,  -- possible values are 1 (upvote), 0 (no vote), -1 (downvote)
  date_voted    timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, deck_id)  -- there can only be 1 vote per user per deck
);

CREATE TABLE saved_decks (
  user_id   integer REFERENCES users ON DELETE CASCADE NOT NULL,
  deck_id   integer REFERENCES decks ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (user_id, deck_id)
);