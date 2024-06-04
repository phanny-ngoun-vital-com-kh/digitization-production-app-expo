import React from "react"
import Icon from "react-native-vector-icons/Ionicons"
import { View, ViewStyle } from "react-native"
import { Text } from "app/components/v2"
import { ProgressBar, Badge } from "react-native-paper"
import styles from "./styles"
import { TouchableOpacity } from "react-native-gesture-handler"
interface LinePanelProps {
  onClickPanel: () => void
  item: ListWTPLines
  total: number
}
const LinePanel = ({ onClickPanel, item, total }: LinePanelProps) => {
  const totalWarning = item.lines.filter((item) => item.status === "warning")?.length
  const totalNormal = item.lines.filter(
    (item) => item.status === null || item.status === "normal",
  )?.length
  const warningCount = item.lines.reduce((total, item) => (total += item.warning_count), 0)
  const assignTo = "Prod1"
  return (
    <TouchableOpacity onPress={() => onClickPanel()} style={{ padding: 10,width:"100%" }}>
      <View style={styles.linePanel}>
        <View style={[$containerHorizon, { justifyContent: "space-between", marginBottom: 15 }]}>
          <Text semibold body1>
            {item.name}
          </Text>

          <View style={{ position: "absolute", right: 300, bottom: 20 }}>
            {warningCount > 0 && <Badge>{warningCount}</Badge>}
          </View>

          <Icon name="arrow-forward-outline" size={25} color={"black"} />
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
            <View style={[styles.badge, { backgroundColor: "black" }]}></View>
            <Text caption2>total : {total} </Text>
          </View>
          <View style={$containerHorizon}>
            <View style={[styles.badge, { backgroundColor: "#0081F8" }]}></View>
            <Text caption2>Normal : {totalNormal} </Text>
          </View>
          <View style={$containerHorizon}>
            <View style={styles.badge}></View>
            <Text caption2>Warning : {totalWarning} </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}
const $containerHorizon: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: 10,
}
export default LinePanel
