import React, {useEffect, useState, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Alert,
    Animated,
    Dimensions,
    PanResponder,
    TextInput,
    Keyboard,
    KeyboardAvoidingView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEllipsisH, faPaperPlane} from '@fortawesome/pro-solid-svg-icons';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from '../styles/groups';
import GroupMessageComment from '../components/GroupMessageComment';
import * as groupActions from '../containers/GroupsContainer/actions';

const GroupMessageThread = (props) => {
    const {ActiveGroup, ActiveMessage} = useSelector((state) => state.group),
        {FirstName, LastName, Email} = useSelector((state) => state.auth.user),
        dispatch = useDispatch(),
        [localState, setState] = useState({
            messageComment: '',
            comments: [],
            keyboardVisible: false,
        }),
        breakpoint = Dimensions.get('window').height * 0.35,
        pan = useRef(
            new Animated.ValueXY({x: 0, y: Dimensions.get('window').height})
        ).current,
        panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event(
                [
                    null,
                    {
                        dy: pan.y,
                    },
                ],
                {
                    useNativeDriver: false,
                }
            ),
            onPanResponderRelease: (evt, gesture) => {
                if (evt.nativeEvent.pageY > breakpoint && gesture.dy > 250) {
                    dispatch(groupActions.setActiveMessage(undefined));
                } else {
                    Animated.spring(pan, {
                        toValue: {x: 0, y: 0},
                        useNativeDriver: false,
                    }).start();
                }
            },
        });
        
    // useEffect(() => {
    //     const _keyboardDidShow = () => {
    //         setState({...localState, keyboardVisible: true});
    //     };

    //     const _keyboardDidHide = () => {
    //         setState({...localState, keyboardVisible: false});
    //     };

    //     Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    //     Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

    //     // cleanup function
    //     return () => {
    //         Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
    //         Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    //     };
    // }, [localState]);

    useEffect(() => {
        Animated.spring(pan, {
            toValue: {x: 0, y: 0},
            useNativeDriver: false,
        }).start();

        const getComments = async () => {
            dispatch(groupActions.setLoading(true));
            await firestore()
                .collection('Groups')
                .doc(ActiveGroup)
                .collection('Messages')
                .doc(ActiveMessage.key)
                .collection('Comments')
                .get()
                .then((snapshot) => {
                    const comments = [];

                    snapshot.docs.forEach((doc) => {
                        comments.push({
                            key: doc.id,
                            ...doc.data(),
                        });
                    });

                    setState({
                        ...localState,
                        comments,
                    });

                    dispatch(groupActions.setLoading(false));
                });
        };

        getComments();
    }, [ActiveMessage]);

    const getComments = async () => {
        dispatch(groupActions.setLoading(true));
        await firestore()
            .collection('Groups')
            .doc(ActiveGroup)
            .collection('Messages')
            .doc(ActiveMessage.key)
            .collection('Comments')
            .get()
            .then((snapshot) => {
                const comments = [];

                snapshot.docs.forEach((doc) => {
                    comments.push({
                        key: doc.id,
                        ...doc.data(),
                    });
                });

                setState({
                    ...localState,
                    comments,
                });

                dispatch(groupActions.setLoading(false));
            });
    };

    const submitComment = async () => {
        const msgObj = {
            DisplayName: `${FirstName} ${LastName}`,
            EmailAddress: Email,
            Date: new Date(),
            Comment: localState.messageComment,
        };

        const validated = localState.messageComment !== '';

        if (validated) {
            dispatch(groupActions.setLoading(true));

            await firestore()
                .collection('Groups')
                .doc(ActiveGroup)
                .collection('Messages')
                .doc(ActiveMessage.key)
                .collection('Comments')
                .add(msgObj)
                .then(async (res) => {
                    msgObj.key = res.id;
                   
                     Alert.alert(
                        'Success!',
                        'Your comment has been added to this thread.'
                    );
                    setState({
                        ...localState,
                        messageComment: '',
                        comments:[msgObj,...localState.comments]
                    });

                    dispatch(groupActions.setLoading(false));
                })
                .catch((error) => {
                    console.log(`Error: ${error}`);
                    dispatch(groupActions.setLoading(false));
                    Alert.alert(
                        'Error',
                        'We were unable to post this message. If this issue persists please contact support.'
                    );
                });
        }
    };

    return ActiveMessage !== undefined ? (
        <View
            style={styles.fullThreadView}
            // {...panResponder.panHandlers}
            //     style={[
            //         styles.fullThreadView,
            //         pan.getLayout(),
            //         {
            //             opacity: pan.y.interpolate({
            //                 inputRange: [0, 550],
            //                 outputRange: [1, 0.5],
            //             }),
            //             zIndex: ActiveMessage !== undefined ? 10 : -1,
            //         },
            //     ]}>
            >
                <View
                    style={styles.fullThreadContainer}>
                    <View style={styles.discussionTopContainer}>
                        <View style={styles.messageCardTopRow}>
                            <View style={styles.abbreviationCircle}>
                                <Text style={styles.abbreviationCircleText}>
                                    {ActiveMessage.DisplayName.split(
                                        /\s/
                                    ).reduce(
                                        (response, word) =>
                                            (response += word.slice(0, 1)),
                                        ''
                                    )}
                                </Text>
                            </View>

                            <View style={styles.messageCardCenter}>
                                <Text style={styles.commentPosterName}>
                                    {ActiveMessage.DisplayName}
                                </Text>

                                <Text style={styles.messageDate}>
                                    {moment(ActiveMessage.convertedDate).format(
                                        'dddd, MMMM Do'
                                    )}
                                </Text>
                            </View>
                        </View>

                        <Text style={styles.messageContent}>
                            {ActiveMessage.Content}
                        </Text>
                    </View>
                    <View style={{flex:1}}>
                        <FlatList
                            contentContainerStyle={styles.commentScrollView}
                            showsVerticalScrollIndicator={false}
                            data={localState.comments}
                            keyExtractor={(item) => item.key}
                            renderItem={(comment) => (
                                <GroupMessageComment comment={comment} />
                            )}
                            ItemSeparatorComponent={() => (
                                <View style={styles.commentSeparator} />
                            )}
                        />

                    </View>
                    
                    <View style={styles.fullThreadCommentBottom}>
                        <TextInput
                            placeholder="Add a comment"
                            style={styles.commentInput}
                            multiline={true}
                            value={localState.messageComment}
                            onChangeText={(val) =>
                                setState({
                                    ...localState,
                                    messageComment: val,
                                })
                            }
                        />

                        <TouchableOpacity
                            style={styles.sendButton}
                            onPress={() => submitComment()}>
                            <FontAwesomeIcon
                                icon={faPaperPlane}
                                size={14}
                                color="white"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
    ) : null;
};

export default GroupMessageThread;
