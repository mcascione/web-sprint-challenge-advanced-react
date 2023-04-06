import React from 'react'
import axios from 'axios';

const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
}

export default class AppClass extends React.Component {
  constructor (){
    super();
    this.state = {
      ...initialState
    }
    this.setMessage = (message) => {
      this.setState( {...this.state, message: message} )
    }
  
    this.setEmail = (email) => {
      this.setState( {...this.state, email: email} )
    }
  
    this.setCount = (steps) => {
      this.setState( {...this.state, steps: steps} )
    }
  
    this.setIndex = (index) => {
      this.setState( {...this.state, index: index} )
    }
  }

  

  getXY = () => {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    const { index } = this.state;
    const x = index % 3;
    const y = Math.floor(index / 3);
    return { x, y };
  }

  getXYMessage = () => {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    const { x, y } = this.getXY();
    return `Coordinates (${x + 1}, ${y + 1})`;
  }

  reset = () => {
    // Use this helper to reset all states to their initial values.
    this.setState({...initialState, 
      steps: 0
    });
  }

  getNextIndex = (direction) => {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.

    if (direction === 'down'){
      const nextIndex = this.state.index + 3;
      if (nextIndex > 8){
        return this.state.index;
      } else {
        return nextIndex;
      }
    } else if (direction === 'up'){
      const nextIndex = this.state.index - 3;
      if (nextIndex < 0){
        return this.state.index;
      } else {
        return nextIndex;
      }
    } else if (direction === 'right'){
      if ([2,5,8].includes(this.state.index)){
        return this.state.index;
      } else {
        return this.state.index + 1;
      }
    } else if (direction === 'left'){
      if ([0,3,6].includes(this.state.index)){
        return this.state.index;
      } else {
        return this.state.index - 1;
      }
    }
  }

  move = (evt) => {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    const direction = evt.target.id;
    const nextIndex = this.getNextIndex(direction);
    if (nextIndex === this.state.index){
      this.setState({ ...this.state, message:`You can't go ${direction}`});
    } else {
      this.setState(prevState => ({
        index: nextIndex,
        message: initialMessage,
        steps: prevState.steps + 1
      }));
    }
  }

  onChange = (evt) => {
    // You will need this to update the value of the input.
    this.setState({ ...this.state, email: evt.target.value});
  }

  onSubmit = (evt) => {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();
    const { x, y } = this.getXY();
    axios.post('http://localhost:9000/api/result',  { "x": x + 1, "y": y + 1, "steps": this.state.steps, "email": this.state.email })
      .then(res => {
        this.setMessage(res.data.message)
        this.setState({email: ''});
      })
      .catch(err => {
        this.setMessage(this.state.email === 'foo@bar.baz' ? err.response.data.message : `Ouch: email is required`);
        this.setState({email: ''});
      })
  }

  render() {
    const { className } = this.props

    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
          <h3 id="steps">You moved {this.state.steps} times</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.state.index ? ' active' : ''}`}>
                {idx === this.state.index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={this.move}>LEFT</button>
          <button id="up" onClick={this.move}>UP</button>
          <button id="right" onClick={this.move}>RIGHT</button>
          <button id="down" onClick={this.move}>DOWN</button>
          <button id="reset" onClick={this.reset}>reset</button>
        </div>
        <form>
          <input id="email" type="email" placeholder="type email" onChange={this.onChange} value={this.state.email}></input>
          <input id="submit" type="submit" onClick={this.onSubmit}></input>
        </form>
      </div>
    )
  }
}
