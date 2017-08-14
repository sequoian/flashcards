function hasBlankCard(card) {
  return card.front === '' && card.back === '' && card.delete === false
}

class Validation {
  static validateDeck(deck) {
    const errors = []

    if (deck.title === '') {
      errors.push('Deck must have a title')
    }

    if (deck.cards.find(hasBlankCard)) {
      errors.push('There are blank cards in the deck')
    }

    return errors;
  }

  static validateLogin(email, password) {
    const errors = []

    if (email === '') {
      errors.push('Please enter an email')
    }

    if (password === '') {
      errors.push('Please enter a password')
    }

    return errors;
  }

  static validateSignup(name, email, password, confirm) {
    const errors = []

    if (name === '') {
      errors.push('Please enter a user name')
    }

    if (email === '') {
      errors.push('Please enter an email')
    }

    if (password === '') {
      errors.push('Please enter a password')
    }
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long')
    }

    if (confirm !== password) {
      errors.push('Confirmed password does not match password')
    }

    return errors;   
  }

  static validatePasswordChange(password, confirm) {
    const errors = []

    if (password === '') {
      errors.push('Please enter a password')
    }
    
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long')
    }

    if (confirm !== password) {
      errors.push('Confirmed password does not match password')
    }

    return errors
  }
}

export default Validation
