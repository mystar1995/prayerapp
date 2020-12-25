import * as Constants from './constants';
import _ from 'lodash';

const initialState = {
  prayerRequests: [],
  endOfRequests: false,
  filterDistance: 0,
  newPrayerRequest: {
    Content: '',
    Date: null,
    Fulfillment: 0,
    Reputation: 0,
    Title: '',
    User: '',
  },
  loading: false,
  modalVisible: false,
};

export default function startReducer(state = initialState, action) {
  switch (action.type) {
    case Constants.SET_PRAYER_REQUESTS:
      return {
        ...state,
        prayerRequests: action.payload,
      };
    case Constants.UPDATE_PRAYER_REQUEST:
      return {
        ...state,
        prayerRequests: _.map(state.prayerRequests, (request) => {
          if (request.key === action.object.key) {
            return {
              ...request,
              [action.object.field]: action.object.value,
            };
          } else {
            return request;
          }
        }),
      };
    case Constants.SET_END_OF_REQUESTS:
      return {
        ...state,
        endOfRequests: action.payload,
      };
    case Constants.EDIT_PRAYER_REQUEST:
      return {
        ...state,
        newPrayerRequest: {
          ...state.newPrayerRequest,
          [action.object.field]: action.object.value,
        },
      };
    case Constants.RESET_PRAYER_REQUEST:
      return {
        ...state,
        newPrayerRequest: {
          Content: '',
          Date: null,
          Fulfillment: 0,
          Reputation: 0,
          Title: '',
          User: '',
        },
      };
    case Constants.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case Constants.SET_MODAL_VISIBLE:
      return {
        ...state,
        modalVisible: action.payload,
      };
    case Constants.SET_FILTER_DISTANCE:
      return {
        ...state,
        filterDistance: action.payload,
      };
    default:
      return state;
  }
}
