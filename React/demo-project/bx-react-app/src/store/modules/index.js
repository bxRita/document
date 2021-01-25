import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';
import user from './user';
import articles from './articles';
import count from './counter';

const rootReducer = history =>
  combineReducers({
    user,
    articles,
    count,
    router: connectRouter(history)
  });

export default rootReducer