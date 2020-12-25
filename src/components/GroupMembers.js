import React,{useEffect,useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {ScrollView,FlatList,View} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import styles from '../styles/groups';
import Animated from 'react-native-reanimated';
import GroupMember from './GroupMember';
export default function GroupMembers(props)
{
    const {ActiveGroup} = useSelector(
        (state)=>state.group
    ),dispatch=useDispatch() ,{FirstName, LastName, Email} = useSelector((state) => state.auth.user);

    const [localState,setLocalState] = useState({members:[]})
    
    useEffect(()=>{

        firestore()
        .collection('Groups')
        .doc(ActiveGroup)
        .collection('Members')
        .orderBy('JoinDate')
        .get()
        .then(snapshot=>{
            let data = [];
            snapshot.docs.forEach(async(doc)=>{
                if(doc.id != Email)
                {
                    data.push({
                        email:doc.id,
                        ...doc.data()
                    })
                }
                
            })

            setLocalState({
                ...localState,
                members:data
            })
        })
    },[])

    return (
        <View style={styles.groupViewInnerWrapper}>
            <Animated.View style={{flex:1}}>
                <FlatList 
                    data={localState.members}
                    contentContainerStyle={{paddingBottom:148}}
                    keyExtractor={(item)=>item.email}
                    renderItem={member=><GroupMember member={member}/>}
                ></FlatList>
            </Animated.View>
        </View>      
    )
}