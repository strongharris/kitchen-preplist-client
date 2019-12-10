import { combineReducers } from "redux";
import ui from './ui';
import item from './item';

const app = combineReducers({
  ui,
  item,
});

const rootReducer = (state, action) => {
  return app(state, action);
};

export default rootReducer;
