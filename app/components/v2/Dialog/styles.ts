import { StyleSheet, I18nManager } from "react-native";

export default StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
      },
      dialog: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        width: '70%',
        maxWidth: 400,
        height:210
      },
      title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginEnd:'auto',
        marginLeft:15
        // marginBottom: 10,
      },
      message: {
        marginTop: 30,
        textAlign: 'center',
        // marginEnd:'auto'
      },
      buttonContainer: {
        marginTop:'auto',
        flexDirection: 'row',
        justifyContent: 'center',
        marginStart:'auto'
      },
      button: {
        marginHorizontal: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        width:100,
      },
      buttonText: {
        color: 'white',
        fontSize: 16,
        textAlign:'center'
      },
});
