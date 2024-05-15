import "@expo/metro-runtime"
import React from "react"
import * as SplashScreen from "expo-splash-screen"
import App from "./app/app"
import { LogBox } from 'react-native';

SplashScreen.preventAutoHideAsync()

// Ignore specific warning related to the "undefined-Regular" font family
LogBox.ignoreLogs(['fontFamily "undefined-Regular" is not a system font']);
// Rest of your application code goes here
function IgniteApp() {
  return <App hideSplashScreen={SplashScreen.hideAsync} />
}

export default IgniteApp
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      