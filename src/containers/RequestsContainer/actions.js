import * as Constants from './constants';

export function setPrayerRequests(payload) {
  return {
    type: Constants.SET_PRAYER_REQUESTS,
    payload,
  };
}

export function updatePrayerRequest(object) {
  return {
    type: Constants.UPDATE_PRAYER_REQUEST,
    object,
  };
}

export function setEndOfRequests(payload) {
  return {
    type: Constants.SET_END_OF_REQUESTS,
    payload,
  };
}

export function editPrayerRequest(object) {
  return {
    type: Constants.EDIT_PRAYER_REQUEST,
    object,
  };
}

export function resetPrayerRequest() {
  return {
    type: Constants.RESET_PRAYER_REQUEST,
  };
}

export function setLoading(payload) {
  return {
    type: Constants.SET_LOADING,
    payload,
  };
}

export function setRequestModalVisible(payload) {
  return {
    type: Constants.SET_MODAL_VISIBLE,
    payload,
  };
}

export function setFilterDistance(payload) {
  return {
    type: Constants.SET_FILTER_DISTANCE,
    payload,
  };
}
