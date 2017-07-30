import React, { Component } from 'react';
import {Link} from 'react-router-dom';

class DeckFormContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id || null,
      title: props.title || '', 
      // TODO: make new cards DRY
      cards: props.cards || [{id: null, front: '', back: '', delete: false, key: Date.now()}]
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

  handleCardChange(key, side, value) {
    this.setState(prevState => {
      const cards = prevState.cards.map(card => {
        if (card.key === key) {
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
        id: null,
        front: '',
        back: '',
        delete: false,  // allows app to determine if card should be removed
        key: Date.now()  // unique id for each new card
      }
      return {
        cards: prevState.cards.concat(newCard)
      }
    });
  }

  removeCard(key) {
    this.setState((prevState) => {
      const cards = prevState.cards.map(card => {
        if (card.key === key) {
          card.delete = true;
          return card;
        }
        return card;
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
        cards={this.state.cards.filter(card => card.delete ? null : card)}
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
        key={card.key}
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
      onChange={(e) => handleCardChange(card.key, 'front', e.target.value)}
    />
    <input 
      type="text" 
      placeholder="Back"
      value={card.back}  
      onChange={(e) => handleCardChange(card.key, 'back', e.target.value)} 
    />
    <button type="button" onClick={() => removeCard(card.key)}>remove</button>
  </div>
)

export default DeckFormContainer;
