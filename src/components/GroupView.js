import React, {useEffect, useState, useCallback, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
    View,
    Text,
    Animated,
    TouchableOpacity,
    Alert,
    FlatList,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import _ from 'lodash';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPlus} from '@fortawesome/pro-regular-svg-icons';
import styles from '../styles/groups';
import * as groupActions from '../containers/GroupsContainer/actions';
import GroupMessages from '../components/GroupMessages';
import GroupMembers from '../components/GroupMembers';
import GroupEvents from '../components/GroupEvents';

const GroupView = (props) => {
    const {
            ActiveGroup,
            ActiveScreen,
            UserGroups,
            GroupAssets,
            loading,
        } = useSelector((state) => state.group),
        currentGroup = _.find(UserGroups, ['Id', ActiveGroup]),
        dispatch = useDispatch();
    console.log('activescreen',ActiveScreen);
    return (
        <View style={styles.groupView}>
            {ActiveScreen === 'Messages' && <GroupMessages />}
            {ActiveScreen == 'Members' && <GroupMembers/>}
            {ActiveScreen == 'Events' && <GroupEvents/>}
        </View>
    );
};

export default GroupView;
