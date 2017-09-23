import React from 'react';
import ReactDOM from 'react-dom';
import App from './js/App';
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter} from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import './css/reset.css';
import './css/App.css'
import './css/Header.css'
import './css/Browse.css'
import './css/Flashcards.css'
import './css/Deck.css'
import './css/Vote.css'
import './css/DeckForm.css'

ReactDOM.render((
  <BrowserRouter>
    <MuiThemeProvider>
      <App />
    </MuiThemeProvider>
  </BrowserRouter>
), document.getElementById('root'));

registerServiceWorker();
