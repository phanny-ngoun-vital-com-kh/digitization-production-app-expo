
import { StyleSheet } from "react-native";
export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center'
    },
    model: {
        backgroundColor: 'white',
        padding:0,
        marginTop: '5%',
        // borderRadius: 10,
        width: '45%',
        height: '65%',
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
        marginLeft: '48%',
        width: '25%',
        backgroundColor: 'white',
        borderColor: 'gray',
        borderWidth: 1
    },
    butuon_view: {
        marginTop: '5%',
        flexDirection: 'row',
        width: '100%'
    },
    input: {
        borderWidth: 1,
        backgroundColor: '#fff',
        borderColor: '#696969',
        marginLeft: '7%',
        width: '93%',
        height: 47,
        marginTop: '2%',
        borderRadius: 10,
    }

});