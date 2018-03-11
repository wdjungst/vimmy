import { combineReducers } from 'redux';
import hero from './hero';
import powerUp from './powerUp';

const rootReducer = combineReducers({
  hero,
  powerUp,
});

export default rootReducer;
