function hasBlankCard(card) {
  return card.front === '' && card.back === '' && card.delete === false
}

export function validateDeck(deck) {
  const errors = []

  if (deck.title === '') {
    errors.push('Deck must have a title')
  }

  if (deck.cards.find(hasBlankCard)) {
    errors.push('There are blank cards in the deck')
  }

  return errors;
}
