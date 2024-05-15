
import { StyleSheet } from "react-native";
export default StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    model: {
        backgroundColor: 'white',
        padding: 20,
        marginTop: '5%',
        borderRadius: 10,
        width: '70%',
        maxHeight: '70%',
        // maxHeight: 400,
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

    main_view:{
        flexDirection: 'row', 
        width: '100%'
    },
    sub_view:{
        width: '31%', 
        margin: 10
    },
    text:{
        marginBottom:'3%'
    },
    textHeader: {
        fontSize: 15,
    },
    menu: {
        alignItems: 'center',
        justifyContent: 'center',
      },
      menuText: {
        fontSize: 15,
        color: '#000',
        margin: 5
      },
});