import React,{useState} from 'react';
import {TouchableOpacity,View,Text} from 'react-native';
import styles from '../styles/groups';
import moment from 'moment';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faChevronDown,faChevronUp} from '@fortawesome/pro-solid-svg-icons';
import Collapsible from 'react-native-collapsible';
export default function GroupEvent({data})
{
    const {index,item} = data;
    const [show,setShow] = useState(false);
    console.log(item);
    return (
        <TouchableOpacity key={index} style={[styles.groupCellContainer,{flexWrap:'wrap',flexDirection:'column'}]}>
            <View style={styles.messageCardTopRow}>
                <View style={styles.abbreviationCircle}>
                    <Text style={styles.abbreviationCircleText}>
                        {item.CreatedBy.substr(0,2)}
                    </Text>
                </View>
                <View style={styles.messageCardCenter}>
                    <Text style={styles.commentPosterName}>{item.CreatedBy}</Text>
                    <Text style={styles.messageDate}>{item.Address}</Text>
                    <Text style={styles.messageDate}>{moment(new Date(item.Date._seconds * 1000)).format('MMM Do, yyyy')}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        setShow(!show);
                    }}>
                    <FontAwesomeIcon
                        icon={!show?faChevronDown:faChevronUp}
                        style={styles.postEdit}
                    />
                </TouchableOpacity>
            </View>
            
            <Collapsible collapsed={show}>
                <View style={styles.messageContent}>
                    <Text style={styles.commentPosterName}>{item.Title}</Text>
                    <Text style={styles.messageDate}>{item.Information}</Text>
                    <Text style={styles.messageDate}>{moment(new Date(item.Start._seconds * 1000)).format('MMM Do, yyyy')} ~ {moment(new Date(item.End._seconds * 1000)).format('MMM Do, yyyy')}</Text>
                </View>
                
            </Collapsible>
        </TouchableOpacity>
    )
} 