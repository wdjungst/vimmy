//TYPES
const DRINK = 'hero/DRINK';

//REDUCER
const hero = ( state = { beers: 0 }, action ) => {
  switch (action.type) {
    case DRINK:
      return {
        ...state,
        beers: action.beers,
      }
    default:
      return state
  }
}

//ACTIONS
export const drink = (beers) => {
  return { type: DRINK, beers }
}

export default hero;
