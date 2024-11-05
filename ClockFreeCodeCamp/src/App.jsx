import { useReducer } from 'react'
import './App.css'

function App() {
  return (
    <div className="App">
      <h1>25+5 Clock</h1>
      <div className='breakDiv'>
      <p id="break-label">Break Length</p>
        <button id="break-decrement">-</button>
        <p id="break-length">5</p>
        <button id="break-increment">+</button>        
      </div>
     <div className="sessionDiv">
     <p id="session-label">Session Length</p>
        <button id="session-decrement">-</button>
        <p id="session-length">25</p>
        <button id="session-increment">+</button>  
     </div>
      <div className="clockDiv">
        <p id="timer-label">Session</p>
        <p id="time-left">25:00</p>
        <button id="start_stop">Start/Stop</button>
        <button id="reset">Reset</button>
      </div>
    </div>
  )
}

export default App

