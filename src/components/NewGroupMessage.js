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
import styles from '../styles/groups';
import * as groupActions from '../containers/GroupsContainer/actions';
import {faPaperPlane} from '@fortawesome/pro-solid-svg-icons';

const NewGroupMessage = (props) => {
    const {_callback} = props,
        {NewMessage, ModalVisible} = useSelector((state) => state.group),
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

    const _validateContent = () => {
        // Ensure that the title and content are not empty.
        if (NewMessage === '') {
            Alert.alert(
                'Error',
                'You must enter content before submitting this new group message'
            );
        } else {
            dispatch(groupActions.setModalVisible(false));
            _callback();
        }
    };

    return (
        <Modal
            isVisible={ModalVisible}
            deviceWidth={Dimensions.get('window').width}
            deviceHeight={Dimensions.get('window').height}
            onBackdropPress={() => {
                if (keyboardVisible) {
                    Keyboard.dismiss();
                } else {
                    dispatch(
                        groupActions.setModalVisible(false),
                        groupActions.setNewMessage('')
                    );
                }
            }}>
            <KeyboardAvoidingView behavior="position">
                <View style={styles.newMessageContainer}>
                    <Text style={styles.newMessageTitle}>
                        New Group Message
                    </Text>

                    <TextInput
                        style={[
                            styles.newMessageInput,
                            {
                                maxHeight:
                                    (Dimensions.get('window').height / 16) * 4,
                            },
                        ]}
                        value={NewMessage}
                        placeholder="Message Content Here"
                        multiline
                        onChangeText={(text) => {
                            dispatch(groupActions.setNewMessage(text));
                        }}
                    />

                    <TouchableOpacity
                        style={styles.openDiscussionButton}
                        onPress={() => {
                            _validateContent();
                        }}>
                        <Text style={styles.openDiscussionText}>Submit</Text>

                        <FontAwesomeIcon
                            icon={faPaperPlane}
                            style={[styles.openDiscussionText, {marginLeft: 8}]}
                            color="white"
                            size={20}
                        />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default NewGroupMessage;
