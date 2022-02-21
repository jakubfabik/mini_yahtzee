import styles from '../style/style';
import React, {useState, useEffect, useCallback} from 'react';
import {Text, View, Pressable, NativeModules} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

let cubes = [{},{},{},{},{}]; //important for constructor at getDices
let circles = [{},{},{},{},{},{}];  //important for constructor at getCircles
function generateCircles(){
  for (let i = 1; i <= 6; i++){
    circles[i] = {name:'numeric-' + i + '-circle', color: "#0c95f7", multiplicator: 0, selected: false, counted: false};
  }
}
generateCircles();
let locks = {circles: false, cubes: false};
const NBR_OF_DICES = 5;
const NBR_OF_THROWS = 3;
const BONUS = 63;

export default function Gameboard() {
  const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS);
  const [Total, setTotal] = useState(0);
  const [action, setAction] = useState(0);  //I am usin this state var for counting actions and also to rerender bacic js parts
  const [status, setStatus] = useState('');
  const [round, setRound] = useState(1);
  const [bonusCount, setBonusCount] = useState(BONUS);
  const [bonusAdded, setBonusAdded] = useState(false);
  const [buttonMes, setButtonMes] = useState("Throw dices");
  const [selected, setSelected] = useState(false);
  const [wasSelOwerride, setWasSelOwerride] = useState(false);
  const [reset, setReset] = useState(false);


  function throwDices() {   //Showtime
    if(buttonMes === "New game"){setReset(true)} //start new game
    generateDices();
    setNbrOfThrowsLeft(nbrOfThrowsLeft-1);
    setAction(action+1);
    if(nbrOfThrowsLeft === 0){
      generateDices(true);
      setRound(round + 1);
    }
  }

  function checkBonus(){
    if(!bonusAdded){
      if(Total > 62){setTotal(Total + 17); setBonusAdded(true)} //for example bonus points are +17 and lock for no more bonus points
    }
  }

  const restart =() =>{
    generateDices();
    generateCircles();
    setNbrOfThrowsLeft(NBR_OF_THROWS);setTotal(0);setAction(0);setStatus('Throw dices.');;setRound(1);setBonusCount(BONUS);setBonusAdded(false);
    setButtonMes("Throw dices");setSelected(false);setWasSelOwerride(false);locks.circles=false;locks.cubes=false;setReset(false);
  }

  function wasSelected(){
    let locked = 0;
    for(let i = 1;i <= 6; i++){
      if(circles[i].selected){locked = locked + 1} // end of round matching
    }
    if(wasSelOwerride){return true} //in case the checkAvaSel() needs to end the game
    if(locked === round){return true}
    else{return false}
  }

  const generateDices = (overrideLock) => {
    for (let i = 0; i < NBR_OF_DICES; i++){
      let randomNumber = Math.floor(Math.random() * 6 + 1);
      if(!cubes[i].lock || overrideLock){
        cubes[i] = {name:'dice-' + randomNumber, color: "#0c95f7", lock: false, value: randomNumber};
      }
    }
  }

  const lock = (i) => {
    if(cubes[i].lock){
      cubes[i].lock = false;
      cubes[i].color = "#0c95f7";
    }
    else{
      cubes[i].lock = true;
      cubes[i].color = "#54000d";
    }
    setAction(action+1);
  }

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
        if(circles[i].selected){
          if(!circles[i].counted)circles[i].multiplicator = counter[i];  //write multiplication
          if(!circles[i].counted){
            setTotal(Total + circles[i].multiplicator * i);
            setStatus('Throw dices.');
            if(round != 6){setSelected("3");}
            else{
              setSelected(0);
              setStatus('Game over. All points selected.');
              setButtonMes('New game');  
            }
            circles[i].counted = true;
            
            setBonusCount(bonusCount - circles[i].multiplicator * i); // decrease bonus points
          }
          if(counter[i]){                         //if counter is higher then zero:
            circles[i].color = "#54000d";           // #54000d it
          }
      }
  }
  checkBonus();
}


function roundCheck(){   
  let counter = 0;
  for(let i = 0; i <= 6; i++){
    if(circles[i].selected){counter = counter + 1}
  }
  if(counter === round-1){return true}
  else{return false}
}

function endGame(){
  let allselected = 0;
  for(let i = 1; i <= 6; i++){
    if(circles[i].selected) {allselected = allselected + 1}
  }
}

function lockCircle(i){
  for(let j= 0; j < NBR_OF_DICES; j++){
    if(cubes[j].value === i){
      if(roundCheck() && nbrOfThrowsLeft === 0){
        circles[i].selected = true
        endGame();
        setAction(action+1);
        return null
      }
    }
  }
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

function checkAvaSel(){ //can be case is not possible to select points if cube value is not available
  let unselected = [];
  let index = 0;
  for(let i = 1; i <= 6 ; i++){
    if(!circles[i].selected){
      unselected[index] = i;
      index = index + 1;
    }
  }
  for(let j = 0; j < index; j++){
    for(let i = 0; i < 5; i++){
      if(cubes[i].value === unselected[j]){return true}
    }
}
  return false;
}

useEffect(() => {
  checkWinner();
  if(nbrOfThrowsLeft === NBR_OF_THROWS){
    setStatus('Throw dices.');
  }
  if(nbrOfThrowsLeft < 0){
    setNbrOfThrowsLeft(NBR_OF_THROWS - 1);
  }
}, [nbrOfThrowsLeft]);

useEffect(()=>{
  setSelected(false);
},[round])

useEffect(()=>{
  restart();
  setReset(false);
},[reset])

useEffect(()=>{
if(nbrOfThrowsLeft === 0){
    if(!checkAvaSel()){
      setStatus('Game over. Nothing else can be done.');
      setButtonMes('New game');
      setWasSelOwerride(true);
    }
  }
},[nbrOfThrowsLeft])

function checkWinner() {
  if(nbrOfThrowsLeft === 0){
    setStatus('Select your points');
  }
  else{
    setStatus('Select and throw dices again');
  }
}

  return(
    <View style={styles.gameboard}>
      <View style={styles.flex}>{cubesVisual}</View>
      <Text style={styles.gameinfo}>Throws left: {(selected)?selected:nbrOfThrowsLeft}</Text>
      <Text style={styles.gameinfo}>{status}</Text>
      <Pressable style={styles.button}
        onPress={() => ((nbrOfThrowsLeft === 0) && (!wasSelected()))?setStatus("Select your points before next throw"):throwDices()}>
          <Text style={styles.buttonText}>{buttonMes}</Text>
      </Pressable>
      <Text style={styles.gameinfo}>Total: {Total}</Text>
      <Text style={[styles.gameinfo,{fontSize: 15}]}>{bonusAdded?"You got the bonus!":"You are "+ bonusCount +" points away from bonus"}</Text>
        <View style={styles.flex}>{circlesVisual}</View>
    </View>
  )
}
