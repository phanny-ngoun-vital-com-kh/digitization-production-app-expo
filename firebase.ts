import * as firebase from 'firebase';
import 'firebase/messaging';
import messaging from '@react-native-firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyCxUbf9hr2DhBXrVa2ihb-Z-C5QNy7DCKQ",
    authDomain: "digitizationproduction.firebaseapp.com",
    projectId: "digitizationproduction",
    storageBucket: "digitizationproduction.appspot.com",
    messagingSenderId: "244489398431",
    appId: "1:244489398431:web:bc0c9cbd2bfe58a2c75aaa",
    measurementId: "G-C2R27WBL7V"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

  export default messaging;