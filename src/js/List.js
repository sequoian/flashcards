import React, { Component } from 'react';
import localAPI from './Model'
import {Link} from 'react-router-dom';

class DeckListContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      decks: []
    }
  }

  componentDidMount() {
    const decks = localAPI.getList();
    this.setState({
      decks: decks
    });
  }

  render() {
    return (
      <DeckList
        decks={this.state.decks}
      />
    );
  }
}

const DeckList = ({decks}) => (
  <ul className="deck-list">
    {decks.map(deck => (
      <li key={deck.id}>
        <Link to={`/cards/${deck.id}`}>
          {deck.title}
        </Link>
      </li>
      ))}  
  </ul>
);

export default DeckListContainer;