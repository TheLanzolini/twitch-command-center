import Login from '../views/Login'
import Followed from '../views/Followed'
import getMain from '../utils/getMain'
import clearElem from '../utils/clearElem'

const STATES = {
  Login,
  Followed,
}

const initialState = {
  state: 'Login',
  token: null,
}

let currentState = initialState

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
}

export const init = () => {
  go(initialState.state)
}
