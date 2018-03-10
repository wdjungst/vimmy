//TYPES
const APPEAR = 'powerUp/ADD'
const EXIT = 'powerUp/REMOVE'

//REDUCER
export default ( state = { show: false }, action ) => {
  switch (action.type) {
    case APPEAR:
      return {
        show: true,
        left: action.left,
        top: action.top,
      }
    case EXIT:
      return { show: false } 
    default:
      return state
  }
}

//ACTIONS
export const placePowerUp = () => {
  return dispatch => {
    const top = genTop();
    const left = genLeft();
    dispatch({ type: APPEAR, top, left })
  }
}

export const removePowerUp = () => {
  return { type: EXIT }
}


//UTILS
const genTop = () => {
  let height = window.innerHeight
  let top = Math.abs(Math.floor(Math.random() * (height - 100)))
  return top
}

const genLeft = () => {
  let width = window.innerWidth
  let left = Math.abs(Math.floor(Math.random() * (width - 100)))
  return left
}


