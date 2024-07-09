import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'flex-end', // Align content to the end for right-side slide
    },
    container: {
      flex: 1,
      width:'60%',
      backgroundColor:'#fff',
      padding: 20, // Adjust as needed
    },
    modal: {
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 20,
      maxWidth: '80%', // Adjust as needed
      elevation: 5, // For Android shadow
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#d3d3d3',
        marginTop: 10,
        marginBottom: 10
    },
    text_main:{
        fontSize:16,
        color:'gray'
    },
    text_sub:{
        fontSize:16,
        fontWeight:'bold'
    },
    view_main:{
        marginTop:'2%',
        flexDirection:'row',
        width:'100%',
        marginBottom:'2%',
    },
    view_sub:{
        flexDirection:'row',
        width:'35%'
    },
    textHeader:{
        fontSize:14,
    }
  });