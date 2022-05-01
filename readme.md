# Flashcards

This study app assists memorization through the use of digital flashcards. Create your own deck, or browse decks submitted by fellow users.  Designed to be responsive, so you can study on your device of choice.

Includes many useful features:

* Anyone can browse and use flashcard decks that have been submitted by other users.
* Sort publicly available decks by criteria such as score.
* Customize your flashcard experience with options such as randomizing the card order.
* Visitors can sign up for an account to create and edit their own flashcard decks.
* Users can choose to have their decks publicly available for anyone to find and use.
* Users can rate decks to promote their favorites.

Made with:

* Javascript using JSX and ES6 syntax
* React, React Router
* Node with Express
* Postgresql

## Installation

Prerequisites
* Clone the repo.
* Install node.js.
* With npm, install yarn.

Postgresql Setup
* Install Postgresql.
* Create a new database name "testdb".
* Run the queries in ./sql/Tables.sql to create the tables in the database.
* Optionally, run the queries in ./sql/InitialData.sql to populate the tables with some test data.
* In ./server, rename secret_sample.json to secret.json.
* Open secret.json and past your postgresql password next to "pgpass".

Installing and running the server
* Open command line in root directory.
* Run `npm install` to install the node_modules.
* Navigate to ./server and run `npm start` to run the server.

Installing and running the client
* Open command line in `./react`.
* Run `yarn install` to install the node_modules.
* Run `npm start` to run the client.
* If it didn't open automatically, go to http://localhost:3000/ in your browser.
