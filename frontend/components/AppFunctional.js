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
  }

  function getXYMessage() {
    const { x, y } = getXY();
    return `Coordinates (${x + 1},${y + 1})`;
  }

  function reset() {
    setCount(initialSteps);
    setMessage(initialMessage);
    setEmail(initialEmail);
    setIndex(initialIndex);
  }

  function getNextIndex(direction) {
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
    setEmail(evt.target.value);
  }

  function onSubmit(evt) {
    evt.preventDefault();
    const { x, y } = getXY();
    axios.post('http://localhost:9000/api/result', { "x": x + 1, "y": y + 1, "steps": count, "email": email })
      .then(res => {
        setMessage(res.data.message);
        setEmail(''); 
      })
      .catch(err => {
        setMessage(email === "foo@bar.baz".trim() ? err.response.data.message : (!email ? `Ouch: email is required` : `Ouch: email must be a valid email`));
        setEmail(''); 
      })
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {count} {count === 1 ? 'time' : 'times'}</h3>
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
