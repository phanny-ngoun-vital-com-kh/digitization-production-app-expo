import { View, Text, TouchableOpacity } from "react-native"
import React from "react"
import { useNavigation } from "@react-navigation/native"

const QuickInspectPreWater = ({ machine = "Pressure Drop" }: { machine: string }) => {
  const navigation = useNavigation()

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate(
          item?.pre_treatment_type?.toString() == "Water Treatment Plant 2" ||
            item?.pre_treatment_type.toString() == "Water Treatment Plant 3"
            ? "PreWaterForm1"
            : "PreWaterForm2",
          {
            type: machine,
            onBack: () => {},
            isValidShift: true,
            isvalidDate: true,
            item: {},
            isEdit: true,
          },
        )
      }
    >
      <Text>Click Here</Text>
    </TouchableOpacity>
  )
}

export default QuickInspectPreWater
