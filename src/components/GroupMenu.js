import React, {useEffect, useState, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    Platform,
    Dimensions,
    TouchableWithoutFeedback,
    TextInput,
    Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import _ from 'lodash';
import styles from '../styles/groups';
import * as groupActions from '../containers/GroupsContainer/actions';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faChevronRight} from '@fortawesome/pro-solid-svg-icons';

const GroupMenu = (props) => {
    const {ActiveGroup, UserGroups, loading} = useSelector(
            (state) => state.group
        ),
        currentGroup = _.find(UserGroups, ['Id', ActiveGroup]),
        dispatch = useDispatch(),
        height = Dimensions.get('window').height,
        bottom = useRef(new Animated.Value(height * -1)).current;

    return (
        <TouchableWithoutFeedback style={styles.groupMenuFull}>
            <SafeAreaView>
                <Animated.View
                    style={[
                        styles.groupMenuContainer,
                        {
                            bottom: this.bottom,
                            paddingTop: 16,
                        },
                    ]}>
                    <View style={styles.row}>
                        <TouchableOpacity
                            style={[
                                styles.groupInfoSettingsContainerButton,
                                this.props.activeView === 'Home' &&
                                    styles.activeGroupInfoSettingsContainerButton,
                            ]}
                            onPress={() => this.change_view('Home')}>
                            <Feather
                                name="home"
                                style={[
                                    styles.groupInfoSettingsContainerIcon,
                                    this.props.activeView === 'Home' &&
                                        styles.activeGroupInfoSettingsContainerIcon,
                                ]}
                            />
                            <Text
                                style={[
                                    styles.groupInfoSettingsContainerText,
                                    this.props.activeView === 'Home' &&
                                        styles.activeGroupInfoSettingsContainerText,
                                ]}>
                                Home
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.groupInfoSettingsContainerButton,
                                this.props.activeView === 'Events' &&
                                    styles.activeGroupInfoSettingsContainerButton,
                            ]}
                            onPress={() => this.change_view('Events')}>
                            <Feather
                                name="calendar"
                                style={[
                                    styles.groupInfoSettingsContainerIcon,
                                    this.props.activeView === 'Events' &&
                                        styles.activeGroupInfoSettingsContainerIcon,
                                ]}
                            />
                            <Text
                                style={[
                                    styles.groupInfoSettingsContainerText,
                                    this.props.activeView === 'Events' &&
                                        styles.activeGroupInfoSettingsContainerText,
                                ]}>
                                Events
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.groupInfoSettingsContainerButton,
                                this.props.activeView === 'Members' &&
                                    styles.activeGroupInfoSettingsContainerButton,
                            ]}
                            onPress={() => this.change_view('Members')}>
                            <Feather
                                name="users"
                                style={[
                                    styles.groupInfoSettingsContainerIcon,
                                    this.props.activeView === 'Members' &&
                                        styles.activeGroupInfoSettingsContainerIcon,
                                ]}
                            />
                            <Text
                                style={[
                                    styles.groupInfoSettingsContainerText,
                                    this.props.activeView === 'Members' &&
                                        styles.activeGroupInfoSettingsContainerText,
                                ]}>
                                Members
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.row}>
                        {this.props.userCanChangeSettings && (
                            <TouchableOpacity
                                style={styles.groupInfoSettingsContainerButton}
                                onPress={() => this.changeGroupSettings()}>
                                <Feather
                                    name="settings"
                                    style={
                                        styles.groupInfoSettingsContainerIcon
                                    }
                                />
                                <Text
                                    style={
                                        styles.groupInfoSettingsContainerText
                                    }>
                                    Settings
                                </Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={styles.groupInfoSettingsContainerButton}
                            onPress={() => this.reportGroup()}>
                            <Feather
                                name="alert-circle"
                                style={styles.groupInfoSettingsContainerIcon}
                            />
                            <Text style={styles.groupInfoSettingsContainerText}>
                                Report
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.groupInfoSettingsContainerButton}
                            onPress={() => this.leaveGroup()}>
                            <Feather
                                name="log-out"
                                style={styles.groupInfoSettingsContainerIcon}
                            />
                            <Text style={styles.groupInfoSettingsContainerText}>
                                Leave
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

export default GroupMenu;
