import {ScrollView,View,Text,FlatList,Animated,TouchableOpacity} from 'react-native';
import {useSelector,useDispatch} from 'react-redux';
import React,{useState,useRef} from 'react';
import styles from '../styles/userDetail';
import { useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import * as requestActions from '../containers/RequestsContainer/actions';
import loaderStyles from '../styles/loader';
import PrayerRequestCell from './PrayerRequestCell';
import LottieView from 'lottie-react-native';
import Modal from 'react-native-modal';

export default function MyRequest()
{
    const {Email} = useSelector((state)=>state.auth.user),
    {updatecomponent} = useSelector((state)=>state.auth),
    dispatch = useDispatch(),
    opacity = useRef(new Animated.Value(0)).current,
    {loading} = useSelector((state)=>state.request);
    const [request,setRequest] = useState([]);
    const [update,setupdate] = useState(false);
    const [endrequest,setendrequest] = useState(false);
    const flatlist = useRef(null);
    const [refreshing,setrefreshing] = useState(false);
    const [offset,setOffset] = useState(0);
    const [deleteitem,setdeleteitem] = useState("");
    useEffect(()=>{
        dispatch(requestActions.setLoading(true));
        firestore().collection('PrayerRequests').where('User','==',Email).get().then(snapshot=>{
            dispatch(requestActions.setLoading(false));
            let list = [];
            snapshot.docs.forEach(doc=>{
                list.push({
                    key:doc.id,
                    ...doc.data()
                })
            })
            setendrequest(true);
            setrefreshing(false);
            setRequest(list);
            dispatch(requestActions.setLoading(false));
        }).catch(err=>{dispatch(requestActions.setLoading(false)); console.log('err',err)})
    },[update,updatecomponent]);

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


    const loadPrayerRequests = () => {
        if(!endrequest)
        {
            // setskip(skip + 10);
            // setupdate(!update);
        }
    }

    const refreshRequests = () => {
        // setrefreshing(true);
        // setupdate(!update);
    }

    const renderFooter = () => {
        if(endrequest)
        {
            return (
                <View style={styles.endOfRequests}>
                <Text style={styles.endOfRequestsText}>End of requests</Text>
                </View>
            );
        } 
        else
        {
            return null;
        }   
    }


    const handleScroll = (e) => {
        console.log('event',e.nativeEvent.contentOffset.y);
        setOffset(e.nativeEvent.contentOffset.y);
      }
    
    const deleterequest = () => {
        firestore().collection('PrayerRequests').doc(deleteitem).delete().then(success=>{
            setupdate(!update);
            setdeleteitem(false);
        })
    }

    return (
        <View
        style={[styles.container,{padding:24}]}
        contentContainerStyle={{flexGrow: 1, paddingBottom: 148}}>
            <Animated.FlatList
                ref={flatlist}
                data={request}
                removeClippedSubviews={false}
                contentContainerStyle={{paddingBottom: 96}}
                showsVerticalScrollIndicator={false}
                renderItem={(item) => <PrayerRequestCell request={item} deleteitem={(id)=>setdeleteitem(id)}/>}
                keyExtractor={(item) => item.id}
                refreshing={refreshing}
                onRefresh={() => refreshRequests()}
                onScroll={handleScroll}
                onEndReached={() => loadPrayerRequests()}
                onEndReachedThreshold={0.1}
                ListFooterComponent={() => renderFooter()}
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

            <Modal 
            isVisible={deleteitem?true:false}
            onBackdropPress={()=>setdeleteitem(false)}
            style={{justifyContent:'flex-end',margin:0}}
            >
                <View style={{backgroundColor:'white',alignItems:'center',padding:10}}>
                    <TouchableOpacity onPress={deleterequest}><Text style={{color:'red',fontSize:16}}>Delete</Text></TouchableOpacity>
                </View>
            </Modal>
        </View>
    )
}
