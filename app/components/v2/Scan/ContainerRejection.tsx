import { View, ViewStyle } from "react-native"
import React from "react"
import CustomInput from "../DailyPreWater/CustomInput"
import { Text } from "app/components/v2"

export default function ContainerRejection({ headerTitle, data }: ContainerRejectionProps) {
  return (
    <View style={{ marginVertical: 15,backgroundColor:"#EEE" }}>
    <View style={{ backgroundColor: "#DD5746", paddingVertical: 15 }}>
      <Text body1 textAlign={"center"} whiteColor semibold>
        {headerTitle}
      </Text>
    </View>

    <View style={[$useRow, { paddingVertical: 20, paddingHorizontal: 12 }]}>
      <View style={{ flex: 1 }}>
        <CustomInput
          // hintLimit="6.5 - 8.5"
          showIcon={false}
          // warning={(form.ph && +form?.ph < 6.5) || +form?.ph > 8.5}
          keyboardType="decimal-pad"
          // value={form.ph?.toString() || ""}
          onBlur={() => {}}
          value={data?.bottles?.toString() || "0"}
          onChangeText={(text) => {}}
          label="Bottles"
          errormessage={""}
        />
      </View>
   
    </View>
 
  </View>
  )
}
const $root: ViewStyle = {
  flex: 1,
  backgroundColor: "white",
}
const $useRow: ViewStyle = {
  flexDirection: "row",
  gap: 25,
  alignContent: "center",
}
const $outerContainer: ViewStyle = {
  margin: 15,
  marginTop: 20,
  padding: 10,
  gap: 20,
  paddingBottom: 80,
}
