
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
        width: '80%',
        // height: '40%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        maxHeight: '80%'
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
        marginTop: '3%',
        flexDirection: 'row',
        width: '100%'
    },
    input: {
        borderWidth: 1,
        backgroundColor: '#fff',
        borderColor: '#696969',
        height: 47,
        borderRadius: 10,
    },
    textHeader: {
        fontSize: 18,
    },
    dropdownStyle: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        width:300
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
});