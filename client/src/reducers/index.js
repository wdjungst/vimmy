import { combineReducers } from 'redux';
import hero from './hero';
import powerUp from './powerUp';
import powerUpType from './powerUpType'

const rootReducer = combineReducers({
  hero,
  powerUp,
  powerUpType,
});

export default rootReducer;
