import React, {useEffect, useRef, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Animated,
  StatusBar,
  Platform,
  Share,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faQuoteRight,
  faQuoteLeft,
  faShareAlt,
  faHeart,
} from '@fortawesome/pro-solid-svg-icons';
import {faHeart as faHeartAlt} from '@fortawesome/pro-light-svg-icons';
import moment from 'moment';
import * as prayerActions from '../containers/PrayerContainer/actions';
import styles from '../styles/home';
import LazyImage from '../components/LazyImage';
import loaderStyles from '../styles/loader';
import LottieView from 'lottie-react-native';

const Home = (props) => {
  const {navigation} = props,
    {dailyPrayer, dailyPrayerLoading} = useSelector((state) => state.prayer),
    {user} = useSelector((state) => state.auth),
    dispatch = useDispatch(),
    [favourite,setfavourite] = useState(false),
    opacity = useRef(new Animated.Value(0)).current,
    loadingopacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const currentDay = moment().format('dddd');

    const getDailyPrayer = async () => {
      await firestore()
        .collection('DailyPrayers')
        .where('DOW', '==', currentDay)
        .get()
        .then(async(data) => {
          await data.docs.forEach(async(doc) => {
            const {Image, PrayerText} = doc._data;
            console.log(PrayerText);
            
            if(user)
            {
              await firestore().collection('Users').doc(user.Email).collection('FavoritePrayers').doc(doc.id).get().then(favourite=>{
                dispatch(
                  prayerActions.setDailyPrayer({
                    Image,
                    PrayerText,
                    id: doc.id,
                    favourite:favourite.exists
                  }),
                );
                
              }).catch(err=>{
                dispatch(
                  prayerActions.setDailyPrayer({
                    Image,
                    PrayerText,
                    id: doc.id,
                    favourite:false
                  }),
                );
              })
            }
            else
            {
              dispatch(
                prayerActions.setDailyPrayer({
                  Image,
                  PrayerText,
                  id: doc.id,
                  favourite:false
                }),
              );
            }
            
          });
        });
    };

    getDailyPrayer().then(() => {
      dispatch(prayerActions.setDailyPrayerLoading(false));

      Animated.timing(opacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }).start();
    });
  }, []);



  useEffect(() => {
    if (dailyPrayerLoading) {
      Animated.timing(loadingopacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(loadingopacity, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }).start();
    }
  }, [dailyPrayerLoading]);

  const favoritePrayer = async () => {
    dispatch(prayerActions.setDailyPrayerLoading(true));

    const date = moment().format('dddd, MMMM Do');
    console.log('email',user.Email);
    if(dailyPrayer.favourite)
    {
      await firestore().collection('Users').doc(user.Email).collection('FavoritePrayers').doc(dailyPrayer.id).delete().then(()=>{
        dispatch(prayerActions.setDailyPrayerLoading(false));
        dispatch(prayerActions.setDailyPrayer({...dailyPrayer,favourite:false}))
      }).catch((err)=>{
        console.log(err);
        dispatch(prayerActions.setDailyPrayerLoading(false));
      })
    }
    else
    {
      await firestore()
      .collection('Users')
      .doc(user.Email)
      .collection('FavoritePrayers')
      .doc(dailyPrayer.id)
      .set(
        {
          FavoritedOn: date,
        },
        {
          merge: true,
        },
      )
      .then(() => {
        dispatch(prayerActions.setDailyPrayer({...dailyPrayer,favourite:true}))
        dispatch(prayerActions.setDailyPrayerLoading(false));
      })
      .catch((error) => {
        console.log(`Error favoriting prayer ${error}`);
        dispatch(prayerActions.setDailyPrayerLoading(false));
      });
    }
    
  };

  const breakLines = (text) => {
    return text.replace(/(\\n)/g, '\n');
  };

  const shareDailyPrayer = async () => {
    try {
      let result;

      if (Platform.OS !== 'android') {
        result = await Share.share({
          message: `Today's Daily Prayer:\n${breakLines(
            dailyPrayer.PrayerText,
          )}`,
          url:
            'https://apps.apple.com/us/app/return-oh-jesus/id1439099710?ls=1',
        });
      } else {
        result = await Share.share({
          message: `Today's Daily Prayer:\n${breakLines(
            dailyPrayer.PrayerText,
          )}\n\nBrought to you by: https://play.google.com/store/apps/details?id=com.bitloft.prayerapp`,
        });
      }

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log(`Error when trying to share daily prayer${error}`);
    }
  };

  console.log('dailyprayer',dailyPrayer);

  return (
    <View style={styles.homeContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#EB237D"/>

      {dailyPrayer !== undefined && (
        <LazyImage
          style={styles.homeBackground}
          fullSource={{uri: dailyPrayer.Image}}
          thumbnailSource={{uri: dailyPrayer.Image}}
          resizeMode="cover"
        />
      )}

      <Animated.View style={[styles.darkenedBackground, {opacity}]} />

      {dailyPrayer !== undefined && (
        <Animated.View style={{opacity}}>
          <Text style={styles.dateText}>
            {moment().format('dddd, MMMM DD')}
          </Text>

          <View style={styles.homeContent}>
            <View style={styles.quote}>
              <View style={styles.leftLine} />
              <FontAwesomeIcon
                icon={faQuoteRight}
                size={24}
                style={styles.quoteIcon}
              />
              <View style={styles.rightLine} />
            </View>

            <ScrollView style={styles.scrollContainer}>
              <Text style={styles.prayerText}>{dailyPrayer.PrayerText}</Text>
            </ScrollView>

            <View style={styles.quote}>
              <View style={styles.leftLine} />
              <FontAwesomeIcon
                icon={faQuoteLeft}
                size={24}
                style={styles.quoteIcon}
              />
              <View style={styles.rightLine} />
            </View>
          </View>

          <View
            style={[
              styles.buttonContainer,
              {
                justifyContent: user === undefined ? 'center' : 'space-between',
              },
            ]}>
            <TouchableOpacity
              style={[styles.button, {backgroundColor: '#EB237D'}]}
              onPress={() => shareDailyPrayer()}>
              <FontAwesomeIcon
                icon={faShareAlt}
                size={20}
                style={styles.buttonIcon}
                color="white"
              />

              <Text style={[styles.buttonText, {color: 'white'}]}>Share</Text>
            </TouchableOpacity>

            {user !== undefined && (
              <TouchableOpacity
                style={[styles.button, {backgroundColor: 'white'}]}
                onPress={() => favoritePrayer(dailyPrayer.id)}>
                <FontAwesomeIcon
                  icon={dailyPrayer.favourite?faHeart:faHeartAlt}
                  size={20}
                  style={styles.buttonIcon}
                  color="#EB237D"
                />

                <Text style={[styles.buttonText, {color: '#EB237D'}]}>
                  Favorite
                </Text>
              </TouchableOpacity>
            )}
          </View>
          
        </Animated.View>
      )}
      <Animated.View
            style={[
              loaderStyles.loaderContainer,
              {opacity:loadingopacity, zIndex: dailyPrayerLoading ? 99999 : -1},
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

export default Home;
