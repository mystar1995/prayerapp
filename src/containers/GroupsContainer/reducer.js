import * as Constants from './constants';
import _ from 'lodash';

const initialState = {
    UserGroups: [],
    ActiveGroup: undefined,
    GroupAssets: {
        Messages: [],
        Members: [],
        Events: [],
        Settings: [],
    },
    ActiveScreen: 'Messages',
    SearchTerm: '',
    NewGroup: {
        Name: '',
    },
    NewMessage: '',
    ModalVisible: '',
    MenuType: 'Group',
    MenuVisible: false,
    SearchResultGroups: [],
    ActiveMessage: undefined,
    ActiveEvent: undefined,
    loading: false,
};

export default function startReducer(state = initialState, action) {
    switch (action.type) {
        case Constants.SET_USER_GROUPS:
            return {
                ...state,
                UserGroups: action.object,
            };
        case Constants.ADD_USER_GROUPS:
            return {
                ...state,
                UserGroups:[...state.UserGroups,action.object]
            }
        case Constants.SET_ACTIVE_GROUP:
            return {
                ...state,
                ActiveGroup: action.payload,
            };
        case Constants.UPDATE_GROUP_ASSETS:
            return {
                ...state,
                GroupAssets: {
                    ...state.GroupAssets,
                    [action.object.key]: action.object.value,
                },
            };
        case Constants.UPDATE_GROUP:
            return {
                ...state,
                UserGroups: _.map(state.UserGroups, (group) => {
                    if (group._id === action.object._id) {
                        return {
                            ...group,
                            [action.object.field]: action.object.value,
                        };
                    } else {
                        return group;
                    }
                }),
            };
        case Constants.SET_ACTIVE_SCREEN:
            return {
                ...state,
                ActiveScreen: action.payload,
            };
        case Constants.SET_SEARCH_TERM:
            return {
                ...state,
                SearchTerm: action.payload,
            };
        case Constants.UPDATE_NEW_GROUP:
            return {
                ...state,
                NewGroup: {
                    ...state.NewGroup,
                    [action.object.field]: action.object.value,
                },
            };
        case Constants.SET_SEARCH_RESULT_GROUPS:
            return {
                ...state,
                SearchResultGroups: action.object,
            };
        case Constants.SET_LOADING:
            return {
                ...state,
                loading: action.payload,
            };
        case Constants.SET_MODAL_VISIBLE:
            return {
                ...state,
                ModalVisible: action.payload,
            };
        case Constants.SET_NEW_MESSAGE:
            return {
                ...state,
                NewMessage: action.payload,
            };
        case Constants.SET_MENU_TYPE:
            return {
                ...state,
                MenuType: action.payload,
            };
        case Constants.SET_MENU_VISIBLE:
            return {
                ...state,
                MenuVisible: action.payload,
            };
        case Constants.SET_ACTIVE_MESSAGE:
            return {
                ...state,
                ActiveMessage: action.object,
            };
        case Constants.SET_ACTIVE_EVENT:
            return {
                ...state,
                ActiveEvent: action.payload,
            };
        default:
            return state;
    }
}
