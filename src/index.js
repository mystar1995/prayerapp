import React from 'react';
import {AppRegistry, Animated, Image} from 'react-native';
import {Provider} from 'react-redux';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import {credentials, config} from './constants/firebase';
import styles from './styles/loadingStyles';
import AppNavigator from './navigator/index';
import configureStore from './store/configureStore';

const store = configureStore();

class Kernel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      appReady: false,
    };

    this.containerOpacity = new Animated.Value(1);
    this.logoOpacity = new Animated.Value(0);
    this.bump = new Animated.Value(0);

    this.background = require('./assets/images/loading-background.png');
    this.logo = require('./assets/images/cross-logo.png');
  }

  componentDidMount = async () => {
    await firebase.initializeApp(credentials, config);
  };

  checkPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  };

  animate = () => {
    Animated.timing(this.logoOpacity, {
      duration: 1550,
      toValue: 1,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(this.bump, {
          duration: 550,
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(this.logoOpacity, {
          duration: 550,
          toValue: 0,
          useNativeDriver: true,
        }),
      ]).start();
    }, 1850);

    setTimeout(() => {
      Animated.timing(this.containerOpacity, {
        duration: 550,
        toValue: 0,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        this.setState({
          appReady: true,
        });
      }, 350);
    }, 2250);
  };

  render() {
    var current_screen = (
      <Animated.View
        style={[styles.container, {opacity: this.containerOpacity}]}>
        <Image
          style={[styles.fullBackground]}
          source={this.background}
          resizeMode="cover"
          onLoad={() => this.animate()}
        />

        <Animated.Image
          source={this.logo}
          resizeMode="contain"
          style={[
            styles.loadingLogo,
            {
              opacity: this.logoOpacity,
              transform: [
                {
                  scale: this.bump.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 10],
                  }),
                },
              ],
            },
          ]}
        />
      </Animated.View>
    );

    if (this.state.appReady) {
      current_screen = <AppNavigator />;
    }

    return (
      <SafeAreaProvider>
        <Provider store={store}>{current_screen}</Provider>
      </SafeAreaProvider>
    );
  }
}

AppRegistry.registerComponent('ReturnOhJesus', () => Kernel);
