import { View, StyleSheet } from "react-native"
import React from "react"
import { Divider } from "react-native-paper"
import { Text } from "app/components/v2"
const PieChartAlert = ({
  visible,
  onClose,
  data,
}: {
  visible: boolean
  onClose: () => void
  data: { label: string; percentages: string;total:string  }
}) => {
  return (
    <View style={[styles.outerContainer, { display: visible ? "flex" : "none" }]}>
      <View style={{ paddingHorizontal: 15, paddingBottom: 10 }}>
        <Text body2 semibold>
          Total Warning Machine
        </Text>
        <Divider style={{ marginVertical: 15 }} />
        <View>
        <View style={styles.horizontal}>
            <Text regular errorColor>Total Machine</Text>
            <Text semibold errorColor>{data?.total || 0}</Text>
          </View>
          <View style={styles.horizontal}>
            <Text regular errorColor>Warning Count </Text>
            <Text semibold errorColor>{data?.label}</Text>
          </View>

          <View style={styles.horizontal}>
            <Text regular errorColor>Percentages</Text>
            <Text semibold errorColor>{data?.percentages}% </Text>
          </View>
        </View>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical:4
  },
  outerContainer: {
    position: "absolute",
    backgroundColor: "#EEF7FF",
    zIndex: 100,
    top: 40,
    paddingTop: 10,
  },
})
export default PieChartAlert
