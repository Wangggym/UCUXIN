/**
 * Created by QiHan Wang on 2017/6/7.
 */
import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducer from './redux/reducers';

const middlewares = [thunkMiddleware];
if (process.env.NODE_ENV === `development`) {
  const {logger} = require(`redux-logger`);
  middlewares.push(logger);
}
const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);

export default function configureStore(initialState) {
  return createStoreWithMiddleware(reducer, initialState);
}
