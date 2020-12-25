import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Keyboard,
    Dimensions,
    Alert,
} from 'react-native';
import Modal from 'react-native-modal';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPray} from '@fortawesome/pro-regular-svg-icons';
import styles from '../styles/prayerRequests';
import * as requestActions from '../containers/RequestsContainer/actions';

const NewPrayerRequest = (props) => {
    const {_callback} = props,
        {newPrayerRequest, modalVisible} = useSelector(
            (state) => state.request
        ),
        {Content, Title} = newPrayerRequest,
        dispatch = useDispatch(),
        [keyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
        Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

        // cleanup function
        return () => {
            Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
            Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
        };
    }, []);

    const _keyboardDidShow = () => {
        setKeyboardVisible(true);
    };

    const _keyboardDidHide = () => {
        setKeyboardVisible(false);
    };

    const _validateRequest = () => {
        // Ensure that the title and content are not empty.
        if (Title === '') {
            Alert.alert(
                'Error',
                'You must enter a title before submitting a prayer request'
            );
        } else if (Content === '') {
            Alert.alert(
                'Error',
                'Please enter content into your prayer request before attempting to submit.'
            );
        } else {
            dispatch(requestActions.setRequestModalVisible(false));
            _callback();
        }
    };

    return (
        <Modal
            isVisible={modalVisible}
            deviceWidth={Dimensions.get('window').width}
            deviceHeight={Dimensions.get('window').height}
            onBackdropPress={() => {
                if (keyboardVisible) {
                    Keyboard.dismiss();
                } else {
                    dispatch(
                        requestActions.setRequestModalVisible(false),
                        requestActions.resetPrayerRequest()
                    );
                }
            }}>
            <View style={styles.newPrayerRequestContainer}>
                    <Text style={styles.newRequestTitle}>
                        Add Prayer Request
                    </Text>

                    <TextInput
                        style={styles.newRequestInput}
                        placeholder="Title"
                        maxLength={24}
                        value={Title}
                        onChangeText={(text) => {
                            dispatch(
                                requestActions.editPrayerRequest({
                                    field: 'Title',
                                    value: text,
                                })
                            );
                        }}
                    />

                    <TextInput
                        style={[
                            styles.newRequestInput,
                            {
                                maxHeight:
                                    (Dimensions.get('window').height / 16) * 4,
                            },
                        ]}
                        value={Content}
                        placeholder="Prayer Request Content"
                        multiline
                        onChangeText={(text) => {
                            dispatch(
                                requestActions.editPrayerRequest({
                                    field: 'Content',
                                    value: text,
                                })
                            );
                        }}
                    />

                    <TouchableOpacity
                        style={[
                            styles.fulfillRequestButton,
                            {backgroundColor: '#EB237D'},
                        ]}
                        onPress={() => {
                            _validateRequest();
                        }}>
                        <Text
                            style={[
                                styles.newPrayerRequestButtonText,
                                {color: 'white'},
                            ]}>
                            Submit Request
                        </Text>

                        <FontAwesomeIcon
                            icon={faPray}
                            style={[
                                styles.newPrayerRequestButtonText,
                                {marginLeft: 8},
                            ]}
                            color="white"
                            size={20}
                        />
                    </TouchableOpacity>
                </View>
        </Modal>
    );
};

export default NewPrayerRequest;
