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
  constructor(props) {
    super(props)
    this.state = {
      user: null
    }
    this.logOut = this.logOut.bind(this);
  }

  componentDidMount() {
    if (Auth.isUserAuthenticated()) {
      this.getUser()
      .then(user => {
        if (user) {
          this.setState({
            user: user
          })
        }
      })
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
          this.setState({
            user: json.user.name
          })
        })
        .catch(e => {
          console.log(e);
        })
      }
  }

  getUser() {
    return fetch('/api/user', {
      method: 'GET',
      headers: {
        'Authorization': `bearer ${Auth.getToken()}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`status ${response.status}`);
        }
        return response.json();
      })
      .then(json => {
        return json.user
      })
      .catch(e => {
        return null
      })
  }

  logOut() {
    Auth.deauthenticatedUser();
    this.setState({
      user: null
    })
  }
  
  render() {
    return (
      <div className='app'>
        <Header 
          user={this.state.user}
          logout={this.logOut}
        />
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
