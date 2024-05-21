import React, { useState } from "react"
import Icon from "react-native-vector-icons/Ionicons"
import { View, ViewStyle } from "react-native"
import { Text } from "app/components/v2"
import { ProgressBar } from "react-native-paper"
import styles from "./styles"
import { TouchableOpacity } from "react-native-gesture-handler"
import BadgeWarning from "../Badgewarn"
interface LinePanelProps {
  onClickPanel: () => void
  item: any
}
const LinePanel = ({ onClickPanel, item }: LinePanelProps) => {
  return (
    <View style={styles.linePanel}>
      <TouchableOpacity onPress={() => onClickPanel()} style={{padding:10}}>
        <View style={[$containerHorizon, { justifyContent: "space-between", marginBottom: 15 }]}>
          <Text semibold body1>
            {item.name}
          </Text>

          {/* <BadgeWarning value={4} status="warning" /> */}

          <Icon name="arrow-forward-outline" size={25} color={"black"}  />
        </View>

        <View style={{ marginBottom: 30 }}>
          <ProgressBar
            progress={1}
            style={{ height: 8 }}
            color={"#0081F8"}
            backgroundColor={"#0081F8"}
            animated={false}
          />
        </View>

        <View style={$containerHorizon}>
          <View style={$containerHorizon}>
            <Icon name="people" size={20} color={"black"} />
            <Text caption2> ProdAdmin1</Text>
          </View>
          <View style={$containerHorizon}>
            <View
              style={styles.progressLine}
            ></View>
            <Text caption2>pending 2 </Text>
          </View>
          <View style={$containerHorizon}>
            <View
              style={{
                backgroundColor: "#D32600",
                width: 15,
                height: 15,
                borderRadius: 100,
              }}
            ></View>
            <Text caption2>warning 3 </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}
const $containerHorizon: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: 5,
}
export default LinePanel
