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
import React, { useState } from "react"
import { TouchableOpacity, useColorScheme } from "react-native"
import * as Screens from "app/screens"
import Config from "../config"
import { useStores } from "../models"
import DrawerContent from "./DrawerContent"
import { DemoNavigator, DemoTabParamList } from "./DemoNavigator"
import { createDrawerNavigator } from "@react-navigation/drawer"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import Icon from "react-native-vector-icons/Entypo"
import { Text } from "app/components/v2"
import { colors } from "app/theme"
import { AuthScreen } from "app/screens/auth"
import { HomeScreen } from "app/screens/home"
import { AddTransferRequestFormScreen } from "app/screens/inventory-transfer-request-production/add-transfer-request-form"
import { InventoryTransferRequestProductionScreen } from "app/screens/inventory-transfer-request-production"
import { InventoryTransferRequestWarehouseScreen } from "app/screens/inventory-transfer-request-warehouse"
import { InventoryTransferScreen } from "app/screens/inventory-transfer"
import { api } from "app/services/api"
import { AddTransferScreen } from "app/screens/inventory-transfer-request-warehouse/add-transfer"
import { Treatment } from "app/models/water-treatment/water-treatment-model"
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

export type WTP2ParamsForm = {
  type: string
  item: Treatment
}
export type AppStackParamList = {
  Welcome: undefined
  Login: undefined
  login: undefined
  Home: undefined
  AddTransferRequestForm: undefined
  InventoryTransfer: undefined
  AddTransfer: undefined
  InventoryTransferRequestWarehouse: undefined
  InventoryTransferRequestProduction: undefined
  Demo: NavigatorScreenParams<DemoTabParamList>
  // 🔥 Your screens go here
  WaterTreatment: undefined
  HccpMonitor: undefined
  WaterTreatmentDetail: undefined
  WaterTreatmentRequest: undefined
  DailyWtcRecord: undefined
  // WaterTreatmentControl: undefined
  WaterTreatmentControlForm: undefined
  PrewaterTreatment: undefined
  WaterTreatmentControlList: undefined
  DailyHaccpLineDetail: undefined
  WaterTreatmentPlant2Form: WTP2ParamsForm
  HaccpLineForm: undefined
  PreWaterForm1: undefined
  PreWaterForm2: undefined
  GiftChart: undefined
  Dashboard: undefined
  PreWaterDs: undefined
  LineDs: undefined
  DailyDs: undefined
  ScanMachine: undefined
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
  const [username, setUsername] = useState("")

  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} username={username} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen
        name="AppStack"
        options={{
          swipeEnabled: false, //disable drawer when swipe accidentally at empty screen that do not have drawer
        }}
      >
        {(props) => <AppStack {...props} setUsername={setUsername} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  )
})

