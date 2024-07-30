import { View } from "react-native"

export const customDataPoint = (color: string) => {
  return (
    <View
      style={{
        width: 10,

        height: 10,

        backgroundColor: "white",

        borderWidth: 3,

        borderRadius: 15,

        borderColor: color,
      }}
    />
  )
}
