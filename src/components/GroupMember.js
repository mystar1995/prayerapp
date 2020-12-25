import React,{useEffect,useState} from 'react';
import {TouchableOpacity,View,Text} from 'react-native';
import styles from '../styles/groups';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';

export default function GroupMember(props)
{
    const {member} = props;
    const {index,item} = member;
    const [user,setUser] = useState(item);

    useEffect(()=>{
        firestore().collection("Users").doc(item.email).get().then(doc=>{
            let userdata = doc.data();
            console.log('userdata',userdata);
            setUser({
                ...user,
                firstname:userdata.FirstName,
                lastname:userdata.LastName
            })
        })
    },[])
    return (
        <TouchableOpacity key={index} style={[styles.groupCellContainer,{flexWrap:'wrap'}]}>
            <View style={styles.messageCardTopRow}>
                <View style={styles.abbreviationCircle}>
                    <Text style={styles.abbreviationCircleText}>
                        {user.email.substr(0,2)}
                    </Text>
                </View>

                <View style={styles.messageCardCenter}>
                    <Text style={styles.commentPosterName}>{(user.firstname || user.lastname)?user.firstname + " " + user.lastname:user.email}</Text>

                    <Text style={styles.messageDate}>
                        {moment(user.JoinDate?user.JoinDate:user.RequestDate).format('dddd, MMMM Do')}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}