import React from 'react';
import {View, Text} from 'react-native';
import styles from '../styles/groups';
import moment from 'moment';

const GroupMessage = (props) => {
    const {comment} = props,
        {item} = comment,
        {Comment, DisplayName, key} = item,
        firestoreDate = item.Date,
        convertedDate = new Date(firestoreDate._seconds * 1000);

    return (
        <View key={key} style={styles.messageResponse}>
            <View style={styles.messageCardTopRow}>
                <View style={styles.abbreviationCircleSmall}>
                    <Text style={styles.abbreviationCircleTextSmall}>
                        {DisplayName.split(/\s/).reduce(
                            (response, word) => (response += word.slice(0, 1)),
                            ''
                        )}
                    </Text>
                </View>

                <View style={styles.messageCardCenter}>
                    <Text style={styles.commentPosterNameSmall}>
                        {DisplayName}
                    </Text>

                    <Text style={styles.messageDateSmall}>
                        {moment(convertedDate).format('dddd, MMMM Do')}
                    </Text>
                </View>
            </View>

            <Text style={styles.messageContentSmall}>{Comment}</Text>
        </View>
    );
};

export default GroupMessage;
