import React from "react"
import {styles} from "./styles"
import { View, ActivityIndicator } from "react-native"
import {Text} from "../../../components/v2"
const LoadingIndicator = ({placeholder = "Saving Record"}:{placeholder?:string}) => {
  return (
    <View style={styles.overlay}>
      <ActivityIndicator color="#8CC8FF" size={35} />
      <View style={{ marginVertical: 15 }}></View>
      <Text whiteColor textAlign={"center"}>
        {placeholder} ...
      </Text>
    </View>
  )
}

export default LoadingIndicator
