import React, { Component } from 'react';
import '../css/App.css';
import {Route, Link, Switch} from 'react-router-dom';
import localAPI, {hydrateLocalStorage} from './Model';
import DeckListContainer from './List';
import DeckPageContainer from './Deck';
import DeckForm from './New'

class App extends Component {
  componentDidMount() {
    // for testing purposes
    if (localAPI.getAll().length < 1) {
      hydrateLocalStorage();
    }
  }
  
  render() {
    return (
      <div>
        <Switch>
          <Route exact path='/' component={DeckListContainer} />
          <Route path='/cards/:id' component={DeckPageContainer} />
          <Route path='/new' component={DeckForm} />
        </Switch>
      </div>
    )  
  }
}

export default App;
