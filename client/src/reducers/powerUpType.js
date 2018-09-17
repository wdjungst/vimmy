const SET_POWER_UP = 'SET_POWER_UP'

export const setPowerUp = (img) => {
  return { type: SET_POWER_UP, img }
}

export default (state = '', action) => {
  switch(action.type) {
    case SET_POWER_UP:
      return action.img
    default:
      return state
  }
}
