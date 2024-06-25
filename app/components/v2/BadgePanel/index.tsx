import { View } from "react-native"
import React from "react"
import { Text } from "app/components/v2"

export default function BadgeOutofdate({
  placeholder,
  top = -20,
  right = -50,
  height = 70,
  bottom,
  left,
  textMarginRight = 0,
  textMarginBottom = 10,
}: {
  placeholder: string
  top?: number
  height?: number
  right?: number
  bottom?: number
  textMarginRight?: number
  textMarginBottom?: number
  left?: number
}) {
  return (
    <View
      style={{
        fontSize: 12.5,
        borderRadius: 0,
        backgroundColor: "red",
        position: "absolute",
        alignItems: "center",
        justifyContent: "flex-end",
        right: right,
        height: height,
        zIndex: 0,
        width: 120,
        top: top,

        transform: [{ rotate: "45deg" }],
      }}
    >
      <Text
        whiteColor
        style={{ marginBottom: textMarginBottom, marginRight: textMarginRight }}
        caption2
      >
        {placeholder}
      </Text>
    </View>
  )
}
