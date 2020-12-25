import React,{useEffect,useState} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import styles from '../styles/groups';
import {View,FlatList,TouchableOpacity,Text,TextInput,Alert,Platform,PermissionsAndroid} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPlus} from '@fortawesome/pro-light-svg-icons';
import Animated from 'react-native-reanimated';
import GroupEvent from './GroupEvent';
import Modal from 'react-native-modal';
import DatePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import GeoLocation from '@react-native-community/geolocation';
import GeoCoding from 'react-native-geocoding';
export default function GroupEvents()
{
    const {ActiveGroup} = useSelector(
        (state)=>state.group
    ),dispatch=useDispatch(),{FirstName,LastName,Email} = useSelector(
        (state)=>state.auth.user
    );
    
    console.log('activegroup',ActiveGroup);
    const [events,setEvents] = useState([]);
    const [update,setUpdate] = useState(false);
    const [localState,setLocalState] = useState({
        modalVisible:false,
        eventtitle:"",
        eventinfo:"",
        start:new Date(),
        end:new Date(),
        show:false
    });
    const [datepicker,setdatepicker] = useState('');
    useEffect(()=>{
        GeoCoding.init('AIzaSyCxd2V1A83MjOohvPuApgCOf7PGhS3Vqf0');
    },[]);


    useEffect(()=>{
        firestore()
        .collection('Groups')
        .doc(ActiveGroup)
        .collection('Events')
        .get().then(snapshot=>{
            let eventlist = [];
            snapshot.docs.forEach(data=>{
                eventlist.push({
                    id:data.id,
                    ...data.data()
                })
            })

            console.log('eventlist',eventlist);
            setEvents(eventlist);
        })
    },[update])

    const addevent = async() => {
        console.log(localState);
        if(!localState.eventinfo || !localState.eventtitle)
        {
            Alert.alert('Title or Info will be required');
            return;
        }

        if(Platform.OS == 'android')
        {
            const permission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            if(permission != PermissionsAndroid.RESULTS.GRANTED)
            {
                return;
            }
        }
        
        let data = {
            CreatedBy:(FirstName || LastName)?FirstName + " " + LastName:Email,
            CreatedOn:new Date(),
            Date:new Date(),
            Start:localState.start,
            End:localState.end,
            Information:localState.eventinfo,
            Title:localState.eventtitle
        }

        GeoLocation.getCurrentPosition(position=>{
            console.log(position);
            data.Latitude = position.coords.latitude;
            data.Longitude = position.coords.longitude;

            GeoCoding.from(position.coords.latitude,position.coords.longitude).then(json=>{
                data.Address = json.plus_code.compound_code;
                firestore().collection('Groups').doc(ActiveGroup).collection('Events').add(data);
                setLocalState({
                    ...localState,
                    modalVisible:false,
                    eventinfo:"",
                    eventtitle:"",
                    start:new Date(),
                    end:new Date()
                })
                setUpdate(!update);
            })
        },(error)=>alert(error.message),{enableHighAccuracy:true,timeout:20000,maximumAge:3600000});
    }

    return (
        <View style={styles.groupViewInnerWrapper}>
            <Animated.View style={{flex:1}}>
                <FlatList
                    data={events}
                    contentContainerStyle={{paddingBottom:148}}
                    keyExtractor={item=>item.id}
                    renderItem={item=><GroupEvent data={item}></GroupEvent>}
                ></FlatList>
            </Animated.View>
            <TouchableOpacity
                onPress={() => {
                   setLocalState({
                       ...localState,
                       modalVisible:true
                   })
                }}
                style={[styles.newGroupActionButton,{bottom:10}]}>
                <FontAwesomeIcon color="white" icon={faPlus} />
            </TouchableOpacity>
            <Modal
                isVisible={localState.modalVisible}
                onBackdropPress={() => {
                    setLocalState({
                        modalVisible: false,
                        eventtitle:""
                    });
                }}>
                <View style={styles.modalInside}>
                    <View style={styles.inforow}>
                        <Text style={styles.label}>Event Title</Text>
                        <TextInput style={[styles.input,{marginBottom:0}]} value={localState.eventtitle} onChangeText={value=>setLocalState({...localState,eventtitle:value})}></TextInput>
                    </View>
                    <View style={styles.inforow}>
                        <Text style={styles.label}>Event Info</Text>
                        <TextInput style={[styles.input,{marginBottom:0}]} value={localState.eventinfo} onChangeText={value=>setLocalState({...localState,eventinfo:value})}></TextInput>
                    </View>
                    <View style={styles.inforow}>
                        <Text style={styles.label}>START</Text>
                        <TouchableOpacity style={[styles.input,{minHeight:50,marginBottom:0}]} onPress={()=>setdatepicker('start')}><Text>{moment(localState.start).format('dddd, MMMM Do')}</Text></TouchableOpacity>
                    </View>
                    <View style={styles.inforow}>
                        <Text style={styles.label}>TO</Text>
                        <TouchableOpacity style={[styles.input,{minHeight:50,marginBottom:0}]} onPress={()=>setdatepicker('end')}><Text>{moment(localState.end).format('dddd, MMMM Do')}</Text></TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={[styles.navigateToNewSection,{padding:15}]}
                        onPress={addevent}
                    >
                        <Text style={styles.buttonText}>Create</Text>
                    </TouchableOpacity>
                    {
                        datepicker == 'start' && (
                            <DatePicker onChange={(e,date)=>{
                                setdatepicker('');
                                setLocalState({
                                    ...localState,
                                    start:date
                                })
                            }}
                            onTouchCancel={()=>setdatepicker('')}
                            value={localState.start}
                            ></DatePicker>
                        )
                    }
                    {
                        datepicker == 'end' && (
                            <DatePicker onChange={(e,date)=>{
                                setdatepicker('');
                                setLocalState({
                                    ...localState,
                                    end:date
                                })

                                
                            }}
                            onTouchCancel={()=>setdatepicker('')}
                            value={localState.end}
                            ></DatePicker>
                        )
                    }
                </View>
            </Modal>
        </View>
    )
}