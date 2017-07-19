import React, { Component } from 'react';

class DeckFormContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title, 
      cards: props.cards
    }
    this.addCard = this.addCard.bind(this);
  }

  addCard() {
    this.setState((prevState) => {
      const newCard = {
        front: '',
        back: ''
      }
      return {
        cards: prevState.cards.concat(newCard)
      }
    });
  }
  
  render() {
    return (
      <DeckForm 
        title={this.state.title}
        cards={this.state.cards}
        addCard={this.addCard}
      />
    )
  }
}

DeckFormContainer.defaultProps = {
  title: '',
  cards: [{front: '', back: ''}]
}

const DeckForm = ({title, cards, addCard}) => (
  <form>
    <input type="text" placeholder="Title" defaultValue={title} />
    {cards.map((card, idx) => (
      <CardInput
        key={idx} // does this work?
        card={card}
        index={idx}
      />
    ))}
    <button type="button" onClick={addCard}>Add Card</button>
    <button type="button">Submit</button>
    <button type="button">Cancel</button>
  </form>
)

const CardInput = ({card, index}) => (
  <div className="card-input">
    <span>{index + 1}</span>
    <input type="text" placeholder="Front" defaultValue={card.front} />
    <input type="text" placeholder="Back" defaultValue={card.back} />
  </div>
)

export default DeckFormContainer;