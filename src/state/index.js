import Login from '../views/Login'

const STATES = {
  Login,
}

const initialState = {
  state: 'Login',
}

const currentState = initialState

export const go = (state) => {
  const newState = Object.assign({}, currentState, { state })
  console.log(newState)
  STATES[newState.state]()
}

export const init = () => {
  go(initialState.state)
}
