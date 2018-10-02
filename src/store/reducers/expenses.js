import { LOAD_EXPENSES, REMOVE_EXPENSE } from '../actionTypes';

const expense = (state = [], action) => {
  switch(action.type) {
    case LOAD_EXPENSES:
      return [...action.expenses];
    case REMOVE_EXPENSE:
      return state.filter(expense => expense._id !== action.id);
    default:
      return state;
  }
}

export default expense;