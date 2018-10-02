import { combineReducers } from 'redux';
import currentUser from './currentUser';
import errors from './errors';
import collectionsData from './collections';
import expenses from './expenses';
import incomes from './incomes';

const appReducer = combineReducers({
  currentUser,
  errors,
  collectionsData,
  expenses,
  incomes
});

const rootReducer = (state, action) => {
  if (action.type === 'USER_LOGOUT') {
    state = undefined;
  }

  return appReducer(state, action);
}

export default rootReducer;