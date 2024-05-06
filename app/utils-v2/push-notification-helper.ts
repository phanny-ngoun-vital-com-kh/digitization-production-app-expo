import messaging, { FirebaseMessagingTypes } from "@react-native-firebase/messaging"
import { Platform } from "react-native"
import { PERMISSIONS, request } from "react-native-permissions"

export const permission = async () => {
  await request(
    Platform.select({
      android: PERMISSIONS.ANDROID.CAMERA,
      ios: PERMISSIONS.IOS.CAMERA,
    }),
  )


  await request(
    Platform.select({
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    }),
  )

  const authStatus = await messaging().requestPermission()
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL

  if (enabled) {
    console.log("Authorization status:", authStatus)
  }
}


export const notificationListener = (
  listener: (message: FirebaseMessagingTypes.RemoteMessage) => any,
) => {
  // Assume a message-notification contains a "type" property in the data payload of the screen to open

  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log(
      "Notification caused app to open from background state:",
      remoteMessage.notification,
    )
    // navigation.navigate(remoteMessage.data.type);
  })

  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log("Notification caused app to open from quit state:", remoteMessage.notification)
      }
    })

  return messaging().onMessage(listener)
}
