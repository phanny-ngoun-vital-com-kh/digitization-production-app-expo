import { Text } from "app/components/v2"
import React from "react"
import { TouchableOpacity, View, TouchableOpacityProps } from "react-native"

type StateButtonProps = {
  color: string
  placeholder: string
  isSelected?: boolean
  onPress?: () => void
} & TouchableOpacityProps
const StateButton = ({ color, placeholder, isSelected, onPress, ...props  }: StateButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} {...props}>
      <View
        style={{
          borderColor: color,
          borderWidth: 1,
          borderRadius: 7,
          paddingHorizontal: 25,
          paddingVertical: 8,
          backgroundColor: isSelected ? color : "transparent",
        }}
      >
        <Text primaryColor body2 style={{ color: !isSelected ? color : "white" }}>
          {placeholder}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default StateButton
