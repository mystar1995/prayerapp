import React, {useState} from 'react';

import {
    View,
    StatusBar,
    Text,
    TouchableOpacity,
    Image,
    ScrollView
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import styles from '../styles/userDetail';

import {AccountDetail} from './AccountDetail';
import MyRequests from './MyRequest';
import FullFilledRequest from './FullFilledRequest';
import FavouriteRequest from './FavouritePrayers';

const UserDetail = (props) => {

    const [activeScreen, setActiveScreen] = useState('general_information'),
     
    background = require('../assets/images/login-background.png');
    const {updatecomponent} = props;
    

    return (
        <View style={styles.container}>
            <Image
                style={styles.backgroundImage}
                source={background}
                resizeMode="cover"
            />

            <SafeAreaView>
                <ScrollView horizontal={true} style={{backgroundColor:'#EB237D',padding:5,height:50}}>
                    <TouchableOpacity style={activeScreen == 'general_information'?styles.selectedbtn:styles.btn} onPress={()=>setActiveScreen('general_information')}>
                        <Text style={{color:activeScreen != 'general_information'?'white':'#EB237D'}}>General Information</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={activeScreen == 'favourite_payers'?styles.selectedbtn:styles.btn} onPress={()=>setActiveScreen('favourite_payers')}>
                        <Text style={{color:activeScreen != 'favourite_payers'?'white':'#EB237D'}}>Favourite Prayers</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={activeScreen == 'my_requests'?styles.selectedbtn:styles.btn} onPress={()=>setActiveScreen('my_requests')}>
                        <Text style={{color:activeScreen != 'my_requests'?'white':'#EB237D'}}>My Requests</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={activeScreen == 'fullfill_requests'?styles.selectedbtn:styles.btn} onPress={()=>setActiveScreen('fullfill_requests')}>
                        <Text style={{color:activeScreen != 'fullfill_requests'?'white':'#EB237D'}}>Fullfilled Requests</Text>
                    </TouchableOpacity>
                </ScrollView>
                {
                    activeScreen == 'general_information' && (
                        <AccountDetail/>
                    )
                }
                {
                    activeScreen == 'my_requests' && (
                        <MyRequests/>
                    )
                }
                {
                    activeScreen == 'fullfill_requests' && (
                        <FullFilledRequest/>
                    )
                }
                {
                    activeScreen == 'favourite_payers' && (
                        <FavouriteRequest/>
                    )
                }
                {
                    activeScreen != 'general_information' && (
                        <View style={{flex:1}}></View>
                    )
                }                
            </SafeAreaView>
        </View>
    );
};

export default UserDetail;
