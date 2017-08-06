import React, { Component } from 'react';
import '../css/App.css';
import {Route, Switch} from 'react-router-dom';
import DeckListContainer from './List';
import DeckPageContainer from './Deck';
import NewDeck from './NewDeck';
import EditDeck from './EditDeck';
import Auth from './Auth';
import Header from './Header'

class App extends Component {
  componentDidMount() {
    if (Auth.isUserAuthenticated()) {
      console.log('Authenticated')
    }
    else {
      fetch('/auth/login',
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'placeholderemail',
          password: 'placeholderpassword'
        })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`status ${response.status}`);
          }
          return response.json();
        })
        .then(json => {
          Auth.authenticateUser(json.token)
          console.log('Not authenticated. Token set.')
        })
        .catch(e => {
          console.log(e);
        })
      }
    
  }
  
  render() {
    return (
      <div className='app'>
        <Header />
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
