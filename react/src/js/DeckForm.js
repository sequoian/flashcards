import React, { Component } from 'react'
import {BackLinkHistory} from './HistoryLink'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import Checkbox from 'material-ui/Checkbox'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import ArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up'
import ArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down'
import Add from 'material-ui/svg-icons/content/add'
import Remove from 'material-ui/svg-icons/navigation/close'
import {red500} from 'material-ui/styles/colors'
import InfoIcon from 'material-ui/svg-icons/action/info-outline'

class DeckFormContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id || null,
      title: props.title || '', 
      is_public: props.is_public || false,
      cards: props.cards || []
    }
    this.addCard = this.addCard.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleCardChange = this.handleCardChange.bind(this);
    this.handlePublicChange = this.handlePublicChange.bind(this)
    this.removeCard = this.removeCard.bind(this);
    this.moveCard = this.moveCard.bind(this);
  }

  componentDidMount() {
    if (this.props.cards) {
      this.setState(prevState => {
        const cards = prevState.cards.map(card => {
          card.delete = false
          card.key = card.id
          return card
        })
        return {
          cards: cards
        }
      })
    }
    else {
      this.addCard()
    }
  }

  onSubmit() {
    const {id, title, cards, is_public} = this.state;
    this.props.onSubmit(id, title, cards, is_public)
  }

  handleTitleChange(event) {
    this.setState({
      title: event.target.value
    });
  }

  handlePublicChange(event) {
    this.setState({
      is_public: !this.state.is_public
    })
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

  moveCard(key, direction) {
    const cards = this.state.cards.slice()
    const idx = cards.findIndex(card => card.key === key)

    // calculate swap
    let new_idx = null;
    let temp_idx = idx
    if (direction === 'up') {
      while(new_idx === null) {
        temp_idx -= 1
        if (temp_idx <= 0) {
          new_idx = 0
        }
        else if (cards[temp_idx].delete) {
          continue
        }
        else {
          new_idx = temp_idx
        }
      }
    }
    else {
      while(!new_idx) {
        temp_idx += 1
        if (temp_idx >= cards.length - 1) {
          new_idx = cards.length - 1
        }
        else if (cards[temp_idx].delete) {
          continue
        }
        else {
          new_idx = temp_idx
        }
      }
    }

    // swap
    const tmp = cards[new_idx];
    cards[new_idx] = cards[idx];
    cards[idx] = tmp;

    this.setState({
      cards: cards
    });
  }
  
  render() {
    return (
      <DeckForm 
        title={this.state.title}
        is_public={this.state.is_public}
        cards={this.state.cards.filter(card => card.delete ? null : card)}
        addCard={this.addCard}
        onSubmit={this.onSubmit}
        handleTitleChange={this.handleTitleChange}
        handleCardChange={this.handleCardChange}
        removeCard={this.removeCard}
        cancelPath={this.props.cancelPath}
        moveCard={this.moveCard}
        errors={this.props.errors}
        error_msg={this.props.error_msg}
        handlePublicChange={this.handlePublicChange}
      />
    )
  }
}

const DeckForm = ({title, is_public, cards, addCard, onSubmit, removeCard, handleTitleChange, handleCardChange, 
  cancelPath, moveCard, errors, error_msg, handlePublicChange}) => (
  <form>
    <div className="errors">
      {error_msg}
    </div>
    <TextField
      name="title"
      floatingLabelText="Title"
      value={title}
      onChange={handleTitleChange}
      errorText={errors.title}
    />
    <br />
    <div>
      <Checkbox
        label="deck is public"
        name="is-public"
        value={is_public}
        checked={is_public}
        onCheck={handlePublicChange}
      />
      <IconButton 
        tooltip="If your deck is public, other users will be able to discover and use it."
      >
        <InfoIcon />
      </IconButton>
    </div>
    <hr />
    <div>Cards</div>
    {cards.map((card, idx) => (
      <CardInput
        key={card.key}
        card={card}
        index={idx}
        handleCardChange={handleCardChange}
        removeCard={removeCard}
        moveCard={moveCard}
        error={errors.cards ? errors.cards[card.key] : null}
      />
    ))}
    <FlatButton
      label="Add Card"
      onClick={addCard}
      icon={<Add />}
    />
    <br />
    <RaisedButton
      label="Submit"
      onClick={onSubmit}
      primary={true}
    />
    <BackLinkHistory 
      to={cancelPath}
      value="Cancel"  
    />
  </form>
)

const CardInput = ({card, index, handleCardChange, removeCard, moveCard, error}) => (
  <div className="card-input">
    <div className="errors">
      {error}
    </div>
    <IconButton 
      onClick={() => moveCard(card.key, 'up')}
    >
      <ArrowUp />
    </IconButton>
    <span>{index + 1}</span>
    <IconButton 
      onClick={() => moveCard(card.key, 'down')}
    >
      <ArrowDown />
    </IconButton>
    
    <TextField
      hintText="Front"
      value={card.front}
      onChange={(e) => handleCardChange(card.key, 'front', e.target.value)}
    />
    <TextField
      hintText="Back"
      value={card.back}
      onChange={(e) => handleCardChange(card.key, 'back', e.target.value)}
    />
    <IconButton 
      onClick={() => removeCard(card.key)}
    >
      <Remove color={red500} />
    </IconButton>
  </div>
)

export default DeckFormContainer;
