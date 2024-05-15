// import messaging, { FirebaseMessagingTypes } from "@react-native-firebase/messaging"
// import { Platform } from "react-native"
// import { PERMISSIONS, request } from "react-native-permissions"

// export const permission = async () => {
//   await request(
//     Platform.select({
//       android: PERMISSIONS.ANDROID.CAMERA,
//       ios: PERMISSIONS.IOS.CAMERA,
//     }),
//   )


//   await request(
//     Platform.select({
//       android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
//       ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
//     }),
//   )

//   const authStatus = await messaging().requestPermission()
//   const enabled =
//     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//     authStatus === messaging.AuthorizationStatus.PROVISIONAL

//   if (enabled) {
//     console.log("Authorization status:", authStatus)
//   }
// }


// export const notificationListener = (
//   listener: (message: FirebaseMessagingTypes.RemoteMessage) => any,
// ) => {
//   // Assume a message-notification contains a "type" property in the data payload of the screen to open

//   messaging().onNotificationOpenedApp((remoteMessage) => {
//     console.log(
//       "Notification caused app to open from background state:",
//       remoteMessage.notification,
//     )
//     // navigation.navigate(remoteMessage.data.type);
//   })

//   // Check whether an initial notification is available
//   messaging()
//     .getInitialNotification()
//     .then((remoteMessage) => {
//       if (remoteMessage) {
//         console.log("Notification caused app to open from quit state:", remoteMessage.notification)
//       }
//     })

//   return messaging().onMessage(listener)
// }

import axios from 'axios';
import { addNotificationReceivedListener } from 'expo-notifications';

interface Notification {
  to: string;
  title: string;
  body: string;
}

const sendPushNotification = async (recipientTokens: string[], title: string, body: string): Promise<void> => {
  const expoPushEndpoint = 'https://exp.host/--/api/v2/push/send';

  // Create an array of notification objects for each recipient token
  const notifications: Notification[] = recipientTokens.map(token => ({
    to: token,
    title: title,
    body: body,
  }));

  try {
    // Send the notifications asynchronously
    const responses = await Promise.all(
      notifications.map(notification =>
        axios.post(expoPushEndpoint, notification, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip, deflate',
          },
        })
      )
    );

    responses.forEach((response, index) => {
      console.log(`Notification sent successfully to ${recipientTokens[index]}:`, response.data);
    });
  } catch (error) {
    console.error('Error sending notifications:', error);
  }

  // Add a listener to handle foreground notifications
  const notificationListener = addNotificationReceivedListener(notification => {
    console.log('Received notification while app is in foreground:', notification);
    // Handle foreground notification here
  });
  notificationListener
  
};

export default sendPushNotification;