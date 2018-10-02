import { apiCall } from '../../services/api';
import { addError } from './errors';
import { LOAD_COLLECTIONS, LOAD_COLLECTIONS_CHART_DATA, LOAD_COLLECTIONS_AND_VALUES, LOAD_COLLECTIONS_AND_VALUES_FOR_MONTH, REMOVE_COLLECTION } from '../actionTypes';

export const loadCollections = collections => ({
  type: LOAD_COLLECTIONS,
  collections
});

export const loadCollectionsChartData = data => ({
  type: LOAD_COLLECTIONS_CHART_DATA,
  data
});

export const loadCollectionsAndValues = collectionsAndValues => ({
  type: LOAD_COLLECTIONS_AND_VALUES,
  collectionsAndValues
});

export const loadCollectionsAndValuesForMonth = collectionsAndValuesForMonth => ({
  type: LOAD_COLLECTIONS_AND_VALUES_FOR_MONTH,
  collectionsAndValuesForMonth
});

export const removeAt = id => ({
  type: REMOVE_COLLECTION,
  id
});

export const removeCollection = collectionId => (dispatch, getState) => {
  const { currentUser } = getState();
  const userId = currentUser.user.id;

  return apiCall('delete', `api/users/${userId}/collections/${collectionId}`)
    .then(res => {
      dispatch(removeAt(collectionId));
      dispatch(loadCollections(res));
    })
    .catch(err => dispatch(addError(err.message)));
};

export const fetchCollections = user_id => dispatch => {
  return apiCall('get', `api/users/${user_id}/collections`)
    .then(res => {
      dispatch(loadCollections(res));
    })
    .catch(err => {
      dispatch(addError(err.message));
    });
}

export const fetchCollectionsChartData = (user_id, chart_type) => dispatch => {
  return apiCall('get', `api/users/${user_id}/collections/collections_chart/${chart_type}`)
    .then(res => {
      dispatch(loadCollectionsChartData(res));
    })
    .catch(err => {
      dispatch(addError(err.message));
    });
}

export const fetchCollectionsAndValues = user_id => dispatch => {
  return apiCall('get', `api/users/${user_id}/collections/collections_and_values`)
    .then(res => {
      dispatch(loadCollectionsAndValues(res));
    })
    .catch(err => {
      dispatch(addError(err.message));
    });
}

export const fetchCollectionsAndValuesForMonth = (user_id, monthIndex) => dispatch => {
  // Need to add 1 to the month to it wouldn't be 0 indexed anymore (to match the database date).
  monthIndex += 1;

  return apiCall('get', `api/users/${user_id}/collections/collections_and_values/${monthIndex}`)
    .then(res => {
      dispatch(loadCollectionsAndValuesForMonth(res));
    })
    .catch(err => {
      dispatch(addError(err.message));
    });
}

export const newCollection = collection => (dispatch, getState) => {
  let { currentUser } = getState();
  const id = currentUser.user.id;

  return apiCall('post', `api/users/${id}/collections/${collection.isExpense}`, { title: collection.title, color: collection.collectionColor })
    .then(res => {
      dispatch(loadCollections(res));
    })
    .catch(err => {
      dispatch(addError(err.message));
    });
};

export const updateCollection = collection => (dispatch, getState) => {
  let { currentUser } = getState();
  const userId = currentUser.user.id;
  const collectionId = collection._id;

  return apiCall('put', `api/users/${userId}/collections/${collectionId}`, { title: collection.title, isExpense: collection.isExpense, color: collection.color })
    .then(res => {
      dispatch(loadCollections(res));
    })
    .catch(err => {
      dispatch(addError(err.message));
    });
}