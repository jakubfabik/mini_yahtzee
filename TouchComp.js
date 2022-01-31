import { StyleSheet, Text, View, Button} from 'react-native';
import React,{useState,useEffect}from 'react';


export default function TouchComp({text,color}) {
const [styleCol,setStyleCol] = useState("green");

function setColor(){
    if(color != undefined){
        setStyleCol(color);
    }
}
useEffect(()=>{setColor()});

  return (
    <View style={[styles.box,{backgroundColor:styleCol}]}>
        <Text style={[styles.text]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    box:{
        alignItems: 'center',
        paddingVertical: 30,
        paddingHorizontal: 8,
        justifyContent: 'center',
        backgroundColor: 'green',
        margin: 20,
      },
    text:{
        color: "white",
    }
});