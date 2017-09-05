class Validation {
  static validateDeck(deck) {
    const errors = {}

    // validate title
    if (typeof(deck.title) !== 'string') {
      errors.title = 'Title must be a string'
    }
    else if (!deck.title || deck.title.trim() === '') {
      errors.title = 'Deck must have a title'
    }

    // make sure there are no blank sides in the cards
    const card_errors = {}
    deck.cards.forEach((card, idx) => {
      const card_is_blank = (card.front.trim() === '' || card.back.trim() === '') && !card.delete
      if (card_is_blank) {
        card_errors[idx] = 'Card contains a blank side'
      }
    })
    if (Object.keys(card_errors).length !== 0) {
      errors.cards = card_errors
    }

    return errors
  }

  static validateLogin(email, password) {
    const errors = {}

    // validate email
    if (typeof(email) !== 'string') {
      errors.email = 'Email must be a string'
    }
    else if (!email || email.trim() === '') {
      errors.email = 'Please enter an email'
    }

    // validate password
    if (typeof(password) !== 'string') {
      errors.password = 'Password must be a string'
    }
    else if (!password || password.trim() === '') {
      errors.password = 'Please enter a password'
    }

    return errors
  }

  static validateSignup(name, email, password, confirm) {
    const errors = {}

    // validate name
    if (typeof(name) !== 'string') {
      errors.name = 'User name must be a string'
    }
    else if (!name || name.trim() === '') {
      errors.name ='Please enter a user name'
    }

    // validate email
    // function uses regular expressions to make sure email is valid
    // taken from stack overflow
    const emailIsValid = function(email) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    }

    if (typeof(email) !== 'string') {
      errors.email = 'Email must be a string'
    }
    else if (!email || email.trim() === '') {
      errors.email = 'Please enter an email'
    }
    else if (!emailIsValid(email)) {
      errors.email = 'Please enter a valid email address'
    }

    // validate password
    if (typeof(password) !== 'string') {
      errors.password = 'Password must be a string'
    }
    else if (!password || password.trim() === '') {
      errors.password = 'Please enter a password'
    }
    else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long'
    }

    // validate confirm password
    if (confirm !== password) {
      errors.confirm = 'Confirmed password does not match password'
    }

    return errors;   
  }

  static validatePasswordChange(old_password, password, confirm) {
    const errors = {}

    // validate old password
    if (typeof(old_password) !== 'string') {
      errors.old_password = 'Old Password must be a string'
    }
    else if (!old_password || old_password.trim() === '') {
      errors.old_password = 'Please enter your old password'
    }

    // validate new password
    if (typeof(password) !== 'string') {
      errors.password = 'New Password must be a string'
    }
    else if (!password || password.trim() === '') {
      errors.password = 'Please enter a new password'
    }
    else if (password.length < 6) {
      errors.password = 'You new password must be at least 6 characters long'
    }

    // validate confirm password
    if (confirm !== password) {
      errors.confirm = 'Confirmed password does not match new password'
    }

    return errors
  }
}

module.exports = Validation
