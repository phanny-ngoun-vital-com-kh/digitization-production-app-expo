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

// import axios from 'axios';
// import { addNotificationReceivedListener } from 'expo-notifications';

// interface Notification {
//   to: string;
//   title: string;
//   body: string;
// }

// const sendPushNotification = async (recipientTokens: string[], title: string, body: string): Promise<void> => {
//   const expoPushEndpoint = 'https://exp.host/--/api/v2/push/send?useFcmV1=true';
//   // const [data,setData]=useState()
//   // Create an array of notification objects for each recipient token
//   const notifications: Notification[] = recipientTokens.map(token => ({
//     to: token,
//     title: title,
//     body: body,
//   }));

//   try {
//     // Send the notifications asynchronously
//     const responses = await Promise.all(
//       notifications.map(notification =>
//         axios.post(expoPushEndpoint, notification, {
//           headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json',
//             'Accept-Encoding': 'gzip, deflate',
//           },
//         })
//       )
//     );
//     // console.log(responses)
//     responses.forEach((response, index) => {
//       if(response.data.data.status == 'ok'){
//         const responseData = JSON.parse(response.config.data);
//         // onSuccessSend(true,responseData)
//       }else{
//         // onSuccessSend(false,{})
//       }
//       console.log(`Notification sent successfully to ${recipientTokens[index]}:`, response.data);
//     });
//   } catch (error) {
//     // onSuccessSend(false,{})
//     console.error('Error sending notifications:', error);
//   }

//   // Add a listener to handle foreground notifications
//   addNotificationReceivedListener(notification => {
//     console.log('Received notification while app is in foreground:', notification);
//     // Handle foreground notification here
//   });
//   // notificationListener
// };

// export default sendPushNotification;

// import NotificSoundModal from 'app/components/v2/NotificSoundModal';
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { addNotificationReceivedListener } from 'expo-notifications';
// import { Platform } from 'react-native';
// import * as Notifications from 'expo-notifications';
// import * as Permissions from 'expo-permissions';
// // Example component that utilizes sendPushNotification

// interface Notification {
//   to: string;
//   title: string;
//   body: string;
// }

// const PushNotificationComponent: React.FC<{
//   recipientTokens: string[];
//   title: string;
//   body: string;
//   isVisible: boolean;
//   close:()=>void
// }> = ({ recipientTokens, title, body,isVisible=false ,close}) => {
//   const [isNotiVisible, setNotiVisible] = useState(false);
//   const [message,setMessage] = useState()

//   useEffect(() => {
//     const setupNotificationChannel = async () => {
//       if (Platform.OS === 'android') {
//         console.log('Setting up notification channel for Android...');
//         await Notifications.setNotificationChannelAsync('default', {
//           name: 'default',
//           importance: Notifications.AndroidImportance.MAX,
//           sound: 'default',
//           vibrationPattern: [0, 250, 250, 250],
//           lightColor: '#FF231F7C',
//         });
//         console.log('Notification channel set up successfully');
//       }
//     };

//     const requestPermissions = async () => {
//       console.log('Requesting notification permissions...');
//       const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
//       if (status !== 'granted') {
//         const { status: newStatus } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
//         if (newStatus !== 'granted') {
//           console.warn('Notification permissions not granted');
//         } else {
//           console.log('Notification permissions granted');
//         }
//       } else {
//         console.log('Notification permissions already granted');
//       }
//     };

//     setupNotificationChannel();
//     requestPermissions();
//   }, []);
  
//   const sendPushNotification = async (recipientTokens: string[], title: string, body: string): Promise<void> => {
//       const expoPushEndpoint = 'https://exp.host/--/api/v2/push/send?useFcmV1=true';
//       // const [data,setData]=useState()
//       // Create an array of notification objects for each recipient token
//       const notifications: Notification[] = recipientTokens.map(token => ({
//         to: token,
//         title: title,
//         body: body,
//       }));
    
//       try {
//         // Send the notifications asynchronously
//         const responses = await Promise.all(
//           notifications.map(notification =>
//             axios.post(expoPushEndpoint, notification, {
//               headers: {
//                 'Content-Type': 'application/json',
//                 'Accept': 'application/json',
//                 'Accept-Encoding': 'gzip, deflate',
//               },
//             })
//           )
//         );
//         // console.log(responses)
//         responses.forEach((response, index) => {
//           if(response.data.data.status == 'ok'){

//             setNotiVisible(true);
//             const responseData = JSON.parse(response.config.data);
//             setMessage(responseData)
            

//           }else{

//           }
//           console.log(`Notification sent successfully to ${recipientTokens[index]}:`, response.data);
          
//         });
//       } catch (error) {
//         console.error('Error sending notifications:', error);
//       }
    
//       // Add a listener to handle foreground notifications
//       addNotificationReceivedListener(notification => {
//         console.log('Received notification while app is in foreground:', notification);
//         // Handle foreground notification here
//       });
//       // notificationListener
//     };

//   useEffect(() => {
//     if (isVisible) {
//       sendPushNotification(recipientTokens, title, body);
//       close(); // Reset the isVisible state after sending the notification
//     }
//   }, [isVisible]);

//   return (
//     <>
//       {/* Notification modal */}
//       <NotificSoundModal
//         color={message?.title == 'New Transfer Request' || message?.title == 'Rejected' ? "red" : 'green'}
//         title={message?.title}
//         message={message?.body}
//         onClose={() => setNotiVisible(false)}
//         isVisible={isNotiVisible}
//       />
//     </>
//   );
// };

// export default PushNotificationComponent;

import NotificSoundModal from '../components/v2/NotificSoundModal';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as Notifications from 'expo-notifications';
// import * as Permissions from 'expo-permissions';
import { Platform } from 'react-native';

interface Notification {
  to: string;
  title: string;
  body: string;
}

const PushNotificationComponent: React.FC<{
  recipientTokens: string[];
  title: string;
  body: string;
  isVisible: boolean;
  close: () => void;
}> = ({ recipientTokens, title, body, isVisible = false, close }) => {
  const [isNotiVisible, setNotiVisible] = useState(false);
  const [message, setMessage] = useState<Notification | null>(null);

  useEffect(() => {
    const setupNotificationChannel = async () => {
      if (Platform.OS === 'android') {
        console.log('Setting up notification channel for Android...');
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          sound: 'default',
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
        console.log('Notification channel set up successfully');
      }
    };

    // const requestPermissions = async () => {
    //   console.log('Requesting notification permissions...');
    //   const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    //   if (status !== 'granted') {
    //     const { status: newStatus } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    //     if (newStatus !== 'granted') {
    //       console.warn('Notification permissions not granted');
    //     } else {
    //       console.log('Notification permissions granted');
    //     }
    //   } else {
    //     console.log('Notification permissions already granted');
    //   }
    // };

    setupNotificationChannel();
    // requestPermissions();
  }, []);

  const sendPushNotification = async (recipientTokens: string[], title: string, body: string): Promise<void> => {
    const expoPushEndpoint = 'https://exp.host/--/api/v2/push/send?useFcmV1=true';

    const notifications: Notification[] = recipientTokens.map(token => ({
      to: token,
      title: title,
      body: body,
      sound: 'default',
      channelId: 'default', // Ensure the channelId is set
    }));

    try {
      console.log('Sending notifications...');
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
        if (response.data.data.status === 'ok') {
          setNotiVisible(true);
          const responseData = JSON.parse(response.config.data);
          setMessage(responseData);
        } else {
          console.error(`Failed to send notification to ${recipientTokens[index]}:`, response.data);
        }
        console.log(`Notification sent successfully to ${recipientTokens[index]}:`, response.data);
      });
    } catch (error) {
      console.error('Error sending notifications:', error);
    }

    Notifications.addNotificationReceivedListener(notification => {
      console.log('Received notification while app is in foreground:', notification);
      setMessage({
        to: '',
        title: notification.request.content.title || '',
        body: notification.request.content.body || '',
      });
      setNotiVisible(true);
    });
  };

  useEffect(() => {
    if (isVisible) {
      console.log('Sending push notification as isVisible is true');
      sendPushNotification(recipientTokens, title, body);
      close(); // Reset the isVisible state after sending the notification
    }
  }, [isVisible]);

  return (
    <>
      {/* <NotificSoundModal
        color={message?.title === 'New Transfer Request' || message?.title === 'Rejected' ? 'red' : 'green'}
        title={message?.title}
        message={message?.body}
        onClose={() => setNotiVisible(false)}
        isVisible={isNotiVisible}
      /> */}
    </>
  );
};

export default PushNotificationComponent;
