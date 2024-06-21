import { View } from "react-native"
import React from "react"
import { Text } from "app/components/v2"
type BadgeChartProps = {
  title: string
  bgColor?: string
}
const BadgeChart = ({ title, bgColor }: BadgeChartProps) => {
  return (
    <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
      <View
        style={{
          backgroundColor: bgColor || "#0081F8",
          width: 13,
          height: 13,
          borderRadius: 25,
        }}
      ></View>
      <Text caption1>
        {title}
      </Text>
    </View>
  )
}

export default BadgeChart
