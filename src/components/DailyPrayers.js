import React from 'react';
import {ImageBackground,Text,StyleSheet,Dimensions,View} from 'react-native';

const width = Dimensions.get("window").width;

export default function DailyPrayers({request})
{  
    const {item} = request;
    const {Image,PrayerText} = item;
    return (
        <ImageBackground style={style.container} source={{uri:Image}} resizeMode="cover">
            <View style={{flex:1,backgroundColor:'#504F4BCC',padding:20,display:'flex',justifyContent:'center'}}>
                <Text style={style.text}>{PrayerText}</Text>
            </View>
        </ImageBackground>
    )
}

const style = StyleSheet.create({
    container:{
        width:width,
        height:150,
        
        flex:1
    },
    text:{
        color:'white',
        fontSize:16
    }
})