import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import { api_key } from './config'

// CONSTANTS

const APP_LOADED = 'APP_LOADED'
const MOOD_SELECTED = 'MOOD_SELECTED'
const FETCH_GIF = 'FETCH_GIF'
const FETCH_GIF_SUCCESS = 'FETCH_GIF_SUCCESS'
const FETCH_GIF_FAIL = 'FETCH_GIF_FAIL'
const TOGGLE_GIF_SPINNER = 'TOGGLE_GIF_SPINNER'

// ACTIONS

export const appLoaded = () => ({
  type: APP_LOADED
})

export const moodSelected = (mood) => ({
  type: MOOD_SELECTED,
  payload: mood
})

// REDUCERS

const moodReducer = (mood = '😎', action) => {
  if (action.type === MOOD_SELECTED) {
    return action.payload
  }
  return mood
}

const gifReducer = (gif = '', action) => {
  if (action.type === FETCH_GIF_SUCCESS) {
    return action.payload
  }
  return gif
}

const gifSpinnerReducer = (spinner = false, action) => {
  if (action.type === TOGGLE_GIF_SPINNER) {
    return action.payload
  }
  return spinner
}

const rootReducer = combineReducers({
  gif: gifReducer,
  gifSpinner: gifSpinnerReducer,
  currentMood: moodReducer
})

// MIDDLEWARES

const loggerMiddleware = () => next => action => {
  console.log('TYPE: ', action.type)
  console.log('PAYLOAD:', action.payload)
  next(action)
}

const appLoadedMiddleware = ({dispatch, getState}) => next => action => {
  next(action)
  if (action.type === APP_LOADED) {
    dispatch({type: FETCH_GIF, payload: getState().currentMood})
    dispatch({type: TOGGLE_GIF_SPINNER, payload: true})
  }
}

const moodUpdatedMiddleware = ({dispatch, getState}) => next => action => {
  next(action)
  if (action.type === MOOD_SELECTED) {
    dispatch({type: FETCH_GIF, payload: getState().currentMood})
    dispatch({type: TOGGLE_GIF_SPINNER, payload: true})
  }
}

const fetchGifMiddleware = ({dispatch, getState}) => next => action => {
  next(action)
  if (action.type === FETCH_GIF) {
    let mood = action.payload
    let url = `https://api.giphy.com/v1/gifs/random?tag=${mood}&limit=10&api_key=${api_key}`
    fetch(url)
    .then(res => res.json())
    .then(json => {
      if (json.meta.status === 200) {
        dispatch({type: FETCH_GIF_SUCCESS, payload: json.data.image_url})
        dispatch({type: TOGGLE_GIF_SPINNER, payload: false})
      } else {
        dispatch({type: FETCH_GIF_FAIL, payload: json.meta.status})
        dispatch({type: TOGGLE_GIF_SPINNER, payload: false})
      }
    })
    .catch(err => {
      dispatch({type: FETCH_GIF_FAIL, payload: err})
      dispatch({type: TOGGLE_GIF_SPINNER, payload: false})
    })
  }
}

// STORE

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(
      loggerMiddleware,
      appLoadedMiddleware,
      moodUpdatedMiddleware,
      fetchGifMiddleware
    )
  )
)
