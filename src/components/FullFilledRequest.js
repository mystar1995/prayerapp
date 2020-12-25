import {View,FlatList,Text,Animated,TouchableOpacity} from 'react-native';
import React,{useState,useEffect,useRef} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import styles from '../styles/userDetail';
import LottieView from 'lottie-react-native';
import loaderStyles from '../styles/loader';
import * as requestActions from '../containers/RequestsContainer/actions';
import firestore from '@react-native-firebase/firestore';
import FullfilledRequestCell from './MyFullfilledPryaerCell';
import Modal from 'react-native-modal';

export default function FullFilledRequest()
{
    const flatlist = useRef(null);
    
    const {Email} = useSelector(state=>state.auth.user),
    {loading} = useSelector(state=>state.request),
    {updatecomponent} = useSelector(state=>state.auth),
    opacity = useRef(new Animated.Value(0)).current,
    dispatch = useDispatch();
    const [request,setrequest] = useState([]);
    const [update,setupdate] = useState(false),
    [deleteitem,setdeleteitem] = useState('');

    useEffect(()=>{
        
        dispatch(requestActions.setLoading(true));
        // firestore().collection('PrayerRequests').get().then((snapshot)=>{
        //     let requestlist = [];
            
        //     let count = 0;
        //     if(snapshot.docs.length > 0)
        //     {
        //         snapshot.forEach(async(doc)=>{
        //             let result = await doc.ref.collection('FulfilledBy').get();
        //             let emaillist = [];
        //             if(doc.data().User != Email)
        //             {
        //                 result.docs.forEach(item=>{
        //                     emaillist.push(item.id);
        //                 })
        //             }
                    
    
        //             if(emaillist.indexOf(Email) > -1)
        //             {
                        
        //                 requestlist.push({
        //                     key:doc.id,
        //                     ...doc.data()
        //                 })
        //             }
    
        //             count ++;
    
        //             if(count == snapshot.docs.length)
        //             {
        //                 console.log('requestlist',requestlist);
        //                 setrequest(requestlist);
        //                 dispatch(requestActions.setLoading(false));
        //             }
        //         })
        //     }
        //     else
        //     {
        //         dispatch(requestActions.setLoading(false));
        //     }
            
        // })

        firestore().collection('Users').doc(Email).collection('FulfilledPrayers').get().then(snapshot=>{
            console.log('aaaa',snapshot.docs.length);
            let idarray = [];
            snapshot.forEach(doc=>{
                idarray.push(doc.id);
            })
            
            console.log(idarray);
            firestore().collection("PrayerRequests").where(firestore.FieldPath.documentId(),'in',idarray).get().then(requestarray=>{
              let array = [];
              requestarray.forEach(item=>{
                array.push({
                  key:item.id,
                  ...item.data()
                })
              })
              dispatch(requestActions.setLoading(false));
              setrequest(array);
            }).catch(err=>{
              dispatch(requestActions.setLoading(false));
            })
        }).catch(err=>dispatch(requestActions.setLoading(false)))
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

    const deleterequest = () => {
      firestore().collection('Users').doc(Email).collection('FulfilledPrayers').doc(deleteitem).delete().then(()=>{
        firestore().collection('PrayerRequests').doc(deleteitem).collection('FulfilledBy').doc(Email).delete().then(()=>{
          firestore().collection('PrayerRequests').doc(deleteitem).update({Fulfillment:firestore.FieldValue.increment(-1)}).then(()=>{
            setdeleteitem('');
            setupdate(!update);
          })
        })
      })
    }

    const deletedialog = (id) => {
      setdeleteitem(id);
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
                renderItem={(item) => <FullfilledRequestCell request={item} deleteitem={deletedialog}/>}
                keyExtractor={(item) => item.key}
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
            onBackdropPress={()=>setdeleteitem('')}
            style={{justifyContent:'flex-end',margin:0}}
            >
                <View style={{backgroundColor:'white',alignItems:'center',padding:10}}>
                    <TouchableOpacity onPress={deleterequest}><Text style={{color:'red',fontSize:16}}>Delete</Text></TouchableOpacity>
                </View>
            </Modal>
        </View>
    )
}