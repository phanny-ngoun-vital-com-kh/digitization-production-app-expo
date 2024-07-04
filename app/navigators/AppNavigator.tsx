/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import {
  DarkTheme,
  DefaultTheme,
  DrawerActions,
  NavigationContainer,
  NavigatorScreenParams,
  useNavigation,
} from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import React, { useEffect, useState } from "react"
import { Platform, StatusBar, TouchableOpacity, useColorScheme } from "react-native"
import Config from "../config"
import { useStores } from "../models"
import DrawerContent from "./DrawerContent"
import { DemoNavigator, DemoTabParamList } from "./DemoNavigator"
import { createDrawerNavigator } from '@react-navigation/drawer';
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import Icon from "react-native-vector-icons/Entypo"
import { Text } from "../components/v2"
import { colors } from "../theme"
import { AuthScreen } from "../screens/auth"
import { HomeScreen } from "../screens/home"
import { AddTransferRequestFormScreen } from "../screens/inventory-transfer-request-production/add-transfer-request-form"
import { InventoryTransferRequestProductionScreen } from "../screens/inventory-transfer-request-production"
import { InventoryTransferRequestWarehouseScreen } from "../screens/inventory-transfer-request-warehouse"
import { InventoryTransferScreen } from "../screens/inventory-transfer"
import { api } from "../services/api"
import { AddTransferScreen } from "../screens/inventory-transfer-request-warehouse/add-transfer"
import * as Notifications from 'expo-notifications';
import NotificSoundModal from "../components/v2/NotificSoundModal/index"
import sendPushNotification from "app/utils-v2/push-notification-helper"

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type AppStackParamList = {
  Welcome: undefined
  Login: undefined
  login: undefined,
  Home: undefined,
  AddTransferRequestForm: undefined,
  InventoryTransfer: undefined,
  AddTransfer: undefined,
  InventoryTransferRequestWarehouse: undefined
  InventoryTransferRequestProduction: undefined
  Demo: NavigatorScreenParams<DemoTabParamList>
  // 🔥 Your screens go here
  // IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
}

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()
const Drawer = createDrawerNavigator()

const DrawerScreen = observer(function DrawerScreen() {

  const [username, setUsername] = useState('');

  return (
    <Drawer.Navigator
      drawerContent={props => <DrawerContent {...props} username={username} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="AppStack" >
        {props => <AppStack {...props} setUsername={setUsername} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  )
});

const AppStack = observer(function AppStack(props: { setUsername: React.Dispatch<React.SetStateAction<string>> }) {

  const {
    authenticationStore: { isAuthenticated },
    authStore: { getUserInfo }
  } = useStores();
  const navigation = useNavigation();
  // const [message, setMessage] = useState()
  // const [isNotiVisible, setNotiVisible] = useState(false);

  // try {
  //   Notifications.setNotificationHandler({
  //     handleNotification: async (notification) => {
  //       const { title, body } = notification.request.content.data;
  //       setMessage(notification)

  //       console.log("Received notification with title:", title);
  //       console.log("Received notification with message:", body);
  //       setNotiVisible(true);
  //       return {
  //         shouldShowAlert: true,
  //         shouldPlaySound: true,
  //         shouldSetBadge: false,
  //       };
  //     },
  //   });
  // } catch (e) {
  //   console.log(e)
  // }

  // console.log('hii11')
  return (
      <Stack.Navigator
        screenOptions={{ headerShown: false, navigationBarColor: colors.background }}
        initialRouteName={isAuthenticated ? "Welcome" : "login"}
      >
        {isAuthenticated ? (
          <>
            {/* <Stack.Screen name="Welcome" component={Screens.WelcomeScreen} /> */}

            <Stack.Screen name="Home" component={HomeScreen} options={{
              headerShown: true,
              headerLeft: () => {
                return (
                  <Icon
                    name="menu"
                    color={'#2292EE'}
                    size={30}
                    style={{ marginRight: 20 }}
                    onPress={() => {
                      const getName = async () => {
                        try {
                          const rs = await getUserInfo();
                          props.setUsername(rs.data.firstName + ' ' + rs.data.lastName)
                        } catch (e) {
                          console.log(e);
                        }
                      };
                      getName();
                      // props.setUsername('updatedUsername'); // Set the username here
                      navigation.dispatch(DrawerActions.openDrawer());
                    }}
                  />
                )
              },
            }} />
            <Stack.Screen name="InventoryTransferRequestProduction" component={InventoryTransferRequestProductionScreen} options={{ headerShown: true, title: 'Inventory Transfer Request', headerRight: () => <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => { navigation.navigate('AddTransferRequestForm' as never) }}><Icon name='plus' size={25} /><Text style={{ fontSize: 18 }}> Add New</Text></TouchableOpacity> }} />
            <Stack.Screen name="AddTransferRequestForm" component={AddTransferRequestFormScreen} options={{ headerShown: true }} />
            <Stack.Screen name="InventoryTransferRequestWarehouse" component={InventoryTransferRequestWarehouseScreen} options={{ headerShown: true, title: 'Inventory Transfer Request' }} />
            <Stack.Screen name="InventoryTransfer" component={InventoryTransferScreen} options={{ headerShown: true, title: 'Inventory Transfer' }} />
            <Stack.Screen name="AddTransfer" component={AddTransferScreen} options={{ headerShown: true }} />

            {/* <Stack.Screen name="Demo" component={DemoNavigator} /> */}
          </>
        ) : (
          <>
            <Stack.Screen name="login" component={AuthScreen} options={{ headerShown: false}} />
          </>
        )}

        {/** 🔥 Your screens go here */}
        {/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}
      </Stack.Navigator>
  )
})

export interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> { }

export const AppNavigator = observer(function AppNavigator(props: NavigationProps) {
  const colorScheme = useColorScheme()

  const {
    authenticationStore: { authToken, setTimeout, logout, username, password },
    authStore: { doLogin },
  } = useStores()
  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  api.setAppInitConfig({
    token: () => authToken,
    clearToken: async () => {
      await logout()
    },
    sessionTimeout() {
      setTimeout(true)
    },
    async login() {
      username && password && await doLogin(username, password)
    },
  })

  const isDarkMode = colorScheme === "dark"

  useEffect(() => {
    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor(isDarkMode ? "black" : "white", true)
    }
    StatusBar.setBarStyle(isDarkMode ? "light-content" : "dark-content", true)
    // setForceDark(isDarkMode)
  }, [isDarkMode])


  // try{
  //   Notifications.setNotificationHandler({
  //     handleNotification: async (notification) => {
  //       const { title, body } = notification.request.content.data;
  //       setMessage(notification)

  //       console.log("Received notification with title:", title);
  //       console.log("Received notification with message:", body);
  //       setNotiVisible(true);
  //       return {
  //         shouldShowAlert: true,
  //         shouldPlaySound: true,
  //         shouldSetBadge: false,
  //       };
  //     },
  //   });
  // }catch(e){
  //   console.log(e)
  // }

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      {...props}
    >
      <DrawerScreen />
      {/* <NotificSoundModal
        color={message?.request.content.title == 'New Transfer Request' || message?.request.content.title == 'Rejected' ? "red" : 'green'}
        title={message?.request.content.title}
        message={message?.request.content.body}
        onClose={() => setNotiVisible(false)}
        isVisible={isNotiVisible}
      /> */}
    </NavigationContainer>
  )
})
