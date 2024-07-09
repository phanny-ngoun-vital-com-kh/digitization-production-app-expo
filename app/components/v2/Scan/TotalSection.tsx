import { View, ViewStyle } from "react-native"
import React from "react"
import CustomInput from "../DailyPreWater/CustomInput"
import { Text } from "app/components/v2"

export default function TotalSection({ headerTitle, data }: TotalSectionProps) {

  return (
    <View style={{ marginVertical: 15,backgroundColor:"#EEE" }}>
      <View style={{ backgroundColor: "#0081F8", paddingVertical: 15 }}>
        <Text body1 textAlign={"center"} whiteColor semibold>
          {headerTitle}
        </Text>
      </View>

      <View style={[$useRow, { paddingVertical: 20, paddingHorizontal: 12 }]} key={"form"}>
        <View style={{ flex: 1 }}>
          <CustomInput
            // hintLimit="6.5 - 8.5"
            showIcon={false}
            // warning={(form.ph && +form?.ph < 6.5) || +form?.ph > 8.5}
            keyboardType="decimal-pad"
            // value={form.ph?.toString() || ""}
            onBlur={() => {}}
            value={data?.preformInfeed?.toString() || "0"}
            onChangeText={(text) => {}}
            label="Preform Infeed"
            disabled={false}
            errormessage={""}
          />
        </View>
        <View style={{ flex: 1 }}>
          <CustomInput
            // hintLimit="6.5 - 8.5"
            showIcon={false}
            // warning={(form.ph && +form?.ph < 6.5) || +form?.ph > 8.5}
            keyboardType="decimal-pad"
            value={data?.bottleDischarge?.toString() || "0"}
            onBlur={() => {}}
            onChangeText={(text) => {}}
            label="Bottle Discharge Infeed"
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
