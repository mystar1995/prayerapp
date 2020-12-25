import React from 'react';
import {View, Text} from 'react-native';
import styles from '../styles/bible';

const BibleContent = (props) => {
  const {content} = props,
    {item} = content,
    {verse_nr, verse} = item;

  return (
    <View style={styles.bibleContentContainer}>
      <Text style={styles.bibleContentVerseNumber}>{verse_nr}</Text>
      <Text style={styles.bibleContentVerse}>{verse}</Text>
    </View>
  );
};

export default BibleContent;
