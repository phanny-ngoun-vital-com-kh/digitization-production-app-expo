import { View, ViewStyle } from "react-native"
import React from "react"
import CustomInput from "../DailyPreWater/CustomInput"
import { Text } from "app/components/v2"

export default function AutomaticSection({ headerTitle, data }: AutomaticProps) {
  return (
    <View style={{ marginVertical: 15,backgroundColor:"#EEE" }}>
      <View style={{ backgroundColor: "#8B322C", paddingVertical: 15 }}>
        <Text body1 textAlign={"center"} whiteColor semibold>
          {headerTitle}
        </Text>
      </View>

      <View style={[$useRow, { paddingVertical: 20, paddingHorizontal: 12 }]}>
        <View style={{ flex: 1 }}>
          <CustomInput
            showIcon={false}
            keyboardType="decimal-pad"
            onBlur={() => {}}
            value={data?.dueToTempTooHighLow?.toString() || "0"}
            onChangeText={(text) => {}}
            label="Due to Temperature High/Low"
            errormessage={""}
          />
        </View>
        <View style={{ flex: 1 }}>
          <CustomInput
            showIcon={false}
            keyboardType="decimal-pad"
            onBlur={() => {}}
            value={data?.dueToTempTooHighLow?.toString() || "0"}
            onChangeText={(text) => {}}
            label="Due to Temperature High/Low"
            errormessage={""}
          />
        </View>
      </View>
      <View style={[$useRow, { paddingVertical: 20, paddingHorizontal: 12 }]}>
        <View style={{ flex: 1 }}>
          <CustomInput
            showIcon={false}
            keyboardType="decimal-pad"
            onBlur={() => {}}
            value={data?.dueToLackOfBlowAirPres?.toString() || "0"}
            onChangeText={(text) => {}}
            label="Due to lack of blow air pressure"
            errormessage={""}
          />
        </View>
        <View style={{ flex: 1 }}>
          <CustomInput
            showIcon={false}
            keyboardType="decimal-pad"
            onBlur={() => {}}
            value={data?.dueToMachineMalfunctionWhileInOperation?.toString() || "0"}
            onChangeText={(text) => {}}
            label="Due to machine malfunction while operation"
            errormessage={""}
          />
        </View>
      </View>
      <View style={[$useRow, { paddingVertical: 20, paddingHorizontal: 12 }]}>
        <View style={{ flex: 1 }}>
          <CustomInput
            showIcon={false}
            keyboardType="decimal-pad"
            onBlur={() => {}}
            value={data?.dueToFaultOnNextMachine?.toString() || "0"}
            onChangeText={(text) => {}}
            label="Due to fault on the next machine"
            errormessage={""}
          />
        </View>
        <View style={{ flex: 1 }}>
          <CustomInput
            showIcon={false}
            keyboardType="decimal-pad"
            onBlur={() => {}}
            value={data?.dueToMachineStop?.toString() || "0"}
            onChangeText={(text) => {}}
            label="Due to Machine Stop"
            errormessage={""}
          />
        </View>
      </View>
      <View style={[$useRow, { paddingVertical: 20, paddingHorizontal: 12 }]}>
        <View style={{ flex: 1 }}>
          <CustomInput
            showIcon={false}
            keyboardType="decimal-pad"
            onBlur={() => {}}
            value={data?.atStartEndOfGap?.toString() || "0"}
            onChangeText={(text) => {}}
            label="At Start/End of gap"
            errormessage={""}
          />
        </View>
        <View style={{ flex: 1 }}>
          <CustomInput
            showIcon={false}
            keyboardType="decimal-pad"
            onBlur={() => {}}
            value={data?.dueToDangerousGap?.toString() || "0"}
            onChangeText={(text) => {}}
            label="Due to Dangerous Gap"
            errormessage={""}
          />
        </View>
      </View>

      <View style={[$useRow, { paddingVertical: 20, paddingHorizontal: 12 }]}>
        <View style={{ flex: 1 }}>
          <CustomInput
            showIcon={false}
            keyboardType="decimal-pad"
            onBlur={() => {}}
            value={data?.throughContainerGap?.toString() || "0"}
            onChangeText={(text) => {}}
            label="Through a container gap"
            errormessage={""}
          />
        </View>
        <View style={{ flex: 1 }}>
          <CustomInput
            showIcon={false}
            keyboardType="decimal-pad"
            onBlur={() => {}}
            value={data?.dueToLabelFault?.toString() || "0"}
            onChangeText={(text) => {}}
            label="Due to a label Fault"
            errormessage={""}
          />
        </View>
      </View>
      <View style={[$useRow, { paddingVertical: 20, paddingHorizontal: 12 }]}>
        <View style={{ flex: 1 }}>
          <CustomInput
            showIcon={false}
            keyboardType="decimal-pad"
            onBlur={() => {}}
            value={data?.dueToIncorrectFillLevel?.toString() || "0"}
            onChangeText={(text) => {}}
            label="Due to in correct fit level"
            errormessage={""}
          />
        </View>
      </View>
      <View style={[$useRow, { paddingVertical: 20, paddingHorizontal: 12 }]}>
        <View style={{ flex: 1 }}>
          <CustomInput
            showIcon={false}
            keyboardType="decimal-pad"
            onBlur={() => {}}
            value={data?.totalRejectedContainers?.toString() || "0"}
            onChangeText={(text) => {}}
            label="Total Rejected Containers"
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
