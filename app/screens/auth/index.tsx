/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-single-element-style-arrays */
/* eslint-disable react-native/no-inline-styles */
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { useEffect, useState } from "react"
import { Text, TextInput, Icon } from "../../components/v2"
// import { useStores } from "../../models-v2"
import { TouchableOpacity, View, ImageBackground, ActivityIndicator } from "react-native"
import styles from "./style"
import { translate } from "../../i18n"
import { useStores } from "app/models"
import "firebase/messaging"
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from "react-native-alert-notification"
import { MobileUserModel } from "app/models/auth/AuthStore"
import * as Notifications from "expo-notifications"
import Constants from "expo-constants"


// const imageLogo = require("../../images/logo.png")

// interface LoginForm {
//   userName?: string
//   password?: string
// }

// const firebaseConfig = {
//   apiKey: "AIzaSyCxUbf9hr2DhBXrVa2ihb-Z-C5QNy7DCKQ",
//   authDomain: "digitizationproduction.firebaseapp.com",
//   projectId: "digitizationproduction",
//   storageBucket: "digitizationproduction.appspot.com",
//   messagingSenderId: "244489398431",
//   appId: "1:244489398431:web:bc0c9cbd2bfe58a2c75aaa",
//   measurementId: "G-C2R27WBL7V",
//   databaseURL: ''
// };

// Initialize Firebase
// if (!firebase.apps.length) {
//   console.log("Firebase not yet initialized. Initializing now...");
//   firebase.initializeApp(firebaseConfig);
// } else {
//   console.log("Firebase is already initialized.");
// }

