import { LOAD_COLLECTIONS, LOAD_COLLECTIONS_CHART_DATA, LOAD_COLLECTIONS_AND_VALUES, REMOVE_COLLECTION, LOAD_COLLECTIONS_AND_VALUES_FOR_MONTH } from '../actionTypes';

const DEFAULT_STATE = {
  collections: [],
  collectionsChartData: {},
  collectionsAndValues: {},
  collectionsAndValuesForMonth: {}
};

export default (state = DEFAULT_STATE, action) => {
  switch(action.type) {
    case LOAD_COLLECTIONS:
      return {
        collections: [...action.collections],
        collectionsChartData: {...state.data},
        collectionsAndValues: {...state.collectionsAndValues},
        collectionsAndValuesForMonth: {...state.collectionsAndValuesForMonth}
      };
    case LOAD_COLLECTIONS_CHART_DATA:
      return {
        collections: [...state.collections],
        collectionsChartData: {...action.data},
        collectionsAndValues: {...state.collectionsAndValues},
        collectionsAndValuesForMonth: {...state.collectionsAndValuesForMonth}
      };
    case LOAD_COLLECTIONS_AND_VALUES:
      return {
        collections: [...state.collections],
        collectionsChartData: {...state.data},
        collectionsAndValues: {...action.collectionsAndValues},
        collectionsAndValuesForMonth: {...state.collectionsAndValuesForMonth}
      };
    case LOAD_COLLECTIONS_AND_VALUES_FOR_MONTH:
      return {
        collections: [...state.collections],
        collectionsChartData: {...state.data},
        collectionsAndValues: {...state.collectionsAndValues},
        collectionsAndValuesForMonth: {...action.collectionsAndValuesForMonth}
      }
    case REMOVE_COLLECTION:
      return {
        collections: state.collections.filter(collection => collection._id !== action.id),
        collectionsChartData: {...state.data},
        collectionsAndValues: {...action.collectionsAndValues},
        collectionsAndValuesForMonth: {...state.collectionsAndValuesForMonth}
      };
    default:
      return state;
  }
};