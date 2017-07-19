// Some default flashcard decks to use while testing local storage and database
const defaultCards = [
  {
    id: 1,
    title: 'Regular Expressions',
    cards: [
      {
        front: '\\w',
        back: 'word character'
      },
      {
        front: '\\d',
        back: 'digit'
      },
      {
        front: '[ ]',
        back: 'character set: match any character in the set'
      },
    ]
  },
  {
    id: 2,
    title: 'Vim Commands',
    cards: [
      {
        front: 'w',
        back: 'move cursor forward by one word'
      },
      {
        front: 'b',
        back: 'move cursor backward by one word'
      },
      {
        front: 'A',
        back: 'append text to the end of the current line'
      }
    ]
  },
];

const localAPI = {
  key: 'flashcards',

  // returns all flashcard data
  getAll: function() {
    return fetchLocally(this.key)
  },

  // returns only the id and title of the decks
  getList: function() {
    const cards = fetchLocally(this.key);
    return cards.map((deck) => {
      return {
        id: deck.id,
        title: deck.title
      }
    })
  },

  // returns only the deck matching the id
  getDeck: function(id) {
    const cards = fetchLocally(this.key);
    const thisDeck = deck => deck.id === id;
    return cards.find(thisDeck);
  }
}

function fetchLocally(key) {
  const data = localStorage.getItem(key);
  return JSON.parse(data) || [];
}

function storeLocally(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Test to see if local storage is available to use.
function testLocalStorage() {
  const test = 'test';
  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  }
  catch(e) {
    return false;
  }
}

// Fills local storage with default cards.  Used for testing purposes
export function hydrateLocalStorage() {
  localAPI.store('flashcards', defaultCards)
}

export default localAPI;