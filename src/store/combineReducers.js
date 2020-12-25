import {combineReducers} from 'redux';
import {persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

// Reducers below.
import auth from '../containers/AuthContainer/reducer';
import bible from '../containers/BibleContainer/reducer';
import group from '../containers/GroupsContainer/reducer';
import prayer from '../containers/PrayerContainer/reducer';
import request from '../containers/RequestsContainer/reducer';

const authPersistConfig = {
    key: 'auth',
    storage: AsyncStorage,
    blacklist: ['loading'],
};

const biblePersistConfig = {
    key: 'bible',
    storage: AsyncStorage,
    blacklist: [],
};

const groupPersistConfig = {
    key: 'group',
    storage: AsyncStorage,
    blacklist: [
        'UserGroups',
        'ActiveGroup',
        'GroupAssets',
        'ActiveScreen',
        'SearchTerm',
        'NewGroup',
        'NewMessage',
        'ModalVisible',
        'SearchResultGroups',
        'loading',
    ],
};

const prayerPersistConfig = {
    key: 'prayer',
    storage: AsyncStorage,
    blacklist: ['dailyPrayer', 'dailyPrayerLoading'],
};

const requestPersistConfig = {
    key: 'request',
    storage: AsyncStorage,
    blacklist: [
        'prayerRequests',
        'newPrayerRequest',
        'endOfRequests',
        'modalVisible',
        'loading',
        'filterDistance',
    ],
};

const rootReducer = combineReducers({
    auth: persistReducer(authPersistConfig, auth),
    bible: persistReducer(biblePersistConfig, bible),
    group: persistReducer(groupPersistConfig, group),
    prayer: persistReducer(prayerPersistConfig, prayer),
    request: persistReducer(requestPersistConfig, request),
});

export default rootReducer;
