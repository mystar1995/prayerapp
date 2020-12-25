import React, {useEffect, useState, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
    View,
    Text,
    Animated,
    FlatList,
    TouchableOpacity,
    Image,
    StatusBar,
    Platform,
    TextInput,
    Alert,
    Dimensions
} from 'react-native';
import _ from 'lodash';
import Modal,{} from 'react-native-modal';
import firestore from '@react-native-firebase/firestore';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faBars, faSearch,faEllipsisH} from '@fortawesome/pro-solid-svg-icons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import LottieView from 'lottie-react-native';
import * as groupActions from '../containers/GroupsContainer/actions';
import GroupCell from '../components/GroupCell';
import GroupView from '../components/GroupView';
import styles from '../styles/groups';
import loaderStyles from '../styles/loader';
import { faCalendar, faChevronLeft, faHome, faInfo, faInfoCircle, faPlus, faSignOut, faUsers } from '@fortawesome/pro-regular-svg-icons';
import { faCog } from '@fortawesome/pro-light-svg-icons';

const Groups = (props) => {
    const {navigation} = props,
        {loading, ActiveGroup, UserGroups,ActiveMessage,ActiveScreen} = useSelector(
            (state) => state.group
        ),
        {user} = useSelector((state) => state.auth),
        [currentGroup,setcurrentgroup] = useState(ActiveGroup !== undefined
            ? _.find(UserGroups, ['Id', ActiveGroup])
            : undefined),
        [localState, setState] = useState({
            modalVisible: false,
            navigateToBook: '',
            navigateToChapter: '',
            chapterOptions: [],
            groupname:'',
            navlist:false,
            back:false,
            groupadd:false,
            reason:"",
            setting:{
                Privacy:0,
                name:"",
                Moderation:0
            }
        }),
        opacity = useRef(new Animated.Value(0)).current,
        [report,setreport] = useState(false),
        [reported,setreported] = useState(false),
        [setting,setsetting] = useState(false),
        dispatch = useDispatch();
    
    const background = require('../assets/images/login-background.png');
    console.log(UserGroups);
    const [update,setupdate] = useState(false);
    
    const createGroup = () => {
        let date = new Date();
        if(!localState.groupname)
        {
            Alert.alert('Group Name is required');
            return;
        }
        firestore().collection('Users').doc(user.Email).collection('Groups').add({
            GroupName:localState.groupname,
            CreatedByUser:user.Email,
            DateCreated:date,
            Moderation:2,
            Privacy:0,
            Suspended:false
        }).then(res=>{
            firestore().collection('Groups').doc(res.id).set({
                GroupName:localState.groupname,
                CreatedByUser:user.Email,
                DateCreated:date,
                Moderation:2,
                Privacy:0,
                Suspended:false,
                reported:0
            }).then(response=>{
                firestore().collection('Groups').doc(res.id).collection('Members').doc(user.Email).set({}).then(result=>{        
                    let groupdata = {
                        Id: res.id,
                        key: res.id,
                        GroupName:localState.groupname,
                        UserRole: '',
                    }
                    dispatch(groupActions.setUserGroups([groupdata,...UserGroups]));
                    setState({...localState,groupname:'',groupadd:false});
                })
            })
            
            
        })
    }

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
    
    // const getUserGroups = async() => {
    //     dispatch(groupActions.setLoading(true));
    //     // await firestore().collection('Groups').doc(firestore.FieldPath.documentId() + "").collection('Members').get().then(async(snapshot)=>{
    //     //    console.log('doclength',snapshot.docs.length);
    //     //    dispatch(groupActions.setLoading(false));
    //     // })

    //     firestore().collection('Groups').where('CreatedByUser','==',user.Email).get().then(snapshot=>{
    //         dispatch(groupActions.setLoading(false));
    //         dispatch(groupActions.setUserGroups([]));
    //         // snapshot.forEach(doc=>{
    //         //     doc.ref.delete();
    //         // })

    //         // firestore().collection('Users').doc(user.Email).collection('Groups').get().then(result=>{
    //         //     result.forEach(item=>{
    //         //         item.ref.delete();
    //         //     })
    //         //     dispatch(groupActions.setLoading(false));
    //         // })
    //         snapshot.forEach(doc=>{
    //             let groupData = doc.data();

    //             if(groupData && !groupData.Suspended && groupData.GroupName)
    //             {
    //                 doc.ref.collection('Members').get().then(members=>{
    //                     let membercount = members.docs.length;
    //                     let count = 0;
    //                     members.forEach(member=>{
    //                         if(member.data().reported)
    //                         {
    //                             count ++;
    //                         }
    //                     })
    //                     console.log('membercount',membercount);
    //                     console.log('count',count);
    //                     if(membercount != 0 && count < membercount * 0.7)
    //                     {
    //                         console.log(groupData.GroupName);
    //                         dispatch(groupActions.addUserGroup({
    //                             Id: doc.id,
    //                             key: doc.id,
    //                             GroupName: groupData.GroupName,
    //                             UserRole: "",
    //                             reported:count
    //                         }))

                            
    //                     }
    //                 })
    //             }
    //         })
    //     })
    // }
    const getUserGroups = async () => {
        dispatch(groupActions.setLoading(true));
        await firestore()
            .collection('Users')
            .doc(user.Email)
            .collection('Groups')
            .get()
            .then(async(snapshot) => {
                let grouplist = [];
                let groupcount = 0;
                console.log('snapshotdocs',snapshot.docs.length);
                dispatch(groupActions.setUserGroups([]));
                dispatch(groupActions.setLoading(false));
                snapshot.docs.forEach(async(doc) => {
                    const groupData = doc.data();
                    groupcount ++;
                   
                    
                    if (groupData && !groupData.Suspended && groupData.GroupName && groupData.GroupName.toLowerCase().includes(localState.groupname.toLowerCase())) {
                        console.log(doc.id)
                        await firestore().collection('Groups').doc(doc.id).collection('Members').get().then(members=>{
                            console.log(doc.id);
                            let membercount = members.docs.length;
                            let count = 0;
                            members.forEach(member=>{
                                if(member.data().reported)
                                {
                                    count ++;
                                }
                            })
                            console.log('membercount',membercount);
                            console.log('count',count);
                            if(membercount != 0 && count < membercount * 0.7)
                            {
                                console.log(groupData.GroupName);
                                dispatch(groupActions.addUserGroup({
                                    Id: doc.id,
                                    key: doc.id,
                                    GroupName: groupData.GroupName,
                                    UserRole: "",
                                    reported:count
                                }))

                               
                            }
                        })                       
                    }

                    // Make sure that this group is not already in our store.
                });

                
            });
    };

    useEffect(()=>{
        setcurrentgroup(ActiveGroup !== undefined
            ? _.find(UserGroups, ['Id', ActiveGroup])
            : undefined);
    },[ActiveGroup])

    const leavegroup = () => {
        console.log('activegroup',ActiveGroup);

        firestore().collection('Groups').doc(ActiveGroup).collection('Members').doc(user.Email).delete().then(result=>{
            firestore().collection('Users').doc(user.Email).collection('Groups').doc(ActiveGroup).delete().then(res=>{
                setState({
                    ...localState,
                    navlist: false,
                })
    
                let index = _.findIndex(UserGroups, ['Id', ActiveGroup]);
                let groupdata = [...UserGroups];
                groupdata.splice(index,1);
                dispatch(groupActions.setUserGroups(groupdata));
                dispatch(groupActions.setActiveGroup(undefined));
            })  
        })

        
    }




    useEffect(()=>{
        navigation.addListener('focus',function(){
            if(user)
            {
                dispatch(groupActions.setActiveMessage(undefined));
                dispatch(groupActions.setActiveScreen('Messages'));
            }
        })
    },[])

    useEffect(()=>{
        if(ActiveGroup)
        {
            firestore().collection('Groups').doc(ActiveGroup).collection('Members').doc(user.Email).get().then(snapshot=>{
                let data = snapshot.data();
                setreported(data.reported?true:false);
            })
        }
    },[ActiveGroup])

    useEffect(() => {
        
        (user !== undefined && ActiveGroup == undefined) && getUserGroups();
    }, [user,update,ActiveGroup]);

    const back = () => {
        if(ActiveGroup == undefined)
        {
            navigation.goBack();
        }
        else if(ActiveMessage != undefined)
        {
            dispatch(
                groupActions.setActiveMessage(undefined)
            )
        }
        else
        {
            dispatch(groupActions.setActiveGroup(undefined));
        }
    }

    const display = (view) => {
        dispatch(groupActions.setActiveScreen(view));
        setState({
            ...localState,
            navlist:false
        })
    }

    const searchgroup = () => {
        setupdate(!update);
        setState({
            ...localState,
            modalVisible:false
        })
    }

    const gettitle = () => {
        if(ActiveScreen == 'Messages')
        {
            return 'Group Message Board';
        }
        else if(ActiveScreen == 'Members')
        {
            return 'Group Members';
        }
        else if(ActiveScreen == 'Events')
        {
            return 'Group Events';
        }
    }

    const reportdialog = () => {
        setreport(true);
        setState({
            ...localState,
            modalVisible:false,
            navlist:false
        })
    }

    const reportgroup = async() => {
        if(localState.reason)
        {
            await firestore().collection('Groups').doc(ActiveGroup).collection('Reports').doc(user.Email).set({
                reason:localState.reason
            }).then(()=>{
                let docref = firestore().collection('Groups').doc(ActiveGroup).collection('Members').doc(user.Email);
                docref.update({reported:true});
                setState({
                    ...localState,
                    reason:""
                })
                setreport(false)
                dispatch(groupActions.setActiveGroup(undefined));
                Alert.alert('You have successfully reported this group.');
            })
        }
    }

    const settingdialog = () => {
        dispatch(groupActions.setLoading(true));
        firestore().collection('Groups').doc(ActiveGroup).get().then(result=>{
            let data = result.data();
            setState({
                ...localState,
                setting:{
                    name:data.GroupName,
                    Privacy:data.Privacy,
                    Moderation:data.Moderation
                },
                navlist:false,
                modalVisible:false
            })

            dispatch(groupActions.setLoading(false));
            setsetting(true);
        }).catch(err=>{dispatch(groupActions.setLoading(false))})
    }

    const savesetting = () => {
        if(localState.setting.name)
        {
            dispatch(groupActions.setLoading(true));
            let ref = firestore().collection('Groups').doc(ActiveGroup);
            ref.update({GroupName:localState.setting.name,Privacy:localState.setting.Privacy,Moderation:localState.setting.Moderation}).then(result=>{
                firestore().collection('Users').doc(user.Email).collection('Groups').doc(ActiveGroup).update({GroupName:localState.setting.name,Privacy:localState.setting.Privacy,Moderation:localState.setting.Moderation}).then(()=>{
                    setcurrentgroup({...currentGroup,GroupName:localState.setting.name,Privacy:localState.setting.Privacy,Moderation:localState.setting.Moderation})
                    dispatch(groupActions.setLoading(false));
                    setsetting(false);
                })
                
            })
        }
    }

    return (
        <View style={styles.container}>
            
            <Image
                style={styles.backgroundImage}
                source={background}
                resizeMode="cover"
            />

            {
                (ActiveGroup == undefined || currentGroup == undefined) && (
                    <View
                        style={[
                            styles.rowheader,
                            styles.fixedHeader1,
                            {
                                marginTop:
                                    Platform.OS === 'ios'
                                        ? getStatusBarHeight()
                                        : StatusBar.currentHeight,
                            },
                        ]}>
                        <Text style={styles.pageHeader1}>
                            Groups
                        </Text>

                        <TouchableOpacity
                            style={styles.searchButton}
                            onPress={() =>
                                ActiveGroup === undefined
                                    ? setState({
                                        ...localState,
                                        modalVisible: true,
                                    })
                                    : console.log('test')
                            }>
                            <FontAwesomeIcon
                                icon={ActiveGroup === undefined ? faSearch : faBars}
                                size={14}
                                style={styles.searchIcon}
                            />
                        </TouchableOpacity>
                    </View>
                )
            }
            {
                (ActiveGroup != undefined && currentGroup != undefined) && (
                    <View
                        style={[
                            styles.row,
                            styles.fixedHeader                   
                        ]}>
                        <TouchableOpacity onPress={back}>
                            <FontAwesomeIcon style={styles.searchIcon} size={14} icon={faChevronLeft}></FontAwesomeIcon>
                        </TouchableOpacity>
                        <Text style={styles.header}>
                            {ActiveGroup === undefined
                                ? 'Groups'
                                : currentGroup.GroupName}
                        </Text>

                        <TouchableOpacity
                            onPress={() =>
                                setState({
                                    ...localState,
                                    navlist: true,
                                })
                            }>
                            <FontAwesomeIcon
                                icon={faEllipsisH}
                                size={14}
                                style={styles.searchIcon}
                            />
                        </TouchableOpacity>
                    </View>
                )
            }
            

            <SafeAreaView style={{flex:1}}>
                {
                   (ActiveGroup != undefined && currentGroup != undefined) && (
                        <Text style={styles.pageHeader}>{gettitle()}</Text>
                    )
                }
                
                {(ActiveGroup != undefined && currentGroup != undefined) ? (
                    <GroupView back={localState.back}/>
                ) : (
                    <>
                        <FlatList
                            data={UserGroups}
                            contentContainerStyle={{
                                paddingBottom: 148,
                                paddingLeft:24,
                                paddingRight:24
                            }}
                            showsVerticalScrollIndicator={false}
                            renderItem={(group) => <GroupCell group={group} />}
                            //   ListFooterComponent={() => renderFooter()}
                            keyExtractor={(item, index) => item.key}
                        />
                        <TouchableOpacity
                            onPress={() => {
                            setState({
                                ...localState,
                                groupadd:true
                            })
                            }}
                            style={[styles.newGroupActionButton,{bottom:10}]}>
                            <FontAwesomeIcon color="white" icon={faPlus} />
                        </TouchableOpacity>
                    </>
                )}
            </SafeAreaView>

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
                isVisible={localState.groupadd}
                onBackdropPress={() => {
                    setState({
                        ...localState,
                        modalVisible: false,
                        navigateToBook: '',
                        navigateToChapter: '',
                    });
                }}>
                <View style={styles.modalInside}>
                    <View style={styles.inforow}>
                        <Text style={styles.label}>Group Name</Text>
                        <TextInput style={styles.input} value={localState.groupname} onChangeText={value=>setState({...localState,groupname:value})}></TextInput>
                    </View>
                    <TouchableOpacity
                        style={styles.navigateToNewSection}
                        onPress={() => createGroup()}
                    >
                        <Text style={styles.buttonText}>Create</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            <Modal
                isVisible={localState.modalVisible}
                onBackdropPress={() => {
                    setState({
                        ...localState,
                        modalVisible: false,
                        navigateToBook: '',
                        navigateToChapter: '',
                    });
                }}>
                <View style={styles.modalInside}>
                    <View style={styles.inforow}>
                        <Text style={styles.label}>Group Name</Text>
                        <TextInput style={styles.input} value={localState.groupname} onChangeText={value=>setState({...localState,groupname:value})}></TextInput>
                    </View>
                    <TouchableOpacity
                        style={styles.navigateToNewSection}
                        onPress={() => searchgroup()}
                    >
                        <Text style={styles.buttonText}>Go</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            <Modal
                isVisible={report}
                onBackdropPress={() => {
                    setreport(false)
                }}>
                <View style={styles.modalInside}>
                    <View style={styles.inforow}>
                        <Text style={styles.label}>Reason</Text>
                        <TextInput style={styles.input} value={localState.reason} onChangeText={value=>setState({...localState,reason:value})}></TextInput>
                    </View>
                    <TouchableOpacity
                        style={styles.navigateToNewSection}
                        onPress={() => reportgroup()}
                    >
                        <Text style={styles.buttonText}>Report</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            <Modal 
                style={{justifyContent:'flex-end',margin:0}}
                isVisible={setting} 
                onBackdropPress={()=>{
                   setsetting(false)
                }}>
                <View style={styles.modalInside}>
                    <View style={{marginBottom:15,alignItems:'center'}}>
                        <Text style={styles.title}>Group Settings</Text>
                    </View>
                    <View style={{marginBottom:15}}>
                        <Text style={[styles.label,{width:Dimensions.get('window').width,marginBottom:10}]}>Group name</Text>
                        <View style={styles.inforow}>
                            <TextInput style={styles.input} value={localState.setting.name} onChangeText={value=>setState({...localState,setting:{...localState.setting,name:value}})}></TextInput>
                        </View>
                    </View>
                    <View style={{marginBottom:15}}>
                        <Text style={[styles.label,{width:Dimensions.get('window').width,marginBottom:10}]}>Group Publicy</Text>
                        <View style={styles.inforow}>
                            <TouchableOpacity style={[styles.tab,{backgroundColor:localState.setting.Privacy?'white':'#3274F4'}]} onPress={()=>{setState({...localState,setting:{...localState.setting,Privacy:false}})}}>
                                <Text style={[styles.tabtxt,{color:localState.setting.Privacy?'#888':'white'}]}>Public</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.tab,{backgroundColor:!localState.setting.Privacy?'white':'#3274F4'}]} onPress={()=>{setState({...localState,setting:{...localState.setting,Privacy:true}})}}>
                                <Text style={[styles.tabtxt,{color:!localState.setting.Privacy?'#888':'white'}]}>Unlisted</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{marginBottom:15}}>
                        <Text style={[styles.label,{width:Dimensions.get('window').width,marginBottom:10}]}>Who can add members?</Text>
                        <View style={styles.inforow}>
                            <TouchableOpacity style={[styles.tab,{backgroundColor:localState.setting.Moderation != 0?'white':'#3274F4'}]} onPress={()=>{setState({...localState,setting:{...localState.setting,Moderation:0}})}}>
                                <Text style={[styles.tabtxt,{color:localState.setting.Moderation != 0?'#888':'white'}]}>Anyone</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.tab,{backgroundColor:localState.setting.Moderation != 1?'white':'#3274F4'}]} onPress={()=>{setState({...localState,setting:{...localState.setting,Moderation:1}})}}>
                                <Text style={[styles.tabtxt,{color:localState.setting.Moderation != 1?'#888':'white'}]}>Mods</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.tab,{backgroundColor:localState.setting.Moderation != 2?'white':'#3274F4'}]} onPress={()=>{setState({...localState,setting:{...localState.setting,Moderation:2}})}}>
                                <Text style={[styles.tabtxt,{color:localState.setting.Moderation != 2?'#888':'white'}]}>Admins</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{marginBottom:25,alignItems:'center'}}>
                        <TouchableOpacity onPress={savesetting}>
                            <Text style={{color:'blue',fontSize:16}}>Save</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{alignItems:'center'}}>
                        <TouchableOpacity onPress={()=>setsetting(false)}>
                            <Text style={{color:'red',fontSize:16}}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal 
                style={{justifyContent:'flex-end',margin:0}}
                isVisible={localState.navlist} 
                onBackdropPress={()=>{
                    setState({
                        ...localState,
                        navlist:false
                    })
                }}>
                <View style={styles.modalInside}>
                    <View style={styles.rownav}>
                        <TouchableOpacity style={[styles.navlisticons,{backgroundColor:ActiveScreen == 'Messages'?'#3274F4':'#EDEDED'}]} onPress={()=>display('Messages')}>
                            <FontAwesomeIcon icon={faHome} size={20} style={{color:ActiveScreen == 'Messages'?'white':'#787878'}}></FontAwesomeIcon>
                            <Text style={{color:ActiveScreen == 'Messages'?'white':'#787878',fontWeight:'bold'}}>Home</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.navlisticons,{backgroundColor:ActiveScreen == 'Events'?'#3274F4':'#EDEDED'}]} onPress={()=>display('Events')}>
                            <FontAwesomeIcon icon={faCalendar} size={20} style={{color:ActiveScreen == 'Events'?'white':'#787878'}}></FontAwesomeIcon>
                            <Text style={{color:ActiveScreen == 'Events'?'white':'#787878',fontWeight:'bold'}}>Events</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.navlisticons,{backgroundColor:ActiveScreen == 'Members'?'#3274F4':'#EDEDED'}]} onPress={()=>display('Members')}>
                            <FontAwesomeIcon icon={faUsers} size={20} style={{color:ActiveScreen == 'Members'?'white':'#787878'}}></FontAwesomeIcon>
                            <Text style={{color:ActiveScreen == 'Members'?'white':'#787878',fontWeight:'bold'}}>Members</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{...styles.rownav,marginTop:10}}>
                        <TouchableOpacity style={[styles.navlisticons,{backgroundColor:reported?'#3274F4':'#EDEDED'}]} onPress={reportdialog}>
                            <FontAwesomeIcon icon={faInfoCircle} size={20} style={{color:reported?'white':'#787878'}}></FontAwesomeIcon>
                            <Text style={{color:reported?'white':'#787878',fontWeight:'bold'}}>Report</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navlisticons} onPress={settingdialog}>
                            <FontAwesomeIcon icon={faCog} size={20} style={{color:'#787878'}}></FontAwesomeIcon>
                            <Text style={{color:'#787878',fontWeight:'bold'}}>Setting</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navlisticons} onPress={leavegroup}>
                            <FontAwesomeIcon icon={faSignOut} size={20} style={{color:'#787878'}}></FontAwesomeIcon>
                            <Text style={{color:'#787878',fontWeight:'bold'}}>Leave</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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

export default Groups;
