import React from "react"
import Icon from "react-native-vector-icons/FontAwesome6"
import { View } from "react-native"
import { Text } from "./Text"

const EmptyFallback = () => {
  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center',marginTop:"15%"}}>
      <Icon name={'boxes-packing'} size={60} color="#2292EE" style={{ marginBottom:10 }} />
      <Text>No items </Text>

    </View>
  )
}

export default EmptyFallback
