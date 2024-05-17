import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import Icon from "react-native-vector-icons/Ionicons"
import { FlatList, StyleSheet, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Text } from "app/components/v2"
import HeaderBar from "app/components/v2/WaterTreatment/HeaderBar"
import { ProgressBar } from "react-native-paper"
import styles from "./styles"
import { TouchableOpacity } from "react-native-gesture-handler"
import BadgeWarning from "../Badgewarn"

const LinePanel = ({ onClickPanel, item }: { onClickPanel: () => void; item: any }) => {
  return (
    <View style={styles.linePanel}>
      <TouchableOpacity onPress={() => onClickPanel()}>
        <View style={[$containerHorizon, { justifyContent: "space-between", marginBottom: 15 }]}>
          <Text bold body1>
            {item.name}
          </Text>
          <BadgeWarning value={4} status="warning" />
          <Icon name="arrow-forward-outline" size={30} color={"black"} />
        </View>

        <View style={{ marginBottom: 30 }}>
          <ProgressBar
            progress={1}
            style={{ height: 10 }}
            color={"#8CC8FF"}
            backgroundColor={"#8CC8FF"}
            animated={false}
          />
        </View>

        <View style={$containerHorizon}>
          <View style={$containerHorizon}>
            <Icon name="people" size={20} color={"black"} />
            <Text caption1>Assign to: Darith</Text>
          </View>

          <View style={$containerHorizon}>
            <View
              style={{
                backgroundColor: "#8CC8FF",
                width: 15,
                height: 15,
                borderRadius: 100,
              }}
            ></View>
            <Text caption1>Pending</Text>
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
