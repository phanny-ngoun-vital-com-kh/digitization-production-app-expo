import React from "react"
import { View } from "react-native"
import styles from "./styles"
import { MACHINE_STATE } from "../WaterTreatment/type"
import { Text } from "app/components/v2"

const BadgeWarning = ({ status, value }: { status: MACHINE_STATE; value: number }) => {
  const getStatus = (status: MACHINE_STATE) =>
    status === "normal" ? "#0081F8" : status === "pending" ? "#8CC8FF" : "red"
  return (
    <View
      style={[
        { backgroundColor: getStatus(status) },
        styles.machinePanel,
        {
          width: 20,
          height: 20,
          backgroundColor: "#D32600",
          position: "absolute",
          left: 53,
          bottom: 10,
        },
      ]}
    >
      <Text caption1 whiteColor>
        {value?.toString()}
      </Text>
    </View>
  )
}

export default BadgeWarning
