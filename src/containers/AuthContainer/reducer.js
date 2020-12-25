import * as Constants from './constants';

const initialState = {
	user: undefined,
	auth: {
		email: '',
		password: '',
	},
	loading: false,
	updatecomponent:false
};

export default function startReducer(state = initialState, action) {
	switch (action.type) {
		case Constants.SET_USER:
			return {
				...state,
				user: action.object,
			};
		case Constants.SET_UPDATE:
			return {
				...state,
				updatecomponent:!state.updatecomponent
			}
		case Constants.UPDATE_AUTH_FIELD:
			return {
				...state,
				auth: {
					...state.auth,
					[action.object.field]: action.object.value,
				},
			};

		case Constants.UPDATE_USER_FIELD:
			return {
				...state,
				user: {
					...state.user,
					[action.object.field]: action.object.value,
				},
			};
		case Constants.SET_ACCOUNT_LOADING:
			return {
				...state,
				loading: action.payload,
			};
		default:
			return state;
	}
}
