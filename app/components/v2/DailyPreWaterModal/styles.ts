
import { StyleSheet } from "react-native";
export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    model: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '90%',
        height: '90%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#d3d3d3',
        marginTop:10,
        marginBottom:10
      },
      dropdownStyle: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
      },
      buttonStyle: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#696969',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        width: '100%',
        backgroundColor: '#fff',
      },
      buttonTextStyle: {
        color: '#333',
        fontSize: 18,
        textAlign: 'left',
      },
      buttonSearch:{width:'14%',
      justifyContent:'center',
      alignItems:'center',
      borderColor:'#2292EE',
      borderWidth:1,
      height: 46,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginTop: 20, 
      marginLeft:'0.5%'
    },
    dropdown: {
      marginLeft: 10,
      marginRight: 10,
      height: 50,
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 12,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
  
      elevation: 2,
    },
});