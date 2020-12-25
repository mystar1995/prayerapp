import React from 'react';
import {useDispatch} from 'react-redux';
import {View, Text, TouchableOpacity} from 'react-native';
import moment from 'moment';
import styles from '../styles/groups';
import * as groupActions from '../containers/GroupsContainer/actions';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEllipsisH} from '@fortawesome/pro-solid-svg-icons';

const GroupMessage = (props) => {
    const {message} = props,
        {item} = message,
        {Content, DisplayName, EmailAddress, key} = item,
        firestoreDate = item.Date,
        convertedDate = new Date(firestoreDate._seconds * 1000),
        dispatch = useDispatch();

    return (
        <TouchableOpacity
            key={key}
            style={[styles.groupCellContainer, {flexWrap: 'wrap'}]}
            onPress={() =>
                dispatch(
                    groupActions.setActiveMessage({...item, convertedDate})
                )
            }>
            <View style={styles.messageCardTopRow}>
                <View style={styles.abbreviationCircle}>
                    <Text style={styles.abbreviationCircleText}>
                        {DisplayName.split(/\s/).reduce(
                            (response, word) => (response += word.slice(0, 1)),
                            ''
                        )}
                    </Text>
                </View>

                <View style={styles.messageCardCenter}>
                    <Text style={styles.commentPosterName}>{DisplayName}</Text>

                    <Text style={styles.messageDate}>
                        {moment(convertedDate).format('dddd, MMMM Do')}
                    </Text>
                </View>
            </View>
            <Text style={styles.messageContent}>{Content}</Text>
        </TouchableOpacity>
    );
};

export default GroupMessage;
