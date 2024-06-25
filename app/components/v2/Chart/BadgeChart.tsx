import { View } from "react-native"
import React from "react"
import { Text } from "app/components/v2"
type BadgeChartProps = {
  title: string
  bgColor?: string
  value?: number | null | string
}
const BadgeChart = ({ title, bgColor, value = null }: BadgeChartProps) => {
  return (
    <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
      <View
        style={{
          backgroundColor: bgColor || "#0081F8",
          width: 11,
          height: 11,
          borderRadius: 25,
        }}
      ></View>
      <Text  semibold caption2>
        {title} {value !== null && value.toString() + "%"}
      </Text>
    </View>
  )
}

export default BadgeChart
