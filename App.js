import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, ScrollView, TextInput, Alert} from 'react-native';
import Constants from 'expo-constants';
import { useState, useEffect } from 'react';
import TouchComp from './TouchComp';


export default function App() {
const [name,setName] = useState("");

useEffect(()=>{
  console.log(name)
},[])

const _alert = () =>{
  Alert.alert("Hello " + name);
}

//console.log(data);

  return (
  <View style={styles.container}>
    <Text style={[,{fontSize: 18,margin:10}]}>What is your name?</Text>
      <TextInput 
        style={[styles.text_input,{backgroundColor:"silver"}]} 
        placeholder='Enter your name'
        onChangeText={name=>setName(name)}
        value={name} 
        keyboardType='default'
        />
        <Button
          onPress={_alert}
          title="Say Hello"
        />
    </View>
  );  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    //alignItems: 'center',

  },
  text_input: {
    color: 'black',
    margin: 10,
    padding: 10,
    borderRadius: 5,
  }
});
