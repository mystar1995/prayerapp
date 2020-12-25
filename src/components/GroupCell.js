import React, {useEffect, useState, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {View, Text, Animated, TouchableOpacity, Alert} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import styles from '../styles/groups';
import * as groupActions from '../containers/GroupsContainer/actions';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faChevronRight} from '@fortawesome/pro-solid-svg-icons';

const GroupCell = (props) => {
    const {item} = props.group,
        {Id, GroupName, UserRole} = item,
        dispatch = useDispatch();
    console.log('item',item);
    return (
        <TouchableOpacity
            style={styles.groupCellContainer}
            onPress={() => {
                dispatch(groupActions.setActiveGroup(Id));
            }}>
            <View style={styles.abbreviationCircle}>
                <Text style={styles.abbreviationCircleText}>
                    {GroupName.substring(0, 2)}
                </Text>
            </View>
            <Text style={styles.groupName}>{GroupName}</Text>

            <FontAwesomeIcon icon={faChevronRight} style={styles.groupArrow} />
        </TouchableOpacity>
    );
};

export default GroupCell;
