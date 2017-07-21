import React, { Component } from 'react';

class DeckFormContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      title: props.title, 
      cards: props.cards
    }
    this.addCard = this.addCard.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleCardChange = this.handleCardChange.bind(this);
    this.removeCard = this.removeCard.bind(this);
  }

  onSubmit() {
    const {id, title, cards} = this.state;
    this.props.onSubmit(id, title, cards)
  }

  handleTitleChange(event) {
    this.setState({
      title: event.target.value
    });
  }

  handleCardChange(cardID, side, value) {
    this.setState(prevState => {
      const cards = prevState.cards.map(card => {
        if (card.id === cardID) {
          side === 'front' ? card.front = value : card.back = value;
        }
        return card;
      })
      return {
        cards: cards
      }
    })
  }

  addCard() {
    this.setState((prevState) => {
      const newCard = {
        id: Date.now(),
        front: '',
        back: ''
      }
      return {
        cards: prevState.cards.concat(newCard)
      }
    });
  }

  removeCard(id) {
    this.setState((prevState) => {
      const cards = prevState.cards.filter(card => {
        if (card.id !== id) {
          return card;
        }
      })
      return {
        cards: cards
      }
    })
  }
  
  render() {
    return (
      <DeckForm 
        title={this.state.title}
        cards={this.state.cards}
        addCard={this.addCard}
        onSubmit={this.onSubmit}
        handleTitleChange={this.handleTitleChange}
        handleCardChange={this.handleCardChange}
        removeCard={this.removeCard}
      />
    )
  }
}

DeckFormContainer.defaultProps = {
  id: null,
  title: '',
  cards: [{
    id: Date.now(), 
    front: '', 
    back: ''
  }]
}

const DeckForm = ({title, cards, addCard, onSubmit, removeCard, handleTitleChange, handleCardChange}) => (
  <form>
    <input 
      type="text" 
      placeholder="Title" 
      value={title}
      onChange={handleTitleChange} 
    />
    {cards.map((card, idx) => (
      <CardInput
        key={card.id}
        card={card}
        index={idx}
        handleCardChange={handleCardChange}
        removeCard={removeCard}
      />
    ))}
    <button type="button" onClick={addCard}>Add Card</button>
    <button type="button" onClick={onSubmit}>Submit</button>
    <button type="button">Cancel</button>
  </form>
)

const CardInput = ({card, index, handleCardChange, removeCard}) => (
  <div className="card-input">
    <span>{index + 1}</span>
    <input 
      type="text" 
      placeholder="Front" 
      value={card.front} 
      onChange={(e) => handleCardChange(card.id, 'front', e.target.value)}
    />
    <input 
      type="text" 
      placeholder="Back"
      value={card.back}  
      onChange={(e) => handleCardChange(card.id, 'back', e.target.value)} 
    />
    <button type="button" onClick={() => removeCard(card.id)}>remove</button>
  </div>
)

export default DeckFormContainer;
