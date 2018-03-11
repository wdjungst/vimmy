//TYPES
const CHANGE = 'hero/CHANGE';
const MOVE = 'hero/MOVE'; 
const SPEED_UP = 'hero/SPEED_UP';

//REDUCER
const hero = ( state = { top: 0, left: 0, sprite: 1, facing: null }, action ) => {
  switch (action.type) {
    case CHANGE:
      return {
        ...state,
        ...action.sprite,
      }
    case MOVE:
      return {
        ...state,
        ...action.loc
      }
    case SPEED_UP:
      return {
        ...state,
        ...action.speed,
      }
    default:
      return state
  }
}

//ACTIONS
export const change = (sprite) => {
  return { type: CHANGE, sprite }
}

export const move = (loc) => {
  return { type: MOVE, loc }
}

export const speedUp = (speed) => {
  return { type: SPEED_UP, speed }
}


export default hero;
