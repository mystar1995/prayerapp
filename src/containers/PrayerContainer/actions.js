import * as Constants from './constants';

export function setDailyPrayer(object) {
	return {
		type: Constants.SET_DAILY_PRAYER,
		object,
	};
}

export function setDailyPrayerLoading(payload) {
	return {
		type: Constants.SET_LOADING_DAILY_PRAYER,
		payload,
	};
}
