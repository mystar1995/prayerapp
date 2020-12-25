import * as Constants from './constants';

export function setUser(object) {
	return {
		type: Constants.SET_USER,
		object,
	};
}

export function updateAuthField(object) {
	return {
		type: Constants.UPDATE_AUTH_FIELD,
		object,
	};
}

export function updateUserField(object) {
	return {
		type: Constants.UPDATE_USER_FIELD,
		object,
	};
}

export function setAccountLoading(payload) {
	return {
		type: Constants.SET_ACCOUNT_LOADING,
		payload,
	};
}

export function setupdate()
{
	return {
		type:Constants.SET_UPDATE
	}
}

