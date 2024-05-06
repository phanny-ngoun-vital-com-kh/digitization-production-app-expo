
import { StyleSheet } from "react-native";
export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    model: {
        backgroundColor: 'white',
        padding: 20,
        marginTop: '5%',
        borderRadius: 10,
        width: '45%',
        height: '26%',
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
        width: '20%',
        marginLeft: 'auto',
    },
    button_cancel: {
        marginLeft: '58%',
        width: '20%',
        backgroundColor: 'white',
        borderColor: 'gray',
        borderWidth: 1
    },
    butuon_view: {
        marginTop: 'auto',
        flexDirection: 'row',
        width: '100%'
    }

});