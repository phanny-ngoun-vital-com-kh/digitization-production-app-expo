import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.59)',
        zIndex:10000,
        justifyContent:"center"
     
      },
      input:{
        borderWidth: 1, 
        backgroundColor: '#fff', 
        borderColor: '#f1f1f1', 
        height: 47, 
        borderRadius: 3, 
        padding:10,
      },
})
