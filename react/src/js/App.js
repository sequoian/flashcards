import React, { Component } from 'react';
import '../css/App.css';
import {Route, Switch, withRouter} from 'react-router-dom';
import DeckListContainer from './List';
import DeckPageContainer from './Deck';
import NewDeck from './NewDeck';
import EditDeck from './EditDeck';
import Auth from './Auth';
import Header from './Header'
import Login from './Login'
import Signup from './Signup'
import UserProfile from './UserProfile'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null
    }
    this.logOut = this.logOut.bind(this);
    this.logIn = this.logIn.bind(this)
  }

  componentDidMount() {
    if (Auth.isUserAuthenticated()) {
      this.logIn()
    }
  }

  logIn() {
    this.getUser()
      .then(user => {
        if (user) {
          this.setState({
            user: user
          })
        }
      })
  }

  getUser() {
    return fetch('/api/user', {
      method: 'GET',
      headers: {
        'Authorization': `bearer ${Auth.getToken()}`
      }
    })
      .then(response => {
        if (response.status > 400) {
          throw new Error(response.status);
        }
        else {
          return response.json()
        }    
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
    this.props.history.replace('/');
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
          <Route 
            path='/login' 
            render={() => <Login loginUser={this.logIn} />} 
          />
          <Route 
            path='/signup' 
            render={() => <Signup loginUser={this.logIn} />} 
          />
          <Route 
            path='/profile' 
            render={() => <UserProfile user={this.state.user} />} />
        </Switch>
      </div>
    )  
  }
}

export default withRouter(App);
