import React, { Component } from 'react';
import {Link} from 'react-router-dom';

const DeckForm = () => (
  <form>
    <h1> New Deck </h1>
    <input type="text" placeholder="Name" />
    <CardInput />
    <button>Submit</button>
    <button>Cancel</button>
  </form>
)

const CardInput = () => (
  <div className="card-input">
    <input type="text" placeholder="Front" />
    <input type="text" placeholder="Back" />
  </div>
)

export default DeckForm;