import React, { Component } from 'react';
import '../css/App.css';
import {Route, Switch} from 'react-router-dom';
import localAPI, {hydrateLocalStorage} from './Model';
import DeckListContainer from './List';
import DeckPageContainer from './Deck';
import NewDeck from './NewDeck';
import EditDeck from './EditDeck';

class App extends Component {
  componentDidMount() {
    // for testing purposes
    if (localAPI.getAll().length < 1) {
      hydrateLocalStorage();
    }

    // test server api
    fetch('/api')
      .then(response => {
        if (!response.ok) {
          throw new Error(`status ${response.status}`);
        }
        return response.json();
      })
      .then(json => {
        console.log(json.message)
      }).catch(e => {
        console.log(e)
      })
  }
  
  render() {
    return (
      <div className='app'>
        <Switch>
          <Route exact path='/' component={DeckListContainer} />
          <Route path='/cards/:id' component={DeckPageContainer} />
          <Route path='/new' component={NewDeck} />
          <Route path='/edit/:id' component={EditDeck} />
        </Switch>
      </div>
    )  
  }
}

export default App;
