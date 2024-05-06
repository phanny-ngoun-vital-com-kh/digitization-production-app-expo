/* eslint-disable react-native/sort-styles */
import { Dimensions, StyleSheet } from "react-native";

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default StyleSheet.create({
  viewTextTitle: {
    flexDirection: 'column',
    alignContent: 'space-between',
    alignItems: 'center',
    marginTop: 40
  },
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    width: '30%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    height: '70%'
  },
  title: {
    fontSize: 24,
    color: 'black',
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '100%',
    // borderColor: 'black',
    // borderWidth: 1,
    backgroundColor: 'white',
    // marginBottom: 20,
    paddingLeft: 10,
    marginTop: 10
  },
  button: {
    backgroundColor: "#2292EE",
    padding: 10,
    borderRadius: 5,
    width: '100%',
    marginTop: 50
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  img: {
    height: screenHeight,
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
