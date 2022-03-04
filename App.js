import { Text, TextInput, View} from 'react-native';
import { useState, useEffect} from 'react';
import styles from './style/style';
import Header from './components/Header';
import Footer from './components/Footer';
import Gameboard from './components/Gameboard';
import { Col, Grid } from "react-native-easy-grid";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function App() {
  const [name,setName] = useState("");
  const [play,setPlay] = useState(false);
  const [score,setScore] = useState([]);
  const [rendScore, setRendScore] = useState([]);

  const getData = async () => {
    let temparr = [];
    try {
      const jsonValue = await AsyncStorage.getItem('@storage_Key')
      if(jsonValue != null){
        temparr = (JSON.parse(jsonValue));
        //console.log(temparr);
        setScore(temparr);

      }
      else {null;}
    } catch(e) {
      // error reading value
    }
  }
  //console.log(score);
  const storeData = async () => {
    let tempScore = [];
    for(let i = 0; i < score.length; i++){
      tempScore.push(score[i]);
    }
    try {
      const jsonValue = JSON.stringify(tempScore)
      await AsyncStorage.setItem('@storage_Key', jsonValue)
    } catch (e) {
      // saving error
    }
  }

  const clearAll = async () => {
    try {
      await AsyncStorage.clear()
    } catch(e) {
      // clear error
    }
  
    console.log('Done.')
  }

  useEffect(()=>{
    getData();
    clearAll();
    //console.log(saveScore);
  },[])

  useEffect(()=>{

    storeData();
  },[rendScore])

  useEffect(()=>{
    getScore();
  },[play])

  const saveScore = (data) =>{
    let tempData = score;
    if(tempData.length < 3){tempData.push(data);}
    else(checkAndPush(data));
    setScore(tempData);
    setScore(sortScore());
    getScore();
  }

  const sortScore = () => {
    let data = score;
    let len = data.length;
    let temp;
    for(let i = 0; i < len; i++){
      for(let j = i+1; j< len; j++){
        if(data[i].score > data[j].score){
          temp = data[i];
          data[i] = data[j];
          data[j] = temp;
        }
      }
    }
    return(data);
  }

  const checkAndPush = (slice) => {
    let data = score;
    let len = data.length;
    let pos = undefined;
    for(let i = 0; i < len; i++){
      if(slice.score > data[i].score){
        if((i != (len-1))){
          if(slice.score < data[i+1].score){
            pos = i;
          }
          else{
            pos = i;
        }
        }
      }
    }
    if(pos===undefined){return};
    if(pos===0){data[0] = slice}
    let j;
    for(j = 0; j < pos; j++){
        data[j] = data[j+1]; //move scores
      }
    if(pos===len){data[pos] = slice;} //write new score
    else{[data[j]= slice];}
    setScore(data);
  }

  const setColor = (i,len) => {
    if(len === 1 && i === 0){return {backgroundColor:"#ffc830"}}  
    if(len === 2 && i === 0){return {backgroundColor:"#e8e8e8"}}    
    if(len === 2 && i === 1){return {backgroundColor:"#ffc830"}}
    if(len === 3 && i === 0){return {backgroundColor:"#e3c8af"}}
    if(len === 3 && i === 1){return {backgroundColor:"#e8e8e8"}}
    if(len === 3 && i === 2){return {backgroundColor:"#ffc830"}}
  }

  const getScore = () => {
    let rendArr = [];
    let len = score.length;
    for (let i = 0; i < len; i++) {
        rendArr.push(
                <View key={i}>
                  <Grid style={[{marginLeft:"2%",flex:0,overflow: "hidden",borderRadius: 20,marginVertical: 5},setColor(i,len)]}>
                    <Col><Text style={[{marginLeft:"33%"}]}>{score[i].score}</Text></Col>
                    <Col><Text style={[{marginLeft:"27%"}]}>{score[i].date}</Text></Col>
                    <Col><Text style={[{marginLeft:"30%"}]}>{score[i].time}</Text></Col>
                    <Col><Text style={[{marginLeft:"37%"}]}>{score[i].name}</Text></Col>
                  </Grid>
                  </View>
        )
    setRendScore(rendArr);
    }

  }

  return (
    <View style={styles.container}>
      <Header/>
      {
      play?
      <Gameboard alias={name} saveScore={saveScore} />
      :
      <>
      <Text style={styles.gameinfo}>Weclome to dice game</Text>
      <Text style={styles.gameinfo}>Enter your  5 character nick name</Text>
      <TextInput
      style={[styles.gameinfo, {color:"indianred"}]}
      returnKeyType="next"
      placeholder='Your name'
      autoCapitalize="words"
      editable={true}
      onChangeText={text => setName(text.length>5?text.slice(0,5):text)}
      onSubmitEditing={()=> setPlay(true)}
      />
      </>
      }
      {play?
      <>
      <Text style={styles.playerName}>{name+" is plaing"}</Text>
      <Text style={styles.center}>Best scores:</Text>
      <View style={[{marginTop:10,marginHorizontal:35,}]}>
      <Grid style={[{marginBottom:20,flex:0}]}>
        <Col><Text style={[{marginLeft:"35%"}]}>score</Text></Col>
        <Col><Text style={[{marginLeft:"35%"}]}>date</Text></Col>
        <Col><Text style={[{marginLeft:"35%"}]}>time</Text></Col>
        <Col><Text style={[{marginLeft:"35%"}]}>name</Text></Col>
      </Grid>
      {rendScore}
      </View>
      </>
   
      :
      <></>
      }
      <Footer />
    </View>
  );
}

