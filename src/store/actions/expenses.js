import { apiCall } from '../../services/api';
import { addError } from './errors';
import { LOAD_EXPENSES, REMOVE_EXPENSE } from '../actionTypes';

export const loadExpenses = expenses => ({
  type: LOAD_EXPENSES,
  expenses
});

export const removeAt = id => ({
  type: REMOVE_EXPENSE,
  id
});

export const removeExpense = (id, expense_id) => {
  return dispatch => {
    return apiCall('delete', `api/users/${id}/expenses/${expense_id}`)
      .then(res => {
        dispatch(removeAt(expense_id));
        dispatch(loadExpenses(res));
      })
      .catch(err => {
        dispatch(addError(err.message))
      });
  }
}

export const fetchExpenses = id => {
  return dispatch => {
    return apiCall('get', `api/users/${id}/expenses`)
      .then(res => {
        dispatch(loadExpenses(res));
      })
      .catch(err => {
        dispatch(addError(err.message));
      });
  }
}

export const newExpense = (collection_id, expense) => (dispatch, getState) => {
  const { currentUser } = getState();
  const id = currentUser.user.id;

  return apiCall('post', `api/users/${id}/expenses/${collection_id}`, expense)
    .then(res => {
      dispatch(loadExpenses(res));
    })
    .catch(err => {
      dispatch(addError(err.message));
    });
}

export const updateExpense = (collection_id, expense_id, expense) => (dispatch, getState) => {
  const { currentUser } = getState();
  const id = currentUser.user.id;

  const newExpense = {
    ...expense,
    _collection: collection_id
  };

  return apiCall('put', `api/users/${id}/expenses/${expense_id}`, newExpense)
    .then(res => {
      dispatch(loadExpenses(res));
    })
    .catch(err => {
      dispatch(addError(err.message));
    });
}