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

const MyFullfilledPrayerCell = (props) => {
  const {item} = props.request,
    {
      Content,
      Fulfillment,
      Title,
      User,
      Date,
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
            {typeof Date === 'object'
              ? moment(Date.toDate()).format('dddd, MMMM Do')
              : Date}
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
                      
          <Text style={[styles.fulfillmentCount]}>{`${Fulfillment} Prayer${
            Fulfillment > 1 ? 's' : ''
          }`}</Text>
          {
            (user && props.deleteitem) && (
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

export default MyFullfilledPrayerCell;
