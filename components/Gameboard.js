import styles from '../style/style';
import React, {useState, useEffect, useCallback} from 'react';
import {Text, View, Pressable} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

let cubes = [{},{},{},{},{}]; //important for constructor at getDices
let circles = [{},{},{},{},{}];  //important for constructor at getCircles
for (let i = 1; i <= 6; i++){
  circles[i] = {name:'numeric-' + i + '-circle', color: "steelblue", multiplicator: 0, selected: false, blocked: false};
}
let locks = {circles: false, cubes: false};
const NBR_OF_DICES = 5;
const NBR_OF_THROWS = 3;
const WINNING_POINTS = 23;

export default function Gameboard() {
  const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS);
  const [Total, setTotal] = useState(0);
  const [action, setAction] = useState(0);
  const [status, setStatus] = useState('');

  function checkSelRow(){
    let selected = 0
    for (let i = 0; i < NBR_OF_DICES; i++){
      if(cubes[i].lock){
        selected = cubes[i].value;
        break;
      }
    }
    for (let i = 0; i < NBR_OF_DICES; i++){
      if(cubes[i].lock){
        if(cubes[i].value != selected){
          console.log("PROBLEM!!!!");
        }
      }
    }
  }

  function throwDices() {   //Showtime
    generateDices();
    setNbrOfThrowsLeft(nbrOfThrowsLeft-1);
    setAction(action+1);
    if(nbrOfThrowsLeft === 0){
      checkSelRow();
      blockSelCirc();
      generateDices(true);
    }
  }

  const generateDices = (overrideLock) => {
    for (let i = 0; i < NBR_OF_DICES; i++){
      let randomNumber = Math.floor(Math.random() * 6 + 1);
      if(!cubes[i].lock || overrideLock){
        cubes[i] = {name:'dice-' + randomNumber, color: "steelblue", lock: false, value: randomNumber};
      }
    }
  }

  const blockSelCirc = () => {
    for(let i = 1; i <= 6; i++){
      if(circles[i].selected){circles[i].blocked = true}
    }
  }

  const lock = (i) => {
    if(cubes[i].lock){
      cubes[i].lock = false;
      cubes[i].color = "steelblue";
    }
    else{
      cubes[i].lock = true;
      cubes[i].color = "black";
    }
    setAction(action+1);      //no idea why but withou this is not refreshing MaterialComunityIcons //dirty patch
    //console.log(cubes);
  }


//-----------
  const cubesVisual = [];
  const getDices = () =>{
    for (let i = 0; i < NBR_OF_DICES; i++){
      cubesVisual.push(
        <Pressable 
        key={'cube'+i}
        onPress={()=> lock(i)}>
          <MaterialCommunityIcons
          name={cubes[i].name}
          key={'cube'+i}
          size={50}
          color={cubes[i].color}
          />
        </Pressable>
      )
    }
}
getDices();
console.log("action " + action);
//------------

const circlesValue = () => {
  let counter = [];
  let i = 1;
  for (; i <= 6; i++){
    counter[i] = 0;
  }
  i = 0;
  for (; i < 5; i++){
    counter[cubes[i].value] = counter[cubes[i].value] + 1;
  }
  i = 1;
  for (; i <= 6; i++){
      if(!circles[i].blocked){
        if(circles[i].selected){
        circles[i].multiplicator = counter[i];  //write multiplication
        if(counter[i]){                         //if counter is higher than zero:
          circles[i].color = "black";           // black it
        }
        else{ 
          circles[i].color = "steelblue";  
          circles[i].selected = false;
        }
      }
      else{
        circles[i].multiplicator = 0;
        circles[i].color = "steelblue";
        circles.selected = false;
      }
    }
  }
}

function unlockDices(j){
  for(let i = 0; i < NBR_OF_DICES; i++){
    if(cubes[i].value === j){
      cubes[i].lock = false;
      cubes[i].color = "steelblue";
    }
  }
}

function roundCheck(j){   //this is connected with  oneRound variable
  let i = 1;
  for(;i <= 6; i++){
    if(circles[i].selected){
      if(circles[i].blocked){continue};
      if(i === j){
        continue;
      } 
      else{
        return false; // per one round can not be selected two collections
      }
    }
  }
  return true
}

function lockCircle(i){
  let j = 0;
  if(!circles[i].blocked & nbrOfThrowsLeft === 0){
    if(!circles[i].selected){
      if(roundCheck(i)) circles[i].selected = true;
    }
    else{
      circles[i].selected = false;
      unlockDices(i);
    }
  }
  setAction(action+1);
  //console.log(circles);
}

const circlesVisual = [];
const getCircles = () =>{
  circlesValue();
  for (let i = 1; i <= 6; i++){
    circlesVisual.push(
     <View key={'couple '+i} style={[styles.gameboard,{margin: 5}]}>
      <Text key={'multi '+i}>{circles[i].multiplicator * i}</Text>
      <Pressable 
        key={'cube'+i}
        onPress={()=> lockCircle(i)}>
          <MaterialCommunityIcons
            name={circles[i].name}
            key={'circle'+i}
            size={40}        
            color={circles[i].color}
          />
        </Pressable>
      </View> 
    )
  }
}
getCircles();
//-----------

useEffect(() => {
  checkWinner();
  if(nbrOfThrowsLeft === NBR_OF_THROWS){
    setStatus('Throw dices.');
  }
  if(nbrOfThrowsLeft < 0){
    setNbrOfThrowsLeft(NBR_OF_THROWS-1);
    setTotal(0);
  }
}, [nbrOfThrowsLeft]);

function checkWinner() {
  if(Total > 0 && nbrOfThrowsLeft === 0) {
    setStatus('You won, game over');
  }
  else if(nbrOfThrowsLeft === 0){
    setStatus('You did not win');
  }
  else{
    setStatus('Keep on throwing');
  }
}


  return(
    <View style={styles.gameboard}>
      <View style={styles.flex}>{cubesVisual}</View>
      <Text style={styles.gameinfo}>Throws left: {nbrOfThrowsLeft}</Text>
      <Text style={styles.gameinfo}>{status}</Text>
      <Pressable style={styles.button}
        onPress={() => throwDices()}>
          <Text style={styles.buttonText}>Throw dices</Text>
      </Pressable>
      <Text style={styles.gameinfo}>Total: {Total}</Text>
        <View style={styles.flex}>{circlesVisual}</View>
    </View>
  )
}
