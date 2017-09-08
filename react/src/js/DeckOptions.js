import React, { Component } from 'react'

const Options = ({shuffle, defaultFront, changeDefaultFace}) => (
  <div>
    <h4>Options</h4>
    <ShuffleDisplay 
      shuffle={shuffle}
    />
    <DefaultFace
      defaultFront={defaultFront}
      changeDefaultFace={changeDefaultFace}
    />
  </div>
)

const DefaultFace = ({defaultFront, changeDefaultFace}) => (
  <div>
    <button
      type="button"
      onClick={changeDefaultFace}
    >
      Default Face: {defaultFront ? 'Front' : 'Back'}
    </button>
  </div>
)

class ShuffleDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false
    }
    this.shuffle = this.shuffle.bind(this)
  }

  shuffle() {
    // shuffle deck
    this.props.shuffle();
    
    // activate shuffle message and clear timer if exists
    this.setState((prevState) => {
      return {
        active: true,
        timer: null
      }
    })

    // TODO: guarantee timer is cleared BEFORE new timer is set
    // set timer to deactivate shuffle message
    const timer = setTimeout(() => {
      this.setState({
        active: false,
        timer: null
      })
    }, 1000);

    // keep track of timer
    this.setState({
      timer: timer
    })
  }

  render() {
    return (
      <div>
        <button 
          type="button" 
          onClick={this.shuffle}
        >
          Shuffle Deck
        </button>
        <span
          className={this.state.active ? 'shuffled-show' : 'shuffled-hide'}
        >
          Shuffled
        </span>
      </div>
    ) 
  }
}

export default Options
