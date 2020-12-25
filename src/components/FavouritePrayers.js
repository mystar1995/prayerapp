import {ScrollView,View,Text,Animated} from 'react-native';
import React,{useState,useEffect,useRef} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import styles from '../styles/userDetail';
import LottieView from 'lottie-react-native';
import loaderStyles from '../styles/loader';
import * as requestActions from '../containers/RequestsContainer/actions';
import firestore from '@react-native-firebase/firestore';
import DailyPrayers from './DailyPrayers';

export default function FavouritePrayers()
{
    const flatlist = useRef(null);
    
    const {Email} = useSelector(state=>state.auth.user),
    {updatecomponent} = useSelector(state=>state.auth),
    {loading} = useSelector(state=>state.request),
    opacity = useRef(new Animated.Value(0)).current,
    dispatch = useDispatch();
    const [request,setrequest] = useState([]);
    const [update,setupdate] = useState(false);

    useEffect(()=>{
        
        dispatch(requestActions.setLoading(true));
        // firestore().collection("DailyPrayers").get().then(requestarray=>{
        //     let array = [];
        //     requestarray.forEach(item=>{
        //       array.push({
        //         id:item.id,
        //         ...item.data()
        //       })
        //     })
        //     dispatch(requestActions.setLoading(false));
        //     setrequest(array);
        //   })

        firestore().collection('Users').doc(Email).collection('FavoritePrayers').get().then(snapshot=>{
            console.log('aaaa',snapshot.docs.length);
            let idarray = [];
            snapshot.forEach(doc=>{
                idarray.push(doc.id);
            })

            console.log('idarray',idarray);
           
            firestore().collection("DailyPrayers").where(firestore.FieldPath.documentId(),'in',idarray).get().then(requestarray=>{
              let array = [];
              requestarray.forEach(item=>{
                array.push({
                  id:item.id,
                  ...item.data()
                })
              })
              dispatch(requestActions.setLoading(false));
              setrequest(array);
            })
        }).catch(err=>{dispatch(requestActions.setLoading(false))});
    },[updatecomponent]);

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

    return (
        <View
        style={[styles.container]}>
            <Animated.FlatList
                ref={flatlist}
                data={request}
                removeClippedSubviews={false}
                contentContainerStyle={{paddingBottom: 96}}
                showsVerticalScrollIndicator={false}
                renderItem={(item) => <DailyPrayers request={item} />}
                keyExtractor={(item) => item.id}
                />
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
    )
}