import React, {useEffect, useRef} from 'react';
import {View, Animated,StatusBar} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import LottieView from 'lottie-react-native';
import LoginForm from '../components/LoginForm';
import UserDetail from '../components/UserDetail';
import loaderStyles from '../styles/loader';
import * as AccountAction from '../containers/AuthContainer/actions';
import { useState } from 'react';

const Account = (props) => {
  const {navigation} = props,
    {user, loading} = useSelector((state) => state.auth),
    dispatch = useDispatch(),
    opacity = useRef(new Animated.Value(0)).current,
    [update,setupdate] = useState(false)
    ;

  useEffect(() => {
    if (loading) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }).start();
    }
  }, [loading]);

  useEffect(()=>{
    navigation.addListener('focus',function(){
      console.log('routename',navigation.state);
      // if(navigation.state.routename == 'Account')
      // {
      //   StatusBar.setBackgroundColor('#3274F4');
      // }
      dispatch(AccountAction.setupdate());
    })
  },[])
  //StatusBar.setBackgroundColor('#3274F4');
  return (
    <View style={{flex:1}}>
      {user === undefined ? <LoginForm navigation={navigation}/> : <UserDetail/>}

      <Animated.View
        style={[
          loaderStyles.loaderContainer,
          {opacity, zIndex: loading ? 99999 : -1},
        ]}>
        <LottieView
          autoPlay
          style={loaderStyles.loader}
          source={require('../assets/animations/loader.json')}
        />
      </Animated.View>
    </View>
  );
};

export default Account;
