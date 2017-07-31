import Login from '../views/Login'
import Followed from '../views/Followed'
import Featured from '../views/Featured'
import Settings from '../views/Settings'

import getMain from '../utils/getMain'
import clearElem from '../utils/clearElem'

const STATES = {
  Login,
  Followed,
  Featured,
  Settings,
}

let currentState

export const getCurrentState = () => currentState

export const go = (state) => {
  const newState = Object.assign({}, currentState, { state })
  currentState = newState
  const $main = getMain()
  clearElem($main)
  STATES[newState.state]()
}

export const updateToken = (token) => {
  const newState = Object.assign({}, currentState, { token })
  currentState = newState
  window.ipcRenderer.send('updateState', currentState)
}

export const updateLimit = (limit) => {
  const newState = Object.assign({}, currentState, { limit })
  currentState = newState
  window.ipcRenderer.send('updateState', currentState)
}

export const updateWidth = (width) => {
  const newState = Object.assign({}, currentState, { width })
  currentState = newState
  window.ipcRenderer.send('updateState', currentState)
}

export const updateHeight = (height) => {
  const newState = Object.assign({}, currentState, { height })
  currentState = newState
  window.ipcRenderer.send('updateState', currentState)
}

export const init = () => {
  window.ipcRenderer.send('stateRequest')

  window.ipcRenderer.on('state', (event, arg) => {
    currentState = arg
    go(currentState.state)
  })
}
