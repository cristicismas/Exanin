import { LOAD_INCOMES, REMOVE_INCOME } from '../actionTypes';

const income = (state = [], action) => {
  switch(action.type) {
    case LOAD_INCOMES:
      return [...action.incomes];
    case REMOVE_INCOME:
      return state.filter(income => income._id !== action.id);
    default:
      return state;
  }
}

export default income;