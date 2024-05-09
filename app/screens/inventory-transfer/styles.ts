import { StyleSheet } from "react-native";

export default StyleSheet.create({

    textHeader: {
        fontSize: 18,
    },
    displayButton: {
        borderWidth: 3,
        margin: 5,
        padding: 10,
        borderRadius: 10,
        borderColor: 'gray'
    },
    modalcontainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center'
    },
    button: {
        width: '25%',
        // marginLeft: 'auto',
    },
    button_cancel: {
        marginLeft: 'auto',
        width: '13%',
        backgroundColor: 'white',
        borderColor: 'gray',
        borderWidth: 1
    },
    butuon_view: {
        marginTop: '5%',
        flexDirection: 'row',
        width: '100%'
    },
    model: {
        backgroundColor: 'white',
        marginTop: '5%',
        padding: 20,
        borderRadius: 10,
        width: '85%',
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
});
