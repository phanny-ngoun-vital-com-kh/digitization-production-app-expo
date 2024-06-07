import NetInfo from "@react-native-community/netinfo"
export const checkConnectivitity = () => {
  return NetInfo.addEventListener((state) => {
    console.log("Connection type", state.type)
    console.log("Is connected?", state.isConnected)
  })

  // To unsubscribe to these update, just use:
}
