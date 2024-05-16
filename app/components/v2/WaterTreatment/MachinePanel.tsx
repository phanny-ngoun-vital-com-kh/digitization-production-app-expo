import React from "react"
import Icon from "react-native-vector-icons/AntDesign"
import { Text } from "app/components/v2"
import styles from "./styles"
import { TouchableOpacity, View } from "react-native"
import { Divider } from "react-native-paper"
import { $containerHorizon } from "app/screens"
import { MACHINE_STATE, MachinePanelProps } from "./type"

const MachinePanel = ({
  machine_type = "Raw Water Stock",
  status = "normal",
  assign_to = "Vicheaka",
  time = "7:00",
  warning_count = 0,
  onPress,
}: MachinePanelProps) => {
  const getStatus = (status: MACHINE_STATE) =>
    status === "normal" ? "#0081F8" : status === "pending" ? "#8CC8FF" : "red"
  return (
    <View
      style={{
        backgroundColor: "white",
        marginBottom: 10,
        elevation: 6,
        borderRadius: 0,
        overflow: "hidden",
      }}
    >
      <TouchableOpacity style={{ paddingHorizontal: 10, paddingVertical: 5 }} onPress={onPress}>
        <View style={{ width: 180, position: "relative" }}>
          <Text semibold headline>
            {machine_type}
          </Text>

          {!!warning_count && (
            <View
              style={[
                { backgroundColor: getStatus(status) },
                styles.machinePanel,
                {
                  width: 20,
                  height: 20,
                  backgroundColor: "#D32600",
                  position: "absolute",
                  right: -20,
                },
              ]}
            >
              <Text caption1 whiteColor>
                {warning_count}
              </Text>
            </View>
          )}
        </View>

        <View style={$containerHorizon}>
          <View style={[{ backgroundColor: getStatus(status) }, styles.machinePanel]}></View>
          <Text caption1>{status}</Text>
        </View>

        <Divider
          style={{
            height: 5,
            marginVertical: 18,
            backgroundColor: getStatus(status),
          }}
        />

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
          <View style={[$containerHorizon, { gap: 10 }]}>
            <View style={$containerHorizon}>
              <Icon name="search1" size={20} color="black" />
              <Text semibold caption1>
                Assign to : {assign_to}
              </Text>
            </View>
            <View style={$containerHorizon}>
              <Icon name="clockcircleo" style={{ marginRight: 5 }} size={18} color="black" />
              <Text semibold caption1>
                {time}
              </Text>
            </View>
          </View>

          <View>
            <TouchableOpacity>
              <Icon name="right" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default MachinePanel
