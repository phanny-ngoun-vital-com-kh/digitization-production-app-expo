import { View, StyleSheet } from "react-native"
import React from "react"
import { Divider } from "react-native-paper"
import { Text } from "app/components/v2"
const PieChartAlert = ({
  visible,
  onClose,
  data,
  label = "Warning",
}: {
  visible: boolean
  onClose: () => void
  label?: string
  data: { label: string; percentages: string; total: string; index: number }
}) => {
  console.log(data)

  const getTag = () => {
    switch (data.index) {
      case 0:
        return "Normal"
      case 1:
        return "Pending"
      case 2:
        return "Warning"
      default:
        return "N/A"
    }
  }
  return (
    <View style={[styles.outerContainer, { display: visible ? "flex" : "none" }]}>
      <View style={{ paddingHorizontal: 15, paddingBottom: 10 }}>
        <Text body2 semibold>
          Machine Statistic Range
        </Text>
        <Divider style={{ marginVertical: 15 }} />
        <View>
          <View style={styles.horizontal}>
            <Text regular  errorColor={data.index === 2} primaryColor={data.index === 0}>
              Total Machine
            </Text>
            <Text semibold  errorColor={data.index === 2} primaryColor={data.index === 0}>
              {data?.total || 0}
            </Text>
          </View>
          <View style={styles.horizontal}>
            <Text regular errorColor={data.index === 2} primaryColor={data.index === 0}>
              {getTag()} Count{" "}
            </Text>
            <Text semibold  errorColor={data.index === 2} primaryColor={data.index === 0}>
              {data?.label}
            </Text>
          </View>

          <View style={styles.horizontal}>
            <Text regular errorColor={data.index === 2} primaryColor={data.index === 0}>
              Percentages
            </Text>
            <Text semibold errorColor={data.index === 2} primaryColor={data.index === 0}>
              {data?.percentages}%
            </Text>
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
    marginVertical: 4,
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
