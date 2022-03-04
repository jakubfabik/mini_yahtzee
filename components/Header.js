import { View, Text, Platform, StatusBar } from 'react-native';
import React from 'react';
import styles from '../style/style';
import constants from 'expo-constants';



export default function Header() {

  const setBar = () => {
    if(Platform.OS === "ios"){return {marginTop:constants.statusBarHeight}}
    if(Platform.OS === "android"){return {marginTop:StatusBar.currentHeight}}
  }

  return (
    <View style={[styles.header,setBar()]}>
      <Text style={styles.title}>Mini Yatzy</Text>
    </View>
  );
}
