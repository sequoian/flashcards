import React, { Component } from 'react';
import {Link} from 'react-router-dom';

class DeckFormContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id || null,
      title: props.title || '', 
      cards: props.cards || [{id: Date.now(), front: '', back: ''}]
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
        return null;
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
        cancelPath={this.props.cancelPath}
        validation={this.props.validation}
      />
    )
  }
}

const DeckForm = ({title, cards, addCard, onSubmit, removeCard, handleTitleChange, handleCardChange, cancelPath, validation}) => (
  <form>
    {validation.length > 0 ? <ValidationErrors validation={validation} /> : null }
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
    <button 
      type="button" 
      onClick={addCard}
      className='cardBtn'>
      Add Card
    </button>
    <button 
      type="button" 
      onClick={onSubmit}
    >Submit
    </button>
    <Link to={cancelPath}>Cancel</Link>
  </form>
)

const ValidationErrors = ({validation}) => (
  <div className='errors'>
    <div>Errors</div>
    <ul>
      {validation.map((msg, idx) => (
        <li key={idx}>{msg}</li>
      ))}
    </ul>
  </div>
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
