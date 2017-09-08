import React from 'react'

const CardPage = ({activeCard, activeCardIndex, showingFront, nextCard, previousCard, flipCard, deckLength}) => (
  <div>
    <CardInfo
      deckLength={deckLength}
      cardIndex={activeCardIndex}
      cardSide={showingFront}
    />
    <CardFace
      face={showingFront ? activeCard.front : activeCard.back}
    />
    <CardControls 
      getNext={nextCard}
      getPrevious={previousCard}
      flipCard={flipCard}
    />
  </div>
)

const CardControls = ({getPrevious, getNext, flipCard}) => (
  <div>
    <button onClick={getPrevious}>Previous</button>
    <button onClick={flipCard}>Flip</button>
    <button onClick={getNext}>Next</button>
  </div>
);

const CardInfo = ({deckLength, cardIndex, cardSide}) => (
  <div>
    <div>{cardIndex + 1}/{deckLength}</div>
    <div>{cardSide ? 'Front' : 'Back'}</div>
  </div>
);

const CardFace = ({face}) => (
  <div className="card">
    {face}
  </div>
);

export default CardPage