const AppStack = observer(function AppStack(props: {
  setUsername: React.Dispatch<React.SetStateAction<string>>
}) {
  const {
    authenticationStore: { isAuthenticated },
    authStore: { getUserInfo },
  } = useStores()
  const navigation = useNavigation()

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, navigationBarColor: colors.background }}
      initialRouteName={isAuthenticated ? "Welcome" : "login"}
    >
      {isAuthenticated ? (
        <>
          {/* <Stack.Screen name="Welcome" component={Screens.WelcomeScreen} /> */}

          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              headerShown: true,
              headerLeft: () => {
                return (
                  <Icon
                    name="menu"
                    color={"#2292EE"}
                    size={30}
                    style={{ marginRight: 20 }}
                    onPress={() => {
                      const getName = async () => {
                        try {
                          const rs = await getUserInfo()
                          props.setUsername(rs.data.firstName + " " + rs.data.lastName)
                        } catch (e) {
                          console.log(e)
                        }
                      }
                      getName()
                      // props.setUsername('updatedUsername'); // Set the username here
                      navigation.dispatch(DrawerActions.openDrawer())
                    }}
                  />
                )
              },
            }}
          />
          <Stack.Screen
            name="InventoryTransferRequestProduction"
            component={InventoryTransferRequestProductionScreen}
            options={{
              headerShown: true,
              title: "Inventory Transfer Request",
              headerRight: () => (
                <TouchableOpacity
                  style={{ flexDirection: "row", alignItems: "center" }}
                  onPress={() => {
                    navigation.navigate("AddTransferRequestForm" as never)
                  }}
                >
                  <Icon name="plus" size={25} />
                  <Text style={{ fontSize: 18 }}> Add New</Text>
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="AddTransferRequestForm"
            component={AddTransferRequestFormScreen}
            options={{ headerShown: true }}
          />
          <Stack.Screen
            name="InventoryTransferRequestWarehouse"
            component={InventoryTransferRequestWarehouseScreen}
            options={{ headerShown: true, title: "Inventory Transfer Request" }}
          />
          <Stack.Screen
            name="InventoryTransfer"
            component={InventoryTransferScreen}
            options={{ headerShown: true, title: "Inventory Transfer" }}
          />
          <Stack.Screen
            name="AddTransfer"
            component={AddTransferScreen}
            options={{ headerShown: true }}
          />
          <Stack.Screen
            name="WaterTreatment"
            component={Screens.WaterTreatmentScreen}
            options={{
              headerShown: true,
              title: "Daily Water Treatment Plant 2",
            }}
          />

          <Stack.Screen
            name="WaterTreatmentControlList"
            component={Screens.WaterTreatmentControlListScreen}
            options={{
              headerShown: true,
              title: "Water Control",
            }}
          />

          {/* <Stack.Screen
            name="WaterTreatmentControlForm"
            component={Screens.WaterTreatmentControlFormScreen}
            options={{
              headerShown: true,
              title: "Daily Pre Water Form",
            }}
          /> */}

          {/* <Stack.Screen
            name="WaterTreatmentControl"
            component={Screens.WaterTreatmentControlScreen}
            options={{
              headerShown: true,
              title: "Water Control",
            }}
          /> */}
          <Stack.Screen
            name="PrewaterTreatment"
            component={Screens.PrewaterTreatmentScreen}
            options={{
              headerShown: true,
              title: "Pre Water Treatment",
            }}
          />
          <Stack.Screen
            name="HccpMonitor"
            component={Screens.HccpMonitorScreen}
            options={{
              headerShown: true,
              title: "HCCP Monitor",
            }}
          />
          <Stack.Screen name="HaccpLineForm" component={Screens.HaccpLineFormScreen} />

          <Stack.Screen
            name="DailyHaccpLineDetail"
            component={Screens.DailyHaccpLineDetailScreen}
            options={{
              headerShown: true,
              title: "Line - ",
            }}
          />
          <Stack.Screen
            name="WaterTreatmentPlant2Form"
            component={Screens.WaterTreatmentPlant2FormScreen}
            options={{
              headerShown: true,
              title: "Form",
            }}
          />
          <Stack.Screen
            name="PreWaterForm1"
            component={Screens.PreWaterForm1Screen}
            options={{
              headerShown: true,
              title: "Form 1",
            }}
          />
          <Stack.Screen
            name="PreWaterForm2"
            component={Screens.PreWaterForm2Screen}
            options={{
              headerShown: true,
              title: "Form 2",
            }}
          />

          <Stack.Screen
            name="Dashboard"
            component={Screens.DashboardScreen}
            options={{
              headerShown: true,
              title: "Dashboard",
            }}
          />
          <Stack.Screen
            name="PreWaterDs"
            component={Screens.PreWaterDsScreen}
            options={{
              headerShown: true,
              title: "Pre Water Treatment",
            }}
          />
          <Stack.Screen
            name="LineDs"
            component={Screens.LineDsScreen}
            options={{
              headerShown: true,
              title: "Line",
            }}
          />
          <Stack.Screen
            name="DailyDs"
            component={Screens.DailyDsScreen}
            options={{
              headerShown: true,
              title: "Daily Water",
            }}
          />
          <Stack.Screen
            name="ScanMachine"
            component={Screens.ScanMachineScreen}
            options={{
              headerShown: true,
              title: "Current Count",
            }}
          />

          {/* <Stack.Screen name="Demo" component={DemoNavigator} /> */}
        </>
      ) : (
        <>
          <Stack.Screen name="login" component={AuthScreen} options={{ headerShown: false }} />
        </>
      )}

      {/** 🔥 Your screens go here */}

      {/* <Stack.Screen name="WaterTreatmentDetail" component={Screens.WaterTreatmentDetailScreen} /> */}

      {/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}
    </Stack.Navigator>
  )
})

export interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

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
      username && password && (await doLogin(username, password))
    },
  })

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      {...props}
    >
      <DrawerScreen />
    </NavigationContainer>
  )
})
