import { View, ViewStyle } from "react-native"
import React from "react"
import CustomInput from "../DailyPreWater/CustomInput"
import { Text } from "app/components/v2"

export default function ManualContainerSection({ headerTitle, data }: ManualContainerProps) {
  return (
    <View style={{ marginVertical: 15,backgroundColor:"#EEE" }}>
      <View style={{ backgroundColor: "#102C57", paddingVertical: 15 }}>
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
            value={data?.inBlowingWheelInfeed?.toString() || "0"}
            onChangeText={(text) => {}}
            label="In the blowing wheel infeed"
            errormessage={""}
          />
        </View>
        <View style={{ flex: 1 }}>
          <CustomInput
            // hintLimit="6.5 - 8.5"
            showIcon={false}
            // warning={(form.ph && +form?.ph < 6.5) || +form?.ph > 8.5}
            keyboardType="decimal-pad"
            // value={form.ph?.toString() || ""}
            onBlur={() => {}}
            value={data?.inBlowingWheelDischarge?.toString()|| "0"}
            onChangeText={(text) => {}}
            label="Due to station disconnection"
            errormessage={""}
          />
        </View>
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
            value={data?.dueToServiceRejection?.toString() || "0"}
            onChangeText={(text) => {}}
            label="Due to service rejection"
            errormessage={""}
          />
        </View>
        <View style={{ flex: 1 }}>
          <CustomInput
            // hintLimit="6.5 - 8.5"
            showIcon={false}
            // warning={(form.ph && +form?.ph < 6.5) || +form?.ph > 8.5}
            keyboardType="decimal-pad"
            // value={form.ph?.toString() || ""}
            onBlur={() => {}}
            value={data?.dueToStationDisconnection?.toString() || "0"}
            onChangeText={(text) => {}}
            label="In the blowing wheel discharge"
            errormessage={""}
          />
        </View>
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
            value={data?.dueToLabeller?.toString() || "0"}
            onChangeText={(text) => {}}
            label="Due to the labeller"
            errormessage={""}
          />
        </View>
        <View style={{ flex: 1 }}>
          <CustomInput
            // hintLimit="6.5 - 8.5"
            showIcon={false}
            // warning={(form.ph && +form?.ph < 6.5) || +form?.ph > 8.5}
            keyboardType="decimal-pad"
            // value={form.ph?.toString() || ""}
            onBlur={() => {}}
            value={data?.throughFiller?.toString() || "0"}
            onChangeText={(text) => {}}
            label="Through the filler"
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
