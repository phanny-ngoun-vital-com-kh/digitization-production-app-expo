
import { StyleSheet } from "react-native";
export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center'
    },
    model: {
        backgroundColor: 'white',
        marginTop: 'auto',
        marginBottom:'auto',
        padding: 20,
        borderRadius: 10,
        width: '40%',
        // height: '40%',
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
        marginTop: 10,
        marginBottom: 10
    },

    button: {
        width: '25%',
        marginLeft: 'auto',
    },
    button_cancel: {
        width: '20%',
        backgroundColor: '#2292EE',
    },
    button_view: {
        marginTop: '5%',
        flexDirection: 'row',
        width: '100%',
        justifyContent:'flex-end'
    },
    message: {
        marginTop: 30,
        // textAlign: 'center',
        // marginEnd:'auto'
      },
      title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginEnd:'auto',
        marginLeft:15
        // marginBottom: 10,
      },
});