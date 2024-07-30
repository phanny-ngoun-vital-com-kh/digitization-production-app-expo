import "@expo/metro-runtime"
import 'react-native-gesture-handler';
import React from "react"
import * as SplashScreen from "expo-splash-screen"
import App from "./app/app"
import messaging from '@react-native-firebase/messaging'
import { useState } from "react"
import NotificSoundModal from "app/components/v2/NotificSoundModal"
import { useEffect } from "react"
import { Platform } from "react-native"
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

SplashScreen.preventAutoHideAsync()

// Rest of your application code goes here

function IgniteApp() {
  const [isNotiVisible, setNotiVisible] = useState(false);
  const [remsg, setReMsg] = useState()

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

    const requestPermissions = async () => {
      console.log('Requesting notification permissions...');
      const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      if (status !== 'granted') {
        const { status: newStatus } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        if (newStatus !== 'granted') {
          console.warn('Notification permissions not granted');
        } else {
          console.log('Notification permissions granted');
        }
      } else {
        console.log('Notification permissions already granted');
      }
    };

    setupNotificationChannel();
    requestPermissions();
  }, []);
  const authStatus = messaging().requestPermission()
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL

  if (enabled) {
    console.log("Authorization status:", authStatus)
  }
  // export const ForegroundNotification = () =>{
  //   useEffect(()=>{
  //     const noti = messaging().onMessage(async message =>{
  //       console.log('foreground message',message)
  //       const {messageId,notification} = message
  //       PushNotification.localNotification({
  //         channelId:'channel-id',
  //         messageId:messageId,
  //         title:notification.title,
  //         body:notification.body,
  //         soundName:'default',
  //         vibrate:true,
  //         playSound:true
  //       })
  //     })
  //     return noti
  //   },[])
  //   return null
  // }


  messaging().onMessage(async remoteMessage => {
    // try {
    //   await notifee.createChannel({
    //     id: 'channel-id',
    //     name: 'Channel Name',
    //     // importance: notifee.Importance.HIGH,
    //     // Other channel options
    //   });
    //   console.log('Notification channel created successfully');
    // } catch (error) {
    //   console.error('Error creating notification channel:', error);
    // }
    const { notification } = remoteMessage
    setReMsg(remoteMessage)
    // Display a notification
    setNotiVisible(true)
    // await notifee.displayNotification({
    //   title: notification.title,
    //   body: notification.body,
    //   android: {
    //     channelId: 'channel-id',
    //   },
    // });
  });

  // Foreground notification handler
  // messaging().onMessage(async remoteMessage => {
  //   const {messageId,notification} = remoteMessage
  //       PushNotification.localNotification({
  //         channelId:'channel-id',
  //         messageId:messageId,
  //         title:notification.title,
  //         body:notification.body,
  //         soundName:'default',
  //         vibrate:true,
  //         playSound:true
  //       })
  // });


  messaging().setBackgroundMessageHandler(async message => {
    console.log(message)
  })
  return <>
    <App hideSplashScreen={SplashScreen.hideAsync} />
    <NotificSoundModal
      color={remsg?.notification.title == 'New Transfer Request' || remsg?.notification.title == 'Rejected' ? "red" : 'green'}
      message={remsg?.notification.body}
      title={remsg?.notification.title}
      onClose={() => setNotiVisible(false)}
      isVisible={isNotiVisible}
    />
  </>
}

export default IgniteApp
