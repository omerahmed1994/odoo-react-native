import {applyMiddleware, createStore, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import {createLogger} from 'redux-logger';
import {reducer as formReducer} from 'redux-form';
import reducer from './config/redux-api-handler/reducer';
import {reduxAPIHandler} from './config/redux-api-handler';
import APIendpoints from './API/endpoints';

const logger = [];

if (process.env.NODE_ENV === 'development') {
  logger.push(createLogger());
}

const middleware = applyMiddleware(
  reduxAPIHandler(APIendpoints),
  thunk,
  ...logger,
);

/*
  Root Reducer for redux
 */
const rootReducer = combineReducers({
  form: formReducer,
  api: reducer,
});

const store = createStore(rootReducer, middleware);

export default store;
