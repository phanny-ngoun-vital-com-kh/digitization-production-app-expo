import { Text } from "app/components/v2"
import React from "react"
import { TouchableOpacity, View } from "react-native"

type StateButtonProps = {
  color: string
  placeholder: string
  isSelected?: boolean
  onPress?:()=>void 
}
const StateButton = ({ color, placeholder, isSelected, onPress}: StateButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
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
