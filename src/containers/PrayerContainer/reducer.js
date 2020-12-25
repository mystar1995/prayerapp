import {fromJS} from 'immutable';
import * as Constants from './constants';

const initialState = {
	dailyPrayer: undefined,
	dailyPrayerLoading: true,
};

export default function startReducer(state = initialState, action) {
	switch (action.type) {
		case Constants.SET_DAILY_PRAYER:
			return {
				...state,
				dailyPrayer: action.object,
			};
		case Constants.SET_LOADING_DAILY_PRAYER:
			return {
				...state,
				dailyPrayerLoading: action.payload,
			};
		default:
			return state;
	}
}
