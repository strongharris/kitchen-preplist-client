import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import rootReducer from '../ducks';

const middlewares = process.env.NODE_ENV === 'development'
  ? [thunk, logger]
  : [thunk];

const configureStore = () => {
  const store = createStore(rootReducer, {}, applyMiddleware(...middlewares))
  store.replaceReducer(rootReducer);
  return store;
}

export default configureStore; 
  