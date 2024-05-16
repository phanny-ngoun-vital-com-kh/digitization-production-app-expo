import React from "react"
import Icon from "react-native-vector-icons/FontAwesome6"
import { View, ViewStyle } from "react-native"
import { Text } from "./v2"

const EmptyFallback = ({ placeholder = "No Items" }: { placeholder: string }) => {
  return (
    <View style={$useFlex}>
      <Icon name={"boxes-packing"} size={60} color="#2292EE" style={{ marginBottom: 10 }} />
      <Text>{placeholder} </Text>
    </View>
  )
}

const $useFlex: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  marginTop: "15%",
}
export default EmptyFallback
