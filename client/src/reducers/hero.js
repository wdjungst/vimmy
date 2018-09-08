//TYPES
const DRINK = 'hero/DRINK';
const LEVELUP = 'hero/LEVELUP';

//REDUCER
const hero = ( state = { beers: 0, level: 1 }, action ) => {
  switch (action.type) {
    case DRINK:
      return {
        ...state,
        beers: action.beers,
      }
    case LEVELUP:
      return {
        ...state,
        level: state.level + 1
      }
    default:
      return state
  }
}

//ACTIONS
export const drink = (beers) => {
  return { type: DRINK, beers }
}

export const levelUp = () => {
  return { type: LEVELUP }
}

export default hero;
