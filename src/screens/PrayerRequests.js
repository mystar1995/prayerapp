import React, {useCallback, useEffect, useState, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  Animated,
  View,
  Text,
  StatusBar,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import _ from 'lodash';
import {SafeAreaView} from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import Geolocation from '@react-native-community/geolocation';
import Slider from '@react-native-community/slider';
import LottieView from 'lottie-react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPlus} from '@fortawesome/pro-regular-svg-icons';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {faFilter} from '@fortawesome/pro-solid-svg-icons';
import axios from 'axios';
import * as requestActions from '../containers/RequestsContainer/actions';
import PrayerRequestCell from '../components/PrayerRequestCell';
import NewPrayerRequest from '../components/NewPrayerRequest';
import styles from '../styles/prayerRequests';
import loaderStyles from '../styles/loader';

const PrayerRequests = (props) => {

  const [offset,setOffset] = useState(0);

  const flatlist = useRef(null);

  const {navigation} = props,
    {
      filterDistance,
      endOfRequests,
      prayerRequests,
      newPrayerRequest,
      loading,
    } = useSelector((state) => state.request),
    {Content, Title} = newPrayerRequest,
    {user} = useSelector((state) => state.auth),
    dispatch = useDispatch(),
    opacity = useRef(new Animated.Value(0)).current,
    filterHeight = useRef(new Animated.Value(0)).current,
    filterOpacity = useRef(new Animated.Value(0)).current,
    [lastDoc, setLastDoc] = useState(undefined),
    [refreshing, setRefreshing] = useState(false),
    [filterBarOpen, setFilterBarOpen] = useState(false);

  const background = require('../assets/images/login-background.png');

  const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

  const getBoundCoorindates = (location) => {
    const {lat, lng} = location,
      dorad = filterDistance / 3958.762079,
      deg2rad = Math.PI / 180,
      rad2deg = 180 / Math.PI,
      minLat = lat - dorad * rad2deg,
      maxLat = lat + dorad * rad2deg,
      minLng = lng + (dorad / Math.cos(lat * deg2rad)) * rad2deg,
      maxLng = lng - (dorad / Math.cos(lat * deg2rad)) * rad2deg;

    return {
      minLat,
      minLng,
      maxLat,
      maxLng,
    };
  };

  useEffect(() => {
    if (filterDistance > 0) {
      const getRequests = async () => {
        dispatch(requestActions.setLoading(true));

        await Geolocation.getCurrentPosition(
          async (position) => {
            const {latitude, longitude} = position.coords,
              userLocation = {lat: latitude, lng: longitude},
              bounds = getBoundCoorindates(userLocation);

            await axios
              .post(
                'https://us-central1-prayer-app-v2.cloudfunctions.net/geoQuery',
                {
                  maxLat: bounds.maxLat,
                  maxLng: bounds.maxLng,
                  minLat: bounds.minLat,
                  minLng: bounds.minLng,
                  limit: 10,
                  offset: prayerRequests.length,
                },
                {
                  headers: {
                    'Content-Type': 'application/json',
                  },
                },
              )
              .then(async (response) => {
                const {data} = response,
                  remoteRequests = [];

                _.forEach(data, async (document) => {
                  console.log(document);

                  remoteRequests.push({
                    ...document,
                    // Date: document.Date,
                    key: document.Id,
                  });
                });

                dispatch(requestActions.setEndOfRequests(data.length < 10));
                dispatch(requestActions.setPrayerRequests(remoteRequests));
                dispatch(requestActions.setLoading(false));
              })
              .catch((error) => {
                console.log(
                  'Error while attempting to fetch prayer requests by location proximity. Error details: ',
                  error,
                );
              });
          },
          (error) => {
            dispatch(requestActions.setLoading(false));
          },
          {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
        );
      };

      getRequests();
    } else {
      const getRequests = async () => {
        dispatch(requestActions.setLoading(true));

        await firestore()
          .collection('PrayerRequests')
          .orderBy('Date', 'desc')
          .limit(10)
          .get()
          .then((snapshot) => {
            const remoteRequests = [];

            snapshot.forEach((documentSnapshot) => {
              remoteRequests.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
              });

              setLastDoc(documentSnapshot);
            });

            dispatch(
              requestActions.setEndOfRequests(snapshot.docs.length < 10),
            );
            dispatch(requestActions.setPrayerRequests(remoteRequests));
            dispatch(requestActions.setLoading(false));
          });
      };

      getRequests();
    }
  }, [filterDistance]);

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


  const refreshRequests = async () => {
    dispatch(requestActions.setLoading(true));
    setRefreshing(true);

    if (filterDistance > 0) {
      await Geolocation.getCurrentPosition(
        async (position) => {
          const {latitude, longitude} = position.coords,
            userLocation = {lat: latitude, lng: longitude},
            bounds = getBoundCoorindates(userLocation);

          await axios
            .post(
              'https://us-central1-prayer-app-v2.cloudfunctions.net/geoQuery',
              {
                maxLat: bounds.maxLat,
                maxLng: bounds.maxLng,
                minLat: bounds.minLat,
                minLng: bounds.minLng,
                limit: 10,
                offset: 0,
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              },
            )
            .then(async (response) => {
              const {data} = response,
                remoteRequests = [];

              _.forEach(data, async (document) => {
                remoteRequests.push({
                  ...document,
                  Date: document.jsDate,
                  key: document.Id,
                });
              });

              dispatch(requestActions.setEndOfRequests(data.length < 10));
              dispatch(requestActions.setPrayerRequests(remoteRequests));
              setRefreshing(false);
              dispatch(requestActions.setLoading(false));
            })
            .catch((error) => {
              console.log(
                'Error while attempting to fetch prayer requests by location proximity. Error details: ',
                error,
              );
            });
        },
        (error) => {
          dispatch(requestActions.setLoading(false));
          setRefreshing(false);
        },
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
      );
    } else {
      await firestore()
        .collection('PrayerRequests')
        .orderBy('Date', 'desc')
        .limit(10)
        .get()
        .then((snapshot) => {
          const remoteRequests = [];

          snapshot.forEach((documentSnapshot) => {
            remoteRequests.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });

            setLastDoc(documentSnapshot);
          });

          dispatch(requestActions.setEndOfRequests(snapshot.docs.length < 10));
          dispatch(requestActions.setPrayerRequests(remoteRequests));
        });

      setRefreshing(false);
      dispatch(requestActions.setLoading(false));
    }
  };

  const loadPrayerRequests = async () => {
    if (!endOfRequests) {
      dispatch(requestActions.setLoading(true));

      if (filterDistance > 0) {
        await Geolocation.getCurrentPosition(
          async (position) => {
            const {latitude, longitude} = position.coords,
              userLocation = {lat: latitude, lng: longitude},
              bounds = getBoundCoorindates(userLocation);

            await axios
              .post(
                'https://us-central1-prayer-app-v2.cloudfunctions.net/geoQuery',
                {
                  maxLat: bounds.maxLat,
                  maxLng: bounds.maxLng,
                  minLat: bounds.minLat,
                  minLng: bounds.minLng,
                  limit: 10,
                  offset: prayerRequests.length,
                },
                {
                  headers: {
                    'Content-Type': 'application/json',
                  },
                },
              )
              .then(async (response) => {
                const {data} = response,
                  remoteRequests = [];

                _.forEach(data, async (document) => {
                  remoteRequests.push({
                    ...document,
                    Date: document.jsDate,
                    key: document.Id,
                  });
                });

                dispatch(requestActions.setEndOfRequests(data.length < 10));
                dispatch(requestActions.setPrayerRequests(remoteRequests));
                dispatch(requestActions.setLoading(false));
              })
              .catch((error) => {
                console.log(
                  'Error while attempting to fetch prayer requests by location proximity. Error details: ',
                  error,
                );
              });
          },
          (error) => {
            dispatch(requestActions.setLoading(false));
          },
          {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
        );
      } else {
        await firestore()
          .collection('PrayerRequests')
          .orderBy('Date', 'Desc')
          .startAfter(lastDoc)
          .limit(10)
          .get()
          .then((snapshot) => {
            const requests = [...prayerRequests];

            snapshot.forEach((documentSnapshot) => {
              requests.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
              });

              setLastDoc(documentSnapshot);
            });

            dispatch(
              requestActions.setEndOfRequests(snapshot.docs.length < 10),
            );
            dispatch(requestActions.setPrayerRequests(requests));
            dispatch(requestActions.setLoading(false));
          });
      }
    }
  };

  const createNewPrayerRequest = useCallback(async () => {
    
    await firestore()
      .collection('PrayerRequests')
      .add({
        Content,
        Title,
        Date: new Date(),
        Fulfillment: 1,
        User: user.Email
      })
      .then(() => {
        // We need to inject this request at the top of our list.
        const requests = [
          {
            Content,
            Title,
            Date: {_seconds:new Date().getTime()/1000},
            Fulfillment: 1,
            User: user.Email,
            key: new Date().toISOString(),
          },
          ...prayerRequests,
        ];

        dispatch(requestActions.setPrayerRequests(requests));
        dispatch(requestActions.setLoading(false));
        dispatch(requestActions.resetPrayerRequest());
      })
    // await Geolocation.getCurrentPosition(
    //   async (position) => {
    //     const {latitude, longitude} = position.coords;
    //     dispatch(requestActions.setLoading(true));
        
    //       .catch((error) => {
    //         dispatch(requestActions.setLoading(false));
    //         console.log('Error creating prayer request', error.message);
    //       });
    //   },
    //   (error) => {
    //     console.log('Error creating prayer request', error.message);
    //     dispatch(requestActions.setLoading(false));
    //   },
    //   {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    // );
  }, [Content, Title, dispatch, prayerRequests, user]);

  const renderHeader = () => {
    return (
      <Animated.View
        style={[
          styles.row,
          {
            marginBottom: 12,
            flexWrap: 'wrap',
            marginTop:Platform.OS === 'ios'
                          ? getStatusBarHeight()
                          : StatusBar.currentHeight,
          },
        ]}>
        
        <Text style={styles.pageHeader}>Prayer Requests </Text>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => toggleFilterBar()}>
          <FontAwesomeIcon
            icon={faFilter}
            size={14}
            style={styles.filterIcon}
          />
        </TouchableOpacity>

        <Animated.View
          style={[
            styles.sliderContainer,
            {height: filterHeight, opacity: filterOpacity},
          ]}>
          <Slider
            step={25}
            minimumValue={0}
            maximumValue={1250}
            minimumTrackTintColor="#EB237D"
            maximumTrackTintColor="#e3e3e3"
            thumbTintColor="#EB237D"
            value={filterDistance}
            onSlidingComplete={(value) => {
              dispatch(requestActions.setFilterDistance(value));
            }}
          />

          <Text style={styles.filterText}>{filterDistance} miles</Text>
        </Animated.View>
      </Animated.View>
    );
  };

  const renderFooter = () => {
    if (endOfRequests) {
      return (
        <View style={styles.endOfRequests}>
          <Text style={styles.endOfRequestsText}>End of requests</Text>
          <Text style={styles.endOfRequestsText}>
            {user === undefined
              ? 'Log in to create new requests.'
              : 'Press + to submit a new request.'}
          </Text>
        </View>
      );
    } else {
      return <View />;
    }
  };

  const toggleFilterBar = () => {
    if (filterBarOpen) {
      setFilterBarOpen(false);
      Animated.parallel([
        Animated.timing(filterHeight, {
          toValue: 0,
          useNativeDriver: false,
        }),
        Animated.timing(filterOpacity, {
          toValue: 0,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      setFilterBarOpen(true);
      Animated.parallel([
        Animated.timing(filterHeight, {
          toValue: 80,
          useNativeDriver: false,
        }),
        Animated.timing(filterOpacity, {
          toValue: 1,
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  const handleScroll = (e) => {
    console.log('event',e.nativeEvent.contentOffset.y);
    setOffset(e.nativeEvent.contentOffset.y);
  }

  return (
    <View style={styles.container}>
      <Image
        style={styles.backgroundImage}
        source={background}
        resizeMode="cover"
      />

      <SafeAreaView>
        <Animated.FlatList
          ref={flatlist}
          data={prayerRequests}
          ListHeaderComponent={renderHeader()}
          removeClippedSubviews={false}
          contentContainerStyle={{paddingBottom: 96}}
          showsVerticalScrollIndicator={false}
          renderItem={(item) => <PrayerRequestCell request={item} />}
          keyExtractor={(item) => item.key}
          refreshing={refreshing}
          onRefresh={() => refreshRequests()}
          onScroll={handleScroll}
          onEndReached={() => loadPrayerRequests()}
          onEndReachedThreshold={0.1}
          ListFooterComponent={() => renderFooter()}
        />
      </SafeAreaView>

      {user !== undefined && (
        <TouchableOpacity
          onPress={() => {
            dispatch(requestActions.setRequestModalVisible(true));
          }}
          style={[styles.newPrayerRequestButton, {backgroundColor: '#EB237D'}]}>
          <FontAwesomeIcon color="white" icon={faPlus} />
        </TouchableOpacity>
      )}

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

      <NewPrayerRequest _callback={() => createNewPrayerRequest()} />
    </View>
  );
};

export default PrayerRequests;
