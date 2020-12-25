import * as Constants from './constants';

export function setUserGroups(object) {
    return {
        type: Constants.SET_USER_GROUPS,
        object,
    };
}

export function addUserGroup(object) {
    return {
        type: Constants.ADD_USER_GROUPS,
        object,
    };
}


export function setActiveGroup(payload) {
    return {
        type: Constants.SET_ACTIVE_GROUP,
        payload,
    };
}

export function updateGroupAssets(object) {
    return {
        type: Constants.UPDATE_GROUP_ASSETS,
        object,
    };
}

export function updateGroup(object) {
    return {
        type: Constants.UPDATE_GROUP,
        object,
    };
}

export function setActiveScreen(payload) {
    return {
        type: Constants.SET_ACTIVE_SCREEN,
        payload,
    };
}

export function setSearchTerm(payload) {
    return {
        type: Constants.SET_SEARCH_TERM,
        payload,
    };
}

export function updateNewGroup(object) {
    return {
        type: Constants.UPDATE_NEW_GROUP,
        object,
    };
}

export function setSearchResultGroups(object) {
    return {
        type: Constants.SET_SEARCH_RESULT_GROUPS,
        object,
    };
}

export function setLoading(payload) {
    return {
        type: Constants.SET_LOADING,
        payload,
    };
}

export function setModalVisible(payload) {
    return {
        type: Constants.SET_MODAL_VISIBLE,
        payload,
    };
}

export function setNewMessage(payload) {
    return {
        type: Constants.SET_NEW_MESSAGE,
        payload,
    };
}

export function setMenuType(payload) {
    return {
        type: Constants.SET_MENU_TYPE,
        payload,
    };
}

export function setMenuVisible(payload) {
    return {
        type: Constants.SET_MENU_VISIBLE,
        payload,
    };
}

export function setActiveMessage(object) {
    return {
        type: Constants.SET_ACTIVE_MESSAGE,
        object,
    };
}

export function setActiveEvent(payload) {
    return {
        type: Constants.SET_ACTIVE_EVENT,
        payload,
    };
}
