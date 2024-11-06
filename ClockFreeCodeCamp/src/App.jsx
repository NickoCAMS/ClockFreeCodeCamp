import { useReducer, useRef, useEffect } from 'react'
import './App.css'
import alarm from './assets/alarm.mp3'

const initialState = {
  breakLength: 5,
  sessionLength: 25,
  timerState: 'stopped',
  timeLeft: 1500,
  timerLabel: 'Session',
  timePaused: false,
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'INCREMENT_BREAK':
      return {
        ...state,
        breakLength: Math.min(state.breakLength + 1, 60),
      }
    case 'DECREMENT_BREAK':
      return {
        ...state,
        breakLength: Math.max(state.breakLength - 1, 1),
      }
    case 'INCREMENT_SESSION':
      return {
        ...state,
        sessionLength: Math.min(state.sessionLength + 1, 60),
        timeLeft: state.sessionLength < 60 ? state.timeLeft + 60 : state.timeLeft,
      }
    case 'DECREMENT_SESSION':
      return {
        ...state,
        sessionLength: Math.max(state.sessionLength - 1, 1),
        timeLeft: state.sessionLength > 1 ? state.timeLeft - 60 : state.timeLeft,
      }
    case 'RESET':
      return initialState
    case 'START':
      return {
        ...state,
        timerState: 'running',
        timeLeft: state.timeLeft,
        timePaused: false,
      }
    case 'STOP':
      return {
        ...state,
        timerState: 'stopped',
        timePaused: true,
      }
    case 'DECREMENT_TIME_LEFT':
      if (state.timeLeft === 0) {
        if (state.timerLabel === 'Session') {
          return {
            ...state,
            timerLabel: 'Break',
            timeLeft: state.breakLength * 60,
          }
        } else {
          return {
            ...state,
            timerLabel: 'Session',
            timeLeft: state.sessionLength * 60,
          }
        }
      }
      return {
        ...state,
        timeLeft: state.timeLeft - 1,
      }
    default:
      return state
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const timerId = useRef(null)
  const audioRef = useRef(null)

  const handleReset = () => {
    dispatch({ type: 'RESET' })
    audioRef.current.pause()
    audioRef.current.currentTime = 0
  }

  const handleBreakDecrement = () => {
    dispatch({ type: 'DECREMENT_BREAK' })
  }

  const handleBreakIncrement = () => {
    dispatch({ type: 'INCREMENT_BREAK' })
  }

  const handleSessionDecrement = () => {
    dispatch({ type: 'DECREMENT_SESSION' })
  }

  const handleSessionIncrement = () => {
    dispatch({ type: 'INCREMENT_SESSION' })
  }

  const handleStartStop = () => {
    if (state.timerState === 'stopped') {
      dispatch({ type: 'START' })
    } else {
      dispatch({ type: 'STOP' })
    }
  }

  const formatTimeLeft = (timeLeft) => {
    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60
    return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`
  }

  useEffect(() => {
    if (state.timerState === 'running') {
      timerId.current = setInterval(() => {
        dispatch({ type: 'DECREMENT_TIME_LEFT' })
      }, 1000)
    } else {
      clearInterval(timerId.current)
    }
    return () => clearInterval(timerId.current)
  }, [state.timerState])

  useEffect(() => {
    if (state.timeLeft === 0) {
      audioRef.current.play()
    }
  }, [state.timeLeft])

  return (
    <div className="App">
      <h1>25+5 Clock</h1>
      <div className='breakDiv'>
      <p id="break-label">Break Length</p>
        <button id="break-decrement" onClick={handleBreakDecrement}>-</button>
        <p id="break-length">{state.breakLength}</p>
        <button id="break-increment" onClick={handleBreakIncrement}>+</button>        
      </div>
     <div className="sessionDiv">
     <p id="session-label">Session Length</p>
        <button id="session-decrement" onClick={handleSessionDecrement}>-</button>
        <p id="session-length">{state.sessionLength}</p>
        <button id="session-increment" onClick={handleSessionIncrement}>+</button>  
     </div>
      <div className="clockDiv">
        <p id="timer-label">{state.timerLabel}</p>
        <p id="time-left">{formatTimeLeft(state.timeLeft)}</p>
        <button id="start_stop" onClick={handleStartStop}>Start/Stop</button>
        <button id="reset" onClick={handleReset}>Reset</button>
      </div>
      <audio id="beep" ref={audioRef} src={alarm}/>
    </div>
  )
}

export default App

