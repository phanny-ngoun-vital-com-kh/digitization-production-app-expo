import { View, Text, TouchableOpacity } from "react-native"
import React from "react"
import { useNavigation } from "@react-navigation/native"

const QuickInspectHACCPlines = ({ machine = "Pressure Drop" }: { machine: string }) => {
  const navigation = useNavigation()

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("HaccpLineForm", {
          line: machine,
          haccp_id: 1,
          item: {},
          assign: true,
          isvalidDate: true,
          onRefresh: () => {},
        })
      }}
    >
      <Text>Click Here</Text>
    </TouchableOpacity>
  )
}

export default QuickInspectHACCPlines
