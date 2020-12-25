import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
    View,
    Text,
    Keyboard,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    Alert,
    Switch,
} from 'react-native';

import styles from '../styles/userDetail';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

import {
    faApple,
    faGoogle,
    faFacebookF,
} from '@fortawesome/free-brands-svg-icons';
import {faSignOut} from '@fortawesome/pro-solid-svg-icons';
import {faSave} from '@fortawesome/pro-regular-svg-icons';
import * as authActions from '../containers/AuthContainer/actions';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-community/google-signin';

export const AccountDetail = (props) => {
    const user = useSelector((state) => state.auth.user),
    dispatch = useDispatch(),
    [localPassword, setPassword] = useState('');
    const [userdata,setuserdata] = useState({...user});
    
    const formatPhoneNumber = (value) => {
        let currentVal = value;
        currentVal = currentVal.replace(/\D/g, '').substring(0, 10);

        const areaCode = currentVal.substring(0, 3);
        const middle = currentVal.substring(3, 6);
        const last = currentVal.substring(6, 10);

        var newVal;

        if (currentVal.length > 6) {
            newVal = `(${areaCode}) ${middle}-${last}`;
        } else if (currentVal.length > 3) {
            newVal = `(${areaCode}) ${middle}`;
        } else if (currentVal.length > 0) {
            newVal = `(${areaCode}`;
        } else {
            newVal = '';
        }

        setuserdata({
            ...userdata,
            PhoneNumber:newVal
        })
    };

    const logout = async () => {
        dispatch(authActions.setAccountLoading(true));
        
        if(user.Provider == 'Google')
        {
            try
            {
                await GoogleSignin.revokeAccess();
                await GoogleSignin.signOut();
            }
            catch(e)
            {
                console.log(e);
            }
            
        }
        
        await auth()
            .signOut()
            .then(() => {
                dispatch(authActions.setAccountLoading(false));
                dispatch(authActions.setUser(undefined));
            }).catch(err=>console.log(err))
    };

    const confirmSignout = () => {
        Alert.alert(
            'Confirm',
            'Are you sure you want to log out?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: () => {
                        logout();
                    },
                },
            ],
            {cancelable: false}
        );
    };

    const saveChange = async() => {
        try{
            if(localPassword != '')
            {
                let currentuser = auth().currentUser;
                await currentuser.updatePassword(localPassword);
            }

            firestore().collection('Users').doc(userdata.Email).update(userdata).then(res=>{
                dispatch(authActions.setUser(userdata));
                Alert.alert('Profile is Updated Successfully');                
            })
        }
        catch(err)
        {

        }
        
    }
    
    return (
        <ScrollView
            style={[styles.container,{paddingLeft:8,paddingRight:8}]}
            contentContainerStyle={{flexGrow: 1, paddingBottom: 148}}>
            <Text style={styles.pageHeader}>Account Details</Text>
            <View style={styles.accountDetailsContainer}>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>First Name</Text>
                    <TextInput
                        placeholder="First Name"
                        placeholderTextColor="rgba(0,0,0,.5)"
                        autoCapitalize="none"
                        style={styles.input}
                        onChangeText={(value) => {
                            setuserdata({
                                ...userdata,
                                FirstName:value
                            })
                        }}
                        onSubmitEditing={() => Keyboard.dismiss()}
                        value={userdata.FirstName}
                    />
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.label}>Last Name</Text>
                    <TextInput
                        placeholder="Last Name"
                        placeholderTextColor="rgba(0,0,0,.5)"
                        autoCapitalize="none"
                        style={styles.input}
                        onChangeText={(value) => {
                            setuserdata({
                                ...userdata,
                                LastName:value
                            })
                        }}
                        onSubmitEditing={() => Keyboard.dismiss()}
                        value={userdata.LastName}
                    />
                </View>

                {userdata.Provider === 'Traditional' && (
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            editable={false}
                            autoCorrect={false}
                            style={[styles.input, {opacity: 0.7}]}
                            value={userdata.Email}
                        />
                    </View>
                )}

                <View style={styles.infoRow}>
                    <Text style={styles.label}>Phone</Text>
                    <TextInput
                        dataDetectorTypes="phoneNumber"
                        style={styles.input}
                        placeholder={'(999) 999-9999'}
                        placeholderTextColor="rgba(0,0,0,.5)"
                        onChangeText={(value) =>
                            formatPhoneNumber(value)
                        }
                        keyboardType="phone-pad"
                        onSubmitEditing={() => Keyboard.dismiss()}
                        value={userdata.PhoneNumber}
                        maxLength={14}
                    />
                </View>

                {userdata.Provider === 'Traditional' && (
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>
                            New Password
                        </Text>
                        <TextInput
                            placeholder="New Password"
                            placeholderTextColor="rgba(0,0,0,.5)"
                            autoCapitalize="none"
                            secureTextEntry={true}
                            style={styles.input}
                            onChangeText={(value) =>
                                setPassword(value)
                            }
                            onSubmitEditing={() =>
                                Keyboard.dismiss()
                            }
                            value={localPassword}
                        />
                    </View>
                )}

                {userdata.Provider !== 'Traditional' && (
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>
                            Auth Method
                        </Text>
                        <View
                            style={[
                                styles.authIconContainer,
                                {
                                    backgroundColor:
                                        userdata.Provider === 'Facebook'
                                            ? '#1778F2'
                                            : userdata.Provider === 'Google'
                                            ? '#4285f4'
                                            : userdata.Provider === 'Apple'
                                            ? 'black'
                                            : '',
                                },
                            ]}>
                            <FontAwesomeIcon
                                style={styles.authIcon}
                                icon={
                                    userdata.Provider === 'Facebook'
                                        ? faFacebookF
                                        : userdata.Provider === 'Google'
                                        ? faGoogle
                                        : userdata.Provider === 'Apple'
                                        ? faApple
                                        : ''
                                }
                                size={16}
                            />
                            <Text style={styles.authMethodText}>
                                {userdata.Provider}
                            </Text>
                        </View>
                    </View>
                )}

                <View style={styles.infoRow}>
                    <Text style={styles.label}>Anonymity</Text>
                    <View style={styles.infoRowInnerContainer}>
                        <Text style={styles.infoDescription}>
                            This setting reflects in the prayer
                            requests section. Rather than showing
                            your first name, you will appear
                            anonymously.
                        </Text>
                        <Switch
                            trackColor="rgb(0, 118, 253)"
                            ios_backgroundColor="rgba(0, 118, 253, .5)"
                            onValueChange={(value) =>
                                setuserdata({
                                    ...userdata,
                                    Anonymous:value
                                })
                            }
                            value={userdata.Anonymous}
                        />
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            {backgroundColor: '#EB237D'},
                        ]}
                        onPress={() => saveChange()}>
                        <FontAwesomeIcon
                            icon={faSave}
                            size={20}
                            style={styles.buttonIcon}
                            color="white"
                        />
                        <Text
                            style={[
                                styles.buttonText,
                                {color: 'white'},
                            ]}>
                            Save Changes
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.button,
                            {backgroundColor: 'white'},
                        ]}
                        onPress={() => confirmSignout()}>
                        <FontAwesomeIcon
                            icon={faSignOut}
                            size={20}
                            style={styles.buttonIcon}
                            color="#EB237D"
                        />
                        <Text
                            style={[
                                styles.buttonText,
                                {color: '#EB237D'},
                            ]}>
                            Sign Out
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
           
        </ScrollView>
    )
}