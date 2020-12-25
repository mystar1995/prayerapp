import React, {useEffect, useState, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {View, Text, Animated, TouchableOpacity, Alert} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import styles from '../styles/prayerRequests';
import * as requestActions from '../containers/RequestsContainer/actions';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {faEllipsisH} from '@fortawesome/pro-light-svg-icons';
import Modal,{} from 'react-native-modal';
import { faChevronDown, faChevronUp } from '@fortawesome/pro-solid-svg-icons';

const PrayerRequestCell = (props) => {
  const {item} = props.request,
    {
      Content,
      Fulfillment,
      Title,
      User,
      Reputation,
      FirstName,
      key,
    } = item,
    {user} = useSelector((state) => state.auth),
    [open, setOpen] = useState(false),
    rowHeight = useRef(new Animated.Value(0)).current,
    rowOpacity = useRef(new Animated.Value(0)).current,
    rowMargin = useRef(new Animated.Value(0)).current,
    AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity),
    dispatch = useDispatch();

  useEffect(() => {
    if (open) {
      Animated.parallel([
        Animated.spring(rowHeight, {
          toValue: 55,
          useNativeDriver: false,
        }),
        Animated.spring(rowMargin, {
          toValue: 12,
          useNativeDriver: false,
        }),
        Animated.spring(rowOpacity, {
          toValue: 1,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(rowHeight, {
          toValue: 0,
          useNativeDriver: false,
        }),
        Animated.spring(rowMargin, {
          toValue: 0,
          useNativeDriver: false,
        }),
        Animated.spring(rowOpacity, {
          toValue: 0,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [open, rowHeight, rowOpacity]);

  const fulfillPrayer = async () => {
    console.log(`FULFILLING PRAYER ${key}`);
    // Check if user is logged in prior to fulfilling.
    if (user === undefined) {
      Alert.alert(
        'Error',
        'You must be signed in in order to fulfill a prayer request',
      );
    } else if (user.Email === User) {
      Alert.alert('Error', 'You cannot fulfill your own prayer request.');
    } else {
      dispatch(requestActions.setLoading(true));

      await firestore()
        .collection('PrayerRequests')
        .doc(key)
        .collection('FulfilledBy')
        .doc(user.Email)
        .get()
        .then(async (fulfilledByDocument) => {
          let enable = false;
          if (fulfilledByDocument.exists) {
            Alert.alert('Error', 'You have already fulfilled this request');
            dispatch(requestActions.setLoading(false));
          } else {
            await firestore()
              .collection('PrayerRequests')
              .doc(key)
              .collection('FulfilledBy')
              .doc(user.Email)
              .set({})
              .then(async () => {
                const increment = firestore.FieldValue.increment(1);

                await firestore()
                  .collection('PrayerRequests')
                  .doc(key)
                  .update({
                    Fulfillment:  Number(Fulfillment) + 1,
                  })
                  .then(async () => {
                    // We need to update this requests fulfillment value in our store.
                    await firestore()
                      .collection('Users')
                      .doc(user.Email)
                      .collection('FulfilledPrayers')
                      .doc(key)
                      .set({
                        FulfilledOn: new Date(),
                      })
                      .then(() => {
                        dispatch(
                          requestActions.updatePrayerRequest({
                            key,
                            field: 'Fulfillment',
                            value: Number(Fulfillment) + 1,
                          }),
                        );
                        dispatch(requestActions.setLoading(false));
                      })
                      .catch((error) => {
                        console.log(
                          "Something went wrong while attempting to add this to the user's fulfilled prayer requests.",error
                        );
                        dispatch(requestActions.setLoading(false));
                      });

                    // Almost there on clearing loading state.
                    //dispatch(requestActions.setLoading(false));
                  })
                  .catch((error) => {
                    console.log(
                      'Something went wrong while attempting to increment the fulfillment value.',
                      error,
                    );
                    dispatch(requestActions.setLoading(false));
                  });
              })
              .catch((error) => {
                // something went wrong while attempting to add a fulfilled by record.
                console.log(
                  'Something went wrong while attempting to add a fulfilled by record.',
                  error,
                );
                dispatch(requestActions.setLoading(false));
              });
          }
        })
        .catch((error) => {
          // something went wrong while attempting to find users who have fulfilled the request.
          dispatch(requestActions.setLoading(false));
        });
    }
  };

  const deleteitem = () => {

  }

  if (Reputation === undefined || Reputation < 5) {
    return (
      <AnimatedTouchable
        style={[styles.requestCell]}
        onPress={() => setOpen(!open)}>
        <View style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
            <Text style={styles.requestTitle}>{Title}</Text>
            <FontAwesomeIcon icon={open?faChevronUp:faChevronDown} size={24} color="#888"></FontAwesomeIcon>
        </View>
        

        <Animated.View style={[{maxHeight: rowHeight, opacity: rowOpacity}]}>
          <Text style={styles.requestDate}>
            {typeof item.Date === 'object'
              ? moment(new Date(item.Date._seconds * 1000)).format('dddd, MMMM Do')
              : item.Date}
          </Text>
          <Text style={styles.requestPerson}>{FirstName}</Text>
        </Animated.View>

        <Text style={styles.prayerContent}>
          {open
            ? Content
            : Content.length > 35
            ? Content.substring(0, 32).replace(/\s?$/, '...')
            : Content}
        </Text>

        <Animated.View
          style={[
            styles.row,
            {maxHeight: rowHeight, opacity: rowOpacity, marginTop: rowMargin},
          ]}>
            {
              (user && user.Email != User) && (
                <TouchableOpacity
                style={[styles.fulfillRequestButton, {backgroundColor: '#EB237D'}]}
                onPress={() => {
                  fulfillPrayer();
                }}>
                <Text style={[styles.fulfillRequestButtonText, {color: 'white'}]}>
                  Fulfill Prayer
                </Text>
              </TouchableOpacity>
              )
            }
          
          <Text style={[styles.fulfillmentCount,{marginLeft:props.deleteitem?0:'auto'}]}>{`${Fulfillment} Prayer${
            Fulfillment > 1 ? 's' : ''
          }`}</Text>
          {
            (user && user.Email == User && props.deleteitem) && (
              <TouchableOpacity
              style={{backgroundColor:'#DDD',borderRadius:100,width:30,height:30,justifyContent:'center',alignItems:'center'}}
              onPress={() => {
                props.deleteitem(key);
              }}>
              <FontAwesomeIcon icon={faEllipsisH}></FontAwesomeIcon>
            </TouchableOpacity>
            )
          }

          
           
        </Animated.View>
      </AnimatedTouchable>
    );
  } else {
    return null;
  }
};

export default PrayerRequestCell;
