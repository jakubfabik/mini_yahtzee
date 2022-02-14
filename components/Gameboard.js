import styles from '../style/style';
import React, {useState, useEffect, useCallback} from 'react';
import {Text, View, Pressable, NativeModules} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

let cubes = [{},{},{},{},{}]; //important for constructor at getDices
let circles = [{},{},{},{},{},{}];  //important for constructor at getCircles
for (let i = 1; i <= 6; i++){
  circles[i] = {name:'numeric-' + i + '-circle', color: "#0c95f7", multiplicator: 0, selected: false, counted: false};
}
let locks = {circles: false, cubes: false};
const NBR_OF_DICES = 5;
const NBR_OF_THROWS = 3;

export default function Gameboard() {
  const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS);
  const [Total, setTotal] = useState(0);
  const [action, setAction] = useState(0);  //I am usin this state var for counting actions and also to rerender bacic js parts
  const [status, setStatus] = useState('');
  const [round, setRound] = useState(1);
  const [bonusCount, setBonusCount] = useState(63);
  const [bonusAdded, setBonusAdded] = useState(false);
  const [buttonMes, setButtonMes] = useState("Throw dices");
  const [selected, setSelected] = useState(false);


  function throwDices() {   //Showtime
    if(buttonMes === "New game"){NativeModules.DevSettings.reload();} //start new game
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
      if(Total > 62){setTotal(Total + 17); setBonusAdded(true)} //for example bonus points are +17 and lock forn no more bonus points
    }
  }

  function wasSelected(){   //Also counting the sum and counting bonus points
    let locked = 0;
    for(let i = 1;i <= 6; i++){
      if(circles[i].selected){locked = locked + 1} // end of round matching
    }
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
            if(round != 6){setSelected("3");}
            else{setSelected(0);}
            circles[i].counted = true;
            setStatus('Throw dices.');
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
  if(allselected === 6) {
    setStatus('Game over. All points selected.');
    setButtonMes('New game');  
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
