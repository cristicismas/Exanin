import { apiCall } from '../../services/api';
import { addError } from './errors';
import { LOAD_INCOMES, REMOVE_INCOME } from '../actionTypes';

export const loadIncomes = incomes => ({
  type: LOAD_INCOMES,
  incomes
});

export const removeAt = id => ({
  type: REMOVE_INCOME,
  id
});

export const removeIncome = (id, income_id) => {
  return dispatch => {
    return apiCall('delete', `api/users/${id}/incomes/${income_id}`)
      .then(res => {
        dispatch(removeAt(income_id));
        dispatch(loadIncomes(res));
      })
      .catch(err => {
        dispatch(addError(err.message))
      });
  }
}

export const fetchIncomes = id => {
  return dispatch => {
    return apiCall('get', `api/users/${id}/incomes`)
      .then(res => {
        dispatch(loadIncomes(res));
      })
      .catch(err => {
        dispatch(addError(err.message));
      });
  }
}

export const newIncome = (collection_id, income) => (dispatch, getState) => {
  const { currentUser } = getState();
  const id = currentUser.user.id;

  return apiCall('post', `api/users/${id}/incomes/${collection_id}`, income)
    .then(res => {
      dispatch(loadIncomes(res));
    })
    .catch(err => {
      dispatch(addError(err.message));
    });
}

export const updateIncome = (collection_id, income_id, income) => (dispatch, getState) => {
  const { currentUser } = getState();
  const id = currentUser.user.id;

  const newIncome = {
    ...income,
    _collection: collection_id
  };

  return apiCall('put', `api/users/${id}/incomes/${income_id}`, newIncome)
    .then(res => {
      dispatch(loadIncomes(res));
    })
    .catch(err => {
      dispatch(addError(err.message));
    });
}