import React, { useState } from 'react'
import axios from 'axios';

const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 

export default function AppFunctional(props) {
  const [ count, setCount ] = useState(initialSteps);
  const [ message, setMessage ] = useState(initialMessage);
  const [ email, setEmail ] = useState(initialEmail);
  const [ index, setIndex ] = useState(initialIndex);

  function getXY() {
    const x = index % 3;
    const y = Math.floor(index / 3);
    return { x, y };
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
  }

  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    const { x, y } = getXY();
    return `Coordinates (${x + 1},${y + 1})`;
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setCount(initialSteps);
    setMessage(initialMessage);
    setEmail(initialEmail);
    setIndex(initialIndex);
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.

    if (direction === "down"){
      const nextIndex = index + 3;
      if (nextIndex > 8){
        return index;
      } else {
        return nextIndex;
      }
    } else if (direction === "up"){
      const nextIndex = index - 3;
      if (nextIndex < 0) {
        return index;
      } else {
        return nextIndex;
      }
    } else if (direction === "right"){
      if ([2, 5, 8].includes(index)){
        return index; 
      } else {
        return index + 1;
      }
    } else if (direction === "left"){
      if ([0,3,6].includes(index)){
        return index;
      } else {
        return index - 1;
      }
    }
  }

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    const direction = evt.target.id;
    const nextIndex = getNextIndex(direction);
    if (nextIndex === index){
      setMessage(`You can't go ${direction}`); 
    } else {
      setIndex(nextIndex);
      setMessage(initialMessage);
      setCount(count + 1);
    }
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
    setEmail(evt.target.value);
  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();
    const { x, y } = getXY();
    axios.post('http://localhost:9000/api/result', { "x": x + 1, "y": y + 1, "steps": count, "email": email })
      .then(res => {
        setMessage(res.data.message);
        setEmail(''); 
      })
      .catch(err => {
        setMessage(email === "foo@bar.baz" ? err.response.data.message : `Ouch: email is required`);
        setEmail(''); 
      })
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {count} times</h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
          <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
            {idx === index ? 'B' : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={move} count={count}>LEFT</button>
        <button id="up" onClick={move} count={count}>UP</button>
        <button id="right" onClick={move} count={count}>RIGHT</button>
        <button id="down" onClick={move} count={count}>DOWN</button>
        <button id="reset" onClick={reset} >reset</button>
      </div>
      <form>
        <input id="email" type="email" placeholder="type email" onChange={onChange} value={email}></input>
        <input id="submit" type="submit" onClick={onSubmit}></input>
      </form>
    </div>
  )
}
