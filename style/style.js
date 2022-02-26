import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    marginTop: 30,
    marginBottom: 15,
    backgroundColor: 'indianred',
    flexDirection: 'row',
  },
  footer: {
    backgroundColor: 'indianred',
    flexDirection: 'row',
    width: "100%",
    bottom: 0,
    position: 'absolute',
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    flex: 1,
    fontSize: 23,
    textAlign: 'center',
    margin: 10,
  },
  author: {
    color: '#fff',
    fontWeight: 'bold',
    flex: 1,
    fontSize: 15,
    textAlign: 'center',
    margin: 10,
  },
  gameboard: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  gameinfo: {
    backgroundColor: '#fff',
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 20,
    marginTop: 10
  },
  row: {
    marginTop: 20,
    padding: 10
  },
  flex: {
    flexDirection: "row"
  },
  button: {
    margin: 30,
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#F08080",
    width: 150,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color:"#035087",
    fontWeight: "bold",
    fontSize: 20
  },
  playerName:{
    marginTop: "5%",
    color: 'black',
    fontWeight: '600',
    fontStyle: 'italic',
    fontSize: 15,
    textAlign: 'center',
  },
  center:{
    fontSize: 15,
    textAlign: 'center',
  }
});