import React, {useEffect, useState, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import moment from 'moment';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import {LoginManager, AccessToken} from 'react-native-fbsdk';
import {GoogleSignin} from '@react-native-community/google-signin';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  View,
  StatusBar,
  Text,
  Keyboard,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Platform,
  KeyboardAvoidingView,
  Animated,
  Dimensions,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faApple,
  faGoogle,
  faFacebookF,
} from '@fortawesome/free-brands-svg-icons';
import {faQuestion} from '@fortawesome/pro-solid-svg-icons';
import * as authActions from '../containers/AuthContainer/actions';
import {webClientId} from '../constants/keys';
import styles from '../styles/account';
import Modal from 'react-native-modal';

const LoginForm = (props) => {
  const [localState,setState] = useState({
    email:"",
    password:"",
    firstName:"",
    lastName:"",
    PhoneNumber:""
  }),
    {navigation} = props,
    dispatch = useDispatch(),
    [screenSwitchPre, setScreenSwitchPreText] = useState(
      "Don't have an account?",
    ),
    [forgot,setforgot] = useState({
      modalvisible:false,
      email:""
    }),
    [screenSwitchButton, setScreenSwitchButtonText] = useState('Register'),
    {top} = useSafeAreaInsets(),
    registerHeight = useRef(new Animated.Value(0)).current,
    {email,password,firstName,lastName,PhoneNumber} = localState
    ;

  const background = require('../assets/images/login-background.png');
  const logo = require('../assets/images/login-logo.png');

  useEffect(() => {
    GoogleSignin.configure({
      webClientId,
      scopes: ['profile', 'email']
    });

    navigation.addListener('focus',function(){
      setState({
        firstName:"",
        email:"",
        lastName:"",
        PhoneNumber:"",
        password:""
      })

      setScreenSwitchButtonText("Register")
    })
  },[]);

  const validateEmail = () => {
    const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return reg.test(email);
  };

  const validateForgot = () => {
    const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return reg.test(forgot.email);
  }

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

   setState({
     ...localState,
     PhoneNumber:newVal
   })
  };

  const changeScreens = () => {
    setState({
      email:"",
      firstName:"",
      lastName:"",
      password:"",
      PhoneNumber:""
    })
    if (screenSwitchButton === 'Register') {
      Animated.timing(registerHeight, {
        toValue: Dimensions.get('window').height / 2,
        duration: 350,
        useNativeDriver: false,
      }).start();

      setScreenSwitchButtonText('Log In');
      setScreenSwitchPreText('Already have an account?');
    } else {
      Animated.timing(registerHeight, {
        toValue: 0,
        useNativeDriver: false,
      }).start();

      setScreenSwitchButtonText('Register');
      setScreenSwitchPreText("Don't have an account?");
    }
  };

  const updateLoginDate = async (_email) => {
    await firestore()
      .collection('Users')
      .doc(_email)
      .set(
        {
          Name: _email,
          LastLogin: new Date(),
        },
        {merge: true},
      )
      .then(async () => {
        let date = moment().format('dddd, MMMM Do');

        await firestore()
          .collection('Users')
          .doc(_email)
          .collection('LoginDates')
          .doc(date)
          .set(
            {
              LoginDate: date,
            },
            {
              merge: true,
            },
          );
      })
      .catch((error) => {
        console.log(
          `An error occured while setting user's most recent login date. ${error}`,
        );
        dispatch(authActions.setAccountLoading(false));
      });
  };

  const getUserData = async (_email, _provider) => {
    
    await firestore()
      .collection('Users')
      .doc(_email)
      .get()
      .then((data) => {
        const {
          Anonymous,
          FirstName,
          LastName,
          LastLogin,
          Name,
          PhoneNumber,
        } = data._data;

        const user = {
          Anonymous,
          FirstName,
          LastName,
          LastLogin,
          Name,
          PhoneNumber,
          Email: _email,
          Provider: _provider,
        };

        dispatch(authActions.setAccountLoading(false));
        dispatch(authActions.updateAuthField({field: 'email', value: ''}));
        dispatch(authActions.updateAuthField({field: 'password', value: ''}));
        dispatch(authActions.setUser(user));
      })
      .catch((error) => {
        Alert.alert('Error getting user data');
        dispatch(authActions.setAccountLoading(false));
      });
  };

  const emailPassAuth = async () => {
    if (!validateEmail()) {
      Alert.alert('Please enter a valid email address');
    }
    else if(!password)
    {
      Alert.alert('Please input a password.');
    }
     else {
       if(screenSwitchButton != "Register")
       {
        signup()
        return;
       }
       
      dispatch(authActions.setAccountLoading(true));
      await auth()
        .signInWithEmailAndPassword(email, password)
        .then(async () => {
          // We need to update the user's last login date.
          await updateLoginDate(email);
          await getUserData(email, 'Traditional');
        })
        .catch((error) => {
          if (error.code === 'auth/user-not-found') {
            Alert.alert(
              'There is no user record corresponding to this identifier. The user may have been deleted.',
            );
          } else if (error.code === 'auth/network-request-failed') {
            Alert.alert(
              'Authentication timed out. Check your network connection and try again.',
            );
          } else if (error.code === 'auth/wrong-password') {
            Alert.alert(
              'The password is invalid or the user does not have a password.',
            );
          } else {
            Alert.alert(error.message);
          }
          dispatch(authActions.setAccountLoading(false));
        });
    }
  };

  const appleAuthentication = async () => {
    dispatch(authActions.setAccountLoading(true));

    const appleAuthRequestResponse = await appleAuth
      .performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      })
      .then(async () => {
        if (!appleAuthRequestResponse.identityToken) {
          dispatch(authActions.setAccountLoading(false));
          throw 'Apple Sign-In failed - no identify token returned';
        } else {
          // Create a Firebase credential from the response
          const {identityToken, nonce} = appleAuthRequestResponse;
          const appleCredential = auth.AppleAuthProvider.credential(
            identityToken,
            nonce,
          );

          // Sign the user in with the credential
          return auth()
            .signInWithCredential(appleCredential)
            .then(async (authResult) => {
              const {profile} = authResult.additionalUserInfo;
              await updateLoginDate(profile.email);
              await getUserData(profile.email, 'Apple');
            })
            .catch(() => {
              dispatch(authActions.setAccountLoading(false));
              console.log('Error while attempting to sign in with Apple.');
              Alert.alert(
                'Something went wrong while attempting to authenticate with the Apple authentication credential provided.',
              );
            });
        }
      })
      .catch(() => {
        dispatch(authActions.setAccountLoading(false));
      });
  };

  const facebookAuth = async () => {
    dispatch(authActions.setAccountLoading(true));

    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);

    if (result.isCancelled) {
      dispatch(authActions.setAccountLoading(false));
      console.log('user cancelled login');
    } else {
      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        dispatch(authActions.setAccountLoading(false));
        throw 'Something went wrong obtaining access token';
      } else {
        // Create a Firebase credential with the AccessToken
        const facebookCredential = auth.FacebookAuthProvider.credential(
          data.accessToken,
        );

        // Sign-in the user with the credential
        auth()
          .signInWithCredential(facebookCredential)
          .then(async (authResult) => {
            const {profile} = authResult.additionalUserInfo;
            await updateLoginDate(profile.email);
            await getUserData(profile.email, 'Facebook');
          })
          .catch((error) => {
            console.log(
              'Error while attempting to sign in with facebook credential.',
            );
            Alert.alert(
              'Something went wrong while attempting to authenticate with the Facebook authentication credential provided.',
            );
          });
      }
    }
  };

  const googleAuth = async () => {
    
    dispatch(authActions.setAccountLoading(true));
    //await GoogleSignin.hasPlayServices({autoResolve:true,showPlayServicesUpdateDialog: true})
    await GoogleSignin.signIn()
      .then(async ({idToken}) => {
        if (idToken !== undefined) {
          const googleCredential = auth.GoogleAuthProvider.credential(idToken);

          await auth()
            .signInWithCredential(googleCredential)
            .then(async (authResult) => {
              // console.log(result);

              const {profile} = authResult.additionalUserInfo;

              await updateLoginDate(profile.email);
              await getUserData(profile.email, 'Google');
            })
            .catch((error) => {
              dispatch(authActions.setAccountLoading(false));
              console.log(
                'Error while attempting to sign in with Google credential.',
                error,
              );
              Alert.alert(
                'Something went wrong while attempting to authenticate with the Google authentication credential provided.',
              );
            });
        } else {
          dispatch(authActions.setAccountLoading(false));
        }
      })
      .catch((err) => {
        console.log('err',err.message)
        dispatch(authActions.setAccountLoading(false));
      });
  };

  const confirmReset = () => {
    if (email === '') {
      Alert.alert('Please enter your email address and try again.');
    } else {
      Alert.alert(
        'Confirm',
        'Are you sure you would like to reset your password?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              resetPassword();
            },
          },
        ],
        {cancelable: false},
      );
    }
  };

  const resetPassword = async () => {
    if(!forgot.email)
    {
      Alert.alert('Please enter email address');
      return;
    }
    else if(!validateForgot(forgot.email))
    {
      Alert.alert('Email address is not valid');
      return;
    } 
    dispatch(authActions.setAccountLoading(true));

    await auth()
      .sendPasswordResetEmail(forgot.email)
      .then(() => {
        dispatch(authActions.setAccountLoading(false));
        setforgot({
          email:"",
          modalvisible:false
        })
        Alert.alert(
          'A password reset email has been sent to the provided email address.',
        );
      })
      .catch((error) => {
        dispatch(authActions.setAccountLoading(false));
        
        if (error.code === 'auth/user-not-found') {
          Alert.alert(
            'There is no user record corresponding to this email. The user may have been deleted.',
          );
        }
        console.log(error);
        console.log('Error while attempting to send reset password.', error);
      });
  };

  const signup = async() => {
    dispatch(authActions.setAccountLoading(true));

    await auth().createUserWithEmailAndPassword(email,password).then(res=>{
      firestore().collection('Users').doc(email).set({
        PhoneNumber,
        FirstName:firstName,
        LastLogin:new Date(),
        LastName:lastName,
        Name: firstName + " " + lastName
      }).then(result=>{
        dispatch(authActions.setAccountLoading(false));
        changeScreens();
      }).catch(err=>{
        dispatch(authActions.setAccountLoading(false));
      })
    })
  }
 
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Image
        style={styles.backgroundImage}
        source={background}
        resizeMode="cover"
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          paddingBottom: 148,
          paddingTop: top,
        }}
        showsVerticalScrollIndicator={false}>
        <StatusBar barStyle="dark-content" />

        <Image style={styles.logo} source={logo} resizeMode="contain" />

        <Animated.View style={{maxHeight: registerHeight, overflow: 'hidden'}}>
          <TextInput
            placeholder="First Name"
            placeholderTextColor="rgba(0,0,0,.5)"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            value={localState.firstName}
            onChangeText={(value) =>
              setState({
                ...localState,
                firstName:value
              })
            }
            onSubmitEditing={() => Keyboard.dismiss()}
          />

          <TextInput
            placeholder="Last Name"
            placeholderTextColor="rgba(0,0,0,.5)"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            value={localState.lastName}
            onChangeText={(value) =>
              setState({
                ...localState,
                lastName:value
              })
            }
            onSubmitEditing={() => Keyboard.dismiss()}
          />

          <TextInput
            dataDetectorTypes="PhoneNumber"
            style={styles.input}
            placeholder={'Phone Number'}
            placeholderTextColor="rgba(0,0,0,.5)"
            onChangeText={(value) => formatPhoneNumber(value)}
            keyboardType="phone-pad"
            onSubmitEditing={() => Keyboard.dismiss()}
            value={localState.PhoneNumber}
            maxLength={14}
          />
        </Animated.View>

        <TextInput
          placeholder="Email Address"
          placeholderTextColor="rgba(0,0,0,.5)"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          keyboardType="email-address"
          value={localState.email}
          onChangeText={(value) =>
            setState({
              ...localState,
              email:value
            })
          }
          onSubmitEditing={() => Keyboard.dismiss()}
        />

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Password"
            placeholderTextColor="rgba(0,0,0,.5)"
            autoCapitalize="none"
            secureTextEntry={true}
            textContentType={
              screenSwitchButton === 'Register' ? 'newPassword' : 'password'
            }
            passwordRules="required: lower; required: upper; required: digit; minlength: 12;"
            style={[styles.input, {paddingRight: 36}]}
            value={localState.password}
            onChangeText={(value) =>
              setState({
                ...localState,
                password:value
              })
            }
            onSubmitEditing={() => Keyboard.dismiss()}
          />

          
        </View>

        <TouchableOpacity
          onPress={() => emailPassAuth()}
          style={[styles.button, {backgroundColor: '#EB237D'}]}>
          <Text style={[styles.buttonText, {color: 'white'}]}>{screenSwitchButton == 'Register'?'Sign In':"Sign Up"}</Text>
        </TouchableOpacity>
        <View style={styles.registerContainer}>
          {screenSwitchButton == 'Register' ? (
            <TouchableOpacity
              onPress={() => setforgot({
                ...forgot,
                modalvisible:true
              })}
              >
              <Text style={styles.registerButtonText}>Forgot Password</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>{screenSwitchPre}</Text>

          <TouchableOpacity onPress={() => changeScreens()}>
            <Text style={styles.registerButtonText}>{screenSwitchButton}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.thirdPartySeparator} />

        <View style={styles.thirdPartyButtonContainer}>
          {Platform.OS === 'ios' && (
            <TouchableOpacity
              onPress={() => appleAuthentication()}
              style={styles.thirdPartyButton}>
              <LinearGradient
                colors={['#e6e6e6', '#f0f0f0']}
                style={styles.buttonGradient}
                useAngle={true}
                angle={245}
              />
              <FontAwesomeIcon
                style={styles.thirdPartyAuthIcon}
                icon={faApple}
              />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => facebookAuth()}
            style={styles.thirdPartyButton}>
            <LinearGradient
              colors={['#e6e6e6', '#f0f0f0']}
              style={styles.buttonGradient}
              useAngle={true}
              angle={245}
            />
            <FontAwesomeIcon
              style={styles.thirdPartyAuthIcon}
              icon={faFacebookF}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => googleAuth()}
            style={styles.thirdPartyButton}>
            <LinearGradient
              colors={['#e6e6e6', '#f0f0f0']}
              style={styles.buttonGradient}
              useAngle={true}
              angle={245}
            />
            <FontAwesomeIcon
              style={styles.thirdPartyAuthIcon}
              icon={faGoogle}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal isVisible={forgot.modalvisible} onBackdropPress={()=>setforgot({...forgot,modalvisible:false})}>
        <View style={styles.modalInside}>
          <TextInput
              placeholder="Email Address"
              placeholderTextColor="rgba(0,0,0,.5)"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
              keyboardType="email-address"
              value={forgot.email}
              onChangeText={(value) =>
                setforgot({
                  ...forgot,
                  email:value
                })
              }
              onSubmitEditing={() => Keyboard.dismiss()}
            />
            <TouchableOpacity
              onPress={() => resetPassword()}
              style={[styles.button, {backgroundColor: '#EB237D'}]}>
              <Text style={[styles.buttonText, {color: 'white'}]}>Send</Text>
            </TouchableOpacity>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default LoginForm;
