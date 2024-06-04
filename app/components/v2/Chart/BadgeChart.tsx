import { View, Text } from "react-native"
import React from "react"
type BadgeChartProps = {
  title: string
  bgColor?: string
}
const BadgeChart = ({ title, bgColor }: BadgeChartProps) => {
  return (
    <View style={{flexDirection:"row",gap:5,alignItems:"center"}}>
      <View
        style={{
          backgroundColor: bgColor || "#0081F8",
          width: 16,
          height: 16,
          borderRadius: 25,
        }}
      ></View>
      <Text>{title}</Text>
    </View>
  )
}

export default BadgeChart
