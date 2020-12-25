import React, {useEffect, useState, useCallback, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Alert,
    Animated,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import _ from 'lodash';
import moment from 'moment';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPlus} from '@fortawesome/pro-regular-svg-icons';
import styles from '../styles/groups';
import GroupMessage from '../components/GroupMessage';
import * as groupActions from '../containers/GroupsContainer/actions';
import NewGroupMessage from './NewGroupMessage';
import GroupMessageThread from './GroupMessageThread';

const GroupMessages = (props) => {
    const {ActiveGroup, GroupAssets, NewMessage, ActiveMessage} = useSelector(
            (state) => state.group
        ),
        {FirstName, LastName, Email} = useSelector((state) => state.auth.user),
        dispatch = useDispatch(),
        [localState, setState] = useState({
            messagesRefreshing: false,
            lastMessage: '',
            endOfMessages: '',
            skip:0
        }),
        opacity = useRef(new Animated.Value(1)).current;
    
    console.log('stategroup',ActiveMessage);
    useEffect(() => {
        const getMessages = async () => {
            dispatch(groupActions.setLoading(true));
            await firestore()
                .collection('Groups')
                .doc(ActiveGroup)
                .collection('Messages')
                .orderBy('Date', 'desc')
                .limit(10)
                .get()
                .then((snapshot) => {
                    const messages = [];

                    snapshot.docs.forEach((doc) => {
                        messages.push({
                            key: doc.id,
                            ...doc.data(),
                        });
                    });

                    setState({
                        ...localState,
                        skip: localState.skip + snapshot.docs.length,
                    });
                    setState({
                        ...localState,
                        endOfMessages: snapshot.docs.length < 10,
                    });

                    dispatch(
                        groupActions.updateGroupAssets({
                            key: 'Messages',
                            value: messages,
                        })
                    );
                    dispatch(groupActions.setLoading(false));
                });
        };

        getMessages();
    }, [ActiveGroup]);

    useEffect(() => {
        // We need to control opacity of the message wrapper here.
        ActiveMessage === undefined
            ? Animated.timing(opacity, {
                  toValue: 1,
                  timing: 350,
                  useNativeDriver: true,
              }).start()
            : Animated.timing(opacity, {
                  toValue: 0,
                  timing: 350,
                  useNativeDriver: true,
              }).start();
    }, [ActiveMessage]);

    const loadMore = async () => {
        if (!localState.endOfMessages) {
            dispatch(groupActions.setLoading(true));

            await firestore()
                .collection('Groups')
                .doc(ActiveGroup)
                .collection('Messages')
                .orderBy('Date', 'desc')
                .startAt(localState.skip)
                .limit(10)
                .get()
                .then((snapshot) => {
                    const messages = [...GroupAssets.Messages];

                    snapshot.docs.forEach((doc) => {
                        messages.push({
                            key: doc.id,
                            ...doc.data(),
                        });

                      
                    });

                    setState({
                        ...localState,
                        skip: localState.skip + snapshot.docs.length,
                    });

                    setState({
                        ...localState,
                        endOfMessages: snapshot.docs.length < 10,
                    });

                    dispatch(
                        groupActions.updateGroupAssets({
                            key: 'Messages',
                            value: messages,
                        })
                    );

                    dispatch(groupActions.setLoading(false));
                });
        }
    };

    const refresh = async () => {
        setState({
            ...localState,
            messagesRefreshing: true,
        });

        await firestore()
            .collection('Groups')
            .doc(ActiveGroup)
            .collection('Messages')
            .orderBy('Date', 'desc')
            .limit(10)
            .get()
            .then((snapshot) => {
                const messages = [];

                snapshot.docs.forEach((doc) => {
                    messages.push({
                        key: doc.id,
                        ...doc.data(),
                    });

                    setState({
                        ...localState,
                        lastMessage: doc,
                    });
                });

                setState({
                    ...localState,
                    endOfMessages: snapshot.docs.length < 10,
                });

                dispatch(
                    groupActions.updateGroupAssets({
                        key: 'Messages',
                        value: messages,
                    })
                );

                setState({
                    ...localState,
                    messagesRefreshing: false,
                });
            });
    };

    const createNewGroupMessage = async () => {
        const msgObj = {
            DisplayName: (FirstName || LastName)?FirstName + " " + LastName:Email,
            EmailAddress: Email,
            Date: new Date(),
            Content: NewMessage,
        };

        firestore()
            .collection('Groups')
            .doc(ActiveGroup)
            .collection('Messages')
            .add(msgObj)
            .then(() => {
                Alert.alert(
                    'Success!',
                    'Your message has been posted to the group.'
                );
                refresh();
            })
            .catch((error) => {
                console.log(`Error: ${error}`);
                Alert.alert(
                    'Error',
                    'We were unable to post this message. If this issue persists please contact support.'
                );
            });
    };

    const renderFooter = () => {
        if (localState.endOfMessages) {
            return (
                <View style={styles.endOfListContainer}>
                    <Text style={styles.endOfListText}>End of messages</Text>
                    <Text style={styles.endOfListText}>
                        Press + to submit a new message.
                    </Text>
                </View>
            );
        } else {
            return <View />;
        }
    };

    console.log('messagethread',ActiveMessage);

    return (
        <View style={styles.groupViewInnerWrapper}>
            {
                ActiveMessage == undefined && (
                    <Animated.View
                        style={{
                            opacity,
                            zIndex: ActiveMessage === undefined ? 10 : -1,
                            position:
                                ActiveMessage === undefined ? 'relative' : 'absolute',
                            paddingLeft:24,
                            paddingRight:24
                        }}
                        pointerEvents={ActiveMessage === undefined ? 'auto' : 'none'}>
                        <FlatList
                            data={GroupAssets.Messages}
                            contentContainerStyle={{paddingBottom: 148}}
                            keyExtractor={(item) => {
                                item.key;
                            }}
                            showsVerticalScrollIndicator={false}
                            renderItem={(message,index) => <GroupMessage key={index} message={message} />}
                            onEndReached={() => loadMore()}
                            onEndReachedThreshold={0.1}
                            refreshing={localState.messagesRefreshing}
                            onRefresh={() => refresh()}
                            ListFooterComponent={() => renderFooter()}
                        />

                        <TouchableOpacity
                            onPress={() => {
                                dispatch(groupActions.setModalVisible(true));
                            }}
                            style={styles.newGroupActionButton}>
                            <FontAwesomeIcon color="white" icon={faPlus} />
                        </TouchableOpacity>

                        <NewGroupMessage _callback={() => createNewGroupMessage()} />
                    </Animated.View>
                )
            }
            

            {ActiveMessage !== undefined && <GroupMessageThread />}
        </View>
    );
};

export default GroupMessages;
