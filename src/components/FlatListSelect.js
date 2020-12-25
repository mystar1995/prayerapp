import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Animated,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import {TouchableOpacity as Button} from 'react-native-gesture-handler';
import styles from '../styles/flatListSelect';
import ModalDropdown from 'react-native-modal-dropdown';

const FlatListSelect = (props) => {
  const {onSelect, options, selectedValue, title} = props,
    [listOpen, setOpen] = useState(true);

  var maxHeight = new Animated.Value(0);
  var opacity = new Animated.Value(0);

  useEffect(() => {
    if (listOpen) {
      Animated.parallel([
        Animated.spring(maxHeight, {
          toValue: 0,
          useNativeDriver: false,
        }),
        Animated.spring(opacity, {
          toValue: 0,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(maxHeight, {
          toValue: Dimensions.get('window').height * 0.3,
          useNativeDriver: false,
        }),
        Animated.spring(opacity, {
          toValue: 1,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [listOpen]);

  const toggleFlatList = () => {
    setOpen(!listOpen);
  };

  const onPress = (option) => {
    // Dismiss the flatlist view (hide it) and call our onChange prop.
    onSelect(option);
    toggleFlatList();
  };

  return (
    <View style={[styles.flatListSelect]}>
      <Text style={styles.fieldTitle}>{title}</Text>
      <View style={{flex:1}}>
       <Animated.View style={[styles.flatListWrapper, {maxHeight, opacity,zIndex: !listOpen ? 1000000 : -1,elevation:200000}]}>
            <FlatList
              data={options}
              style={[styles.flatListContainer]}
              contentContainerStyle={{paddingBottom: 24}}
              showsVerticalScrollIndicator={false}
              keyExtractor={(option, index) => `${option}-${index}`}
              renderItem={(option) => (
                <TouchableOpacity
                  style={styles.selectableButton}
                  onPress={() => onPress(option.item)}>
                    <View style={{flexGrow:1}}>
                      <Text style={styles.selectableText}>{option.item}</Text>
                    </View>
                  
                </TouchableOpacity>
              )}
            />
          </Animated.View>
        <TouchableOpacity
          onPress={() => toggleFlatList()}
          style={[
            styles.flatlistSelectButton,
            {
              borderBottomColor:
                selectedValue !== '' || !listOpen ? '#EB237D' : '#EFEFEF',
                elevation:1500
            },
          ]}>
          <Text style={styles.buttonText}>
            {selectedValue === '' ? 'Select' : selectedValue}
          </Text>
          
        </TouchableOpacity>
        
      </View>
      
    </View>
  );
};

export default FlatListSelect;
