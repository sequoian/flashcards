const chai = require('chai')
const assert = chai.assert
const validation = require('../server/validation')

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

describe('Validation', () => {
  describe('Deck', () => {
    const test_deck = {
      title: 'Test',
      cards: [
        {front: 'card 1 front', back: 'card 1 back', delete: false},
        {front: 'card 2 front', back: 'card 2 back', delete: false},
      ]
    }

    it('should require a title', () => {
      const deck = deepClone(test_deck)
      assert.isEmpty(validation.validateDeck(deck))
      deck.title = ''
      assert.property(validation.validateDeck(deck), 'title')
      deck.title = ' '
      assert.property(validation.validateDeck(deck), 'title')
      deck.title = 1
      assert.property(validation.validateDeck(deck), 'title')
      deck.title = null
      assert.property(validation.validateDeck(deck), 'title')
      delete deck.title
      assert.property(validation.validateDeck(deck), 'title')
    })

    it('should allow no cards', () => {
      const deck = deepClone(test_deck)
      deck.cards = []
      assert.isEmpty(validation.validateDeck(deck))
    })

    it('should allow one card', () => {
      const deck = deepClone(test_deck)
      delete deck.cards[0]
      assert.isEmpty(validation.validateDeck(deck))
    })

    it('should allow multiple cards', () => {
      assert.isEmpty(validation.validateDeck(test_deck))
    })

    it('should not allow blank cards, unless they are to be deleted', () => {
      const deck = deepClone(test_deck)
      deck.cards[0].key = 0
      deck.cards[1].key = 1
      deck.cards[0].front = ''
      assert.nestedProperty(validation.validateDeck(deck), 'cards.0.front')
      deck.cards[0].front = ' '
      assert.nestedProperty(validation.validateDeck(deck), 'cards.0.front')
      deck.cards[1].back = ''
      assert.nestedProperty(validation.validateDeck(deck), 'cards.1.back')
      deck.cards[1].back = ' '
      assert.nestedProperty(validation.validateDeck(deck), 'cards.1.back')
      deck.cards[0].delete = true
      assert.notNestedProperty(validation.validateDeck(deck), 'cards.0')
      deck.cards[1].delete = true
      assert.isEmpty(validation.validateDeck(deck))
    })
  })

  describe('Log In', () => {
    it('should require an email', () => {
      const password = 'test12345'
      let email = ''
      assert.property(validation.validateLogin(email, password), 'email')
      email = ' '
      assert.property(validation.validateLogin(email, password), 'email')
      email = 1
      assert.property(validation.validateLogin(email, password), 'email')
      email = null
      assert.property(validation.validateLogin(email, password), 'email')
      email = 'test@email.com'
      assert.isEmpty(validation.validateLogin(email, password))
    })

    it('should require a password', () => {
      const email = 'test@email.com'
      let password = ''
      assert.property(validation.validateLogin(email, password), 'password')
      password = ' '
      assert.property(validation.validateLogin(email, password), 'password')
      password = 1
      assert.property(validation.validateLogin(email, password), 'password')
      password = null
      assert.property(validation.validateLogin(email, password), 'password')
      password = 'test12345'
      assert.isEmpty(validation.validateLogin(email, password))
    })
  })

  describe('Sign Up', () => {
    const test_name = 'Tester'
    const test_email = 'test@email.com'
    const test_password = 'test12345'
    const test_confirm = 'test12345'

    it('should accept valid inputs', () => {
      assert.isEmpty(validation.validateSignup(test_name, test_email, test_password, test_confirm))
    })

    it('should require a name', () => {
      let name = ''
      assert.property(validation.validateSignup(name, test_email, test_password, test_confirm), 'name')
      name = ' '
      assert.property(validation.validateSignup(name, test_email, test_password, test_confirm), 'name')
      name = 1
      assert.property(validation.validateSignup(name, test_email, test_password, test_confirm), 'name')
      name = null
      assert.property(validation.validateSignup(name, test_email, test_password, test_confirm), 'name')
    })

    it('should require an email', () => {
      let email = ''
      assert.property(validation.validateSignup(test_name, email, test_password, test_confirm), 'email')
      email = ' '
      assert.property(validation.validateSignup(test_name, email, test_password, test_confirm), 'email')
      email = 1
      assert.property(validation.validateSignup(test_name, email, test_password, test_confirm), 'email')
      email = null
      assert.property(validation.validateSignup(test_name, email, test_password, test_confirm), 'email')  
    })

    it('should require a valid email', () => {
      let email = 'test'
      assert.property(validation.validateSignup(test_name, email, test_password, test_confirm), 'email')
      email = 'test@email'
      assert.property(validation.validateSignup(test_name, email, test_password, test_confirm), 'email')
      email = 'test.com'
      assert.property(validation.validateSignup(test_name, email, test_password, test_confirm), 'email')
      email = 'name@domain.net'
      assert.notProperty(validation.validateSignup(test_name, email, test_password, test_confirm), 'email')
    })

    it('should require a password', () => {
      let password = ''
      assert.property(validation.validateSignup(test_name, test_email, password, test_confirm), 'password')
      password = ' '
      assert.property(validation.validateSignup(test_name, test_email, password, test_confirm), 'password')
      password = 1
      assert.property(validation.validateSignup(test_name, test_email, password, test_confirm), 'password')
      password = null
      assert.property(validation.validateSignup(test_name, test_email, password, test_confirm), 'password')
    })

    it('password must match required length', () => {
      let password = '1'
      assert.property(validation.validateSignup(test_name, test_email, password, test_confirm), 'password')
      password = '12345'
      assert.property(validation.validateSignup(test_name, test_email, password, test_confirm), 'password')
      password = '123456'
      assert.notProperty(validation.validateSignup(test_name, test_email, password, test_confirm), 'password')
      password = '1234567'
      assert.notProperty(validation.validateSignup(test_name, test_email, password, test_confirm), 'password')
    })

    it('password confirmation must match password', () => {
      let password = 'test12345'
      let confirm = 'no match'
      assert.property(validation.validateSignup(test_name, test_email, password, confirm), 'confirm')
      password = '1'
      confirm = 1
      assert.property(validation.validateSignup(test_name, test_email, password, confirm), 'confirm')
    })
  })

  describe('Password Change', () => {
    const test_old = 'test12345'
    const test_new = 'secure678'
    const test_confirm = 'secure678'

    it('should accept valid inputs', () => {
      assert.isEmpty(validation.validatePasswordChange(test_old, test_new, test_confirm))
    })

    it('should require old password', () => {
      let old = ''
      assert.property(validation.validatePasswordChange(old, test_new, test_confirm), 'old_password')
      old = ' '
      assert.property(validation.validatePasswordChange(old, test_new, test_confirm), 'old_password')
      old = 1
      assert.property(validation.validatePasswordChange(old, test_new, test_confirm), 'old_password')
      old = null
      assert.property(validation.validatePasswordChange(old, test_new, test_confirm), 'old_password')
    })

    it('should require new password', () => {
      let password = ''
      assert.property(validation.validatePasswordChange(test_old, password, test_confirm), 'password')
      password = ' '
      assert.property(validation.validatePasswordChange(test_old, password, test_confirm), 'password')
      password = 1
      assert.property(validation.validatePasswordChange(test_old, password, test_confirm), 'password')
      password = null
      assert.property(validation.validatePasswordChange(test_old, password, test_confirm), 'password')
    })

    it('new password must match required length', () => {
      let password = '1'
      assert.property(validation.validatePasswordChange(test_old, password, test_confirm), 'password')
      password = '12345'
      assert.property(validation.validatePasswordChange(test_old, password, test_confirm), 'password')
      password = '123456'
      assert.notProperty(validation.validatePasswordChange(test_old, password, test_confirm), 'password')
      password = '1234567'
      assert.notProperty(validation.validatePasswordChange(test_old, password, test_confirm), 'password')
    })

    it('password confirmation must match new password', () => {
      let password = 'test12345'
      let confirm = 'no match'
      assert.property(validation.validatePasswordChange(test_old, password, confirm), 'confirm')
      password = '1'
      confirm = 1
      assert.property(validation.validatePasswordChange(test_old, password, confirm), 'confirm')
    })
  })
})