export const AuthScreen = observer((props: StackScreenProps<{ login: undefined }, "login">) => {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptsCount, setAttemptsCount] = useState(0)
  const [fcmToken, setFcmToken] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const {
    authenticationStore: { username, setUsername, validationError },
    authStore,
  } = useStores()
  async function initDb() {

    // await waterTreatmentStore.loadWtp()
    // await waterTreatmentStore.syncDataToserver()
    // console.log("SQL is running")
  }


  useEffect(() => {
    registerForPushNotificationsAsync()
  }, [])

  useEffect(() => {
    initDb()
    const subscription = Notifications.addNotificationReceivedListener(handleNotification)
    return () => subscription.remove()
  }, [])

  const registerForPushNotificationsAsync = async () => {
    let token = null
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }
      if (finalStatus === "granted") {
        token = (await Notifications.getExpoPushTokenAsync()).data
        setFcmToken(token)
        console.log("Expo Push Token:", token)
        // Send this token to your Firebase backend to enable Firebase notifications
      } else {
        console.log("Failed to get push token for Expo notifications!")
      }
    } else {
      console.log("Must use physical device for push notifications")
    }
  }

  const handleNotification = (notification) => {
    console.log("Received notification:", notification)
  }

  // const handleLogin = () => {
  //   setPassword('')
  //   setUsername('')
  //   navigation.navigate('Home' as never)
  // };
  // PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

  // useEffect(() => {
  //   const getFCMToken = async () => {
  //     try {
  //       const token = await messaging().getToken();
  //       setFcmToken(token)
  //     } catch (error) {
  //       console.error('Error fetching FCM token:', error);
  //     }
  //   };

  //   getFCMToken();
  // }, []);
  // useEffect(() => {
  //   const firebaseConfig = {
  //     apiKey: "AIzaSyCxUbf9hr2DhBXrVa2ihb-Z-C5QNy7DCKQ",
  //     authDomain: "digitizationproduction.firebaseapp.com",
  //     projectId: "digitizationproduction",
  //     storageBucket: "digitizationproduction.appspot.com",
  //     messagingSenderId: "244489398431",
  //     appId: "1:244489398431:web:bc0c9cbd2bfe58a2c75aaa",
  //     measurementId: "G-C2R27WBL7V"
  //   };
  //   const firebaseApp = initializeApp(firebaseConfig);

  //   const messaging = (async () => {
  //     try {
  //       const isSupportedBrowser = await isSupported();
  //       if (isSupportedBrowser) {
  //         console.log(getMessaging(firebaseApp));
  //       }
  //       console.log('Firebase not supported this browser');
  //       return null;
  //     } catch (err) {
  //       console.log(err);
  //       return null;
  //     }
  //   })();

  //   messaging;
  // }, []);

  // useEffect(() => {
  //   const firebaseConfig = {
  //     apiKey: "AIzaSyCxUbf9hr2DhBXrVa2ihb-Z-C5QNy7DCKQ",
  //     authDomain: "digitizationproduction.firebaseapp.com",
  //     projectId: "digitizationproduction",
  //     storageBucket: "digitizationproduction.appspot.com",
  //     messagingSenderId: "244489398431",
  //     appId: "1:244489398431:web:bc0c9cbd2bfe58a2c75aaa",
  //     measurementId: "G-C2R27WBL7V"
  //   };
  //   if (!firebase.apps.length) {
  //     firebase.initializeApp(firebaseConfig);
  //   }

  //   const checkToken = async () => {
  //     const fcmToken = await messaging().getToken();
  //     if (fcmToken) {
  //       console.log(fcmToken);
  //     }
  //   }

  //   checkToken();
  // }, []);

  async function login() {
    setIsSubmitted(true)
    setIsLoading(true)
    setAttemptsCount(attemptsCount + 1)
    // if (validationError) return

    if (!password) {
      ;<View style={{ width: "100%" }}>
        <Text caption1 errorColor>
          {translate("loginScreen.passwordRequired")}
        </Text>
      </View>
      // If the password is not entered, show the error message and return
      return
    }
    try {
      // console.log(username,password)
      await authStore.doLogin(username, password)
      const rs = await authStore.getUserInfo()
      const authoritie = rs.data.authorities.map((authority_name: any) => ({
        user_id: rs.data.id,
        authority_name: authority_name,
      }))
      const data = MobileUserModel.create({
        user_id: rs.data.id,
        login: rs.data.login,
        fcm_token: fcmToken,
        authorities: authoritie,
      })

      authStore.saveCurrentInfo(data.login)
      authStore

        .saveUser(data)
        .saveMobileUser()

        .then()
        .catch((e) => console.log(e))
      // Make a request to your server to get an authentication token.
      // If successful, reset the fields and set the token.
      setIsSubmitted(false)
      setPassword("")
      setUsername("")
    } catch (error) {
      console.log(error)
      // Show error dialog
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: translate("loginScreen.failedLogin"),
        textBody: translate("loginScreen.failedLoginMessage"),
        button: "បិទ",
      })
    } finally {
      setIsLoading(false) // Reset loading state regardless of success or failure
    }
  }

  return (
    <AlertNotificationRoot>
      <View>
        <ImageBackground
          source={{
            uri: "https://www.onefraternity.com.kh/wp-content/uploads/2021/08/homepage-hero-image-2.jpg",
          }}
          blurRadius={8}
          resizeMode="stretch"
          style={styles.img}
        >
          <View style={styles.overlay}>
            <Text style={styles.title}>Production Digitization</Text>
            <View style={{ marginTop: "20%" }}>
              <Text>គណនី</Text>
              <TextInput
                style={styles.input}
                onChangeText={setUsername}
                value={username}
                autoCapitalize="none"
              />
            </View>
            {!username && isSubmitted && (
              <View style={{ width: "100%" }}>
                <Text caption1 errorColor>
                  {translate("loginScreen.userNameRequired")}
                </Text>
              </View>
            )}

            <View style={{ marginTop: 20 }}>
              <Text>លេខសម្ងាត់</Text>
              <TextInput
                style={[styles.input]}
                passwordRules="required: upper; required: lower; required: digit; max-consecutive: 2; minlength: 8;"
                onChangeText={(text) => setPassword(text)}
                autoCorrect={false}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                value={password}
                icon={
                  <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
                    <Icon size={20} name={showPassword ? "eye-slash" : "eye"} />
                  </TouchableOpacity>
                }
              />
            </View>
            {!password && isSubmitted && (
              <View style={{ width: "100%" }}>
                <Text caption1 errorColor>
                  {translate("loginScreen.passwordRequired")}
                </Text>
              </View>
            )}

            {/* <Button
            testID="login-button"
            // tx="ចូល"
            style={styles.button}
            // outline
            loading={loading}
            preset="reversed"
            onPress={login}

          >ចូល</Button> */}
            <TouchableOpacity style={styles.button} onPress={login}>
              {isLoading ? (
                <View style={{ flexDirection: "row", justifyContent: "center" }}>
                  <Text style={styles.buttonText}>ចូល</Text>
                  <ActivityIndicator color="white" />
                </View>
              ) : (
                <Text style={styles.buttonText}>ចូល</Text>
              )}
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </AlertNotificationRoot>
  )
})
