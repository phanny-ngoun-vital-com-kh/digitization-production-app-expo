import { View, Text, TouchableOpacity } from "react-native"
import React from "react"
import { useNavigation } from "@react-navigation/native"

const QuickInspectWTP = ({machine = 'Raw Water Stock'}:{machine:string}) => {
  const navigation = useNavigation()

  return (
 
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("WaterTreatmentPlant2Form", {
            type: machine,
            items: {},
            onReturn: () => {},
            isValidShift: true,
            isvalidDate: true,
            isEdit: true,
          })
        }
      >
        <Text>Click Here</Text>
      </TouchableOpacity>
 
  )
}

export default QuickInspectWTP
