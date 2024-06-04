import { Dropdown } from "react-native-element-dropdown"
import { LineChart, BarChart, PieChart } from "react-native-gifted-charts"
import * as React from "react"
import { Divider } from "react-native-paper"
import Icon from "react-native-vector-icons/Entypo"
import { observer } from "mobx-react-lite"
import { View, ViewStyle, useWindowDimensions } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Button, Text } from "app/components/v2"
import styles from "./styles"
import BadgeChart from "app/components/v2/Chart/BadgeChart"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface DailyDsScreenProps extends AppStackScreenProps<"DailyDs"> {}

export const DailyDsScreen: React.FC<DailyDsScreenProps> = observer(function DailyDsScreen() {
  const { width: maxWidth } = useWindowDimensions()

  const [selectedMachine, setSelectedMachine] = React.useState({
    machine1: { name: "", value: "" },
    machine2: { name: "", value: "" },
  })
  const machine1 = [
    { name: "Raw Water Stock", value: "m11" },
    { name: "Sand Filter", value: "m12" },
    { name: "Carbon Filter", value: "m13" },
    { name: "Resin Filter", value: "m1" },
    { name: "MicroFilter 5️ Mm  ", value: "m14" },
    { name: "MicroFilter 1Mm", value: "m15" },
    { name: "Reverses Osmosis", value: "m16" },
  ]
  const machine2 = [
    { name: "Raw Water Stock", value: "m21" },
    { name: "Sand Filter", value: "m22" },
    { name: "Carbon Filter", value: "m23" },
    { name: "Resin Filter", value: "m24" },
    { name: "MicroFilter 5 Mm  ", value: "m25" },
    { name: "MicroFilter 1Mm", value: "m25" },
    { name: "Reverses Osmosis", value: "m27" },
  ]
  const lineData = [
    { value: 0, dataPointText: "0", label: "Mon" },
    { value: 1, dataPointText: "1", label: "Tues" },
    { value: 1, dataPointText: "1", label: "Wed" },
    { value: 2, dataPointText: "1", label: "Thu" },
    { value: 1, dataPointText: "1", label: "Fri" },
    { value: 1, dataPointText: "1", label: "Sat" },
    { value: 3, dataPointText: "1", label: "Sun" },
  ]

  const lineData2 = [
    { value: 0, dataPointText: "0", label: "Mon" },
    { value: 0, dataPointText: "0", label: "Tues" },
    { value: 3, dataPointText: "3", label: "Wed" },
    { value: 2, dataPointText: "2", label: "Thu" },
    { value: 1, dataPointText: "1", label: "Fri" },
    { value: 1, dataPointText: "1", label: "Sat" },
    { value: 0, dataPointText: "0", label: "Sun" },
  ]
  const pieData = [
    { value: 54, color: "#177AD5" },

    { value: 40, color: "#79D2DE" },

    { value: 20, color: "#ED6665" },
  ]
  const barData = [
    {
      value: 1,
      label: "Mon",
      frontColor: "#0081F8",
      topLabelComponent: () => (
        <Text style={{ color: "#0081F8", fontSize: 15, marginBottom: 6 }}>1 bar</Text>
      ),
    },

    {
      value: 0.8,
      label: "Tues",
      frontColor: "#79C3DB",
      topLabelComponent: () => (
        <Text style={{ color: "#0081F8", fontSize: 15, marginBottom: 6 }}>0.8 bar</Text>
      ),
    },

    {
      value: 0.75,
      label: "Wed",
      frontColor: "#8CC8FF",
      topLabelComponent: () => (
        <Text style={{ color: "#0081F8", fontSize: 15, marginBottom: 6 }}>0.75 bar</Text>
      ),
    },

    {
      value: 0.8,
      label: "Fri",
      frontColor: "#4ADDBA",
      topLabelComponent: () => (
        <Text style={{ color: "#0081F8", fontSize: 15, marginBottom: 6 }}>0.8 bar</Text>
      ),
    },

    {
      value: 1.25,
      label: "Sat",
      frontColor: "#91E3E3",
      topLabelComponent: () => (
        <Text style={{ color: "#0081F8", fontSize: 15, marginBottom: 6 }}>1.25 bar</Text>
      ),
    },
    {
      value: 1,
      label: "Sun",
      frontColor: "#91E3E3",
      topLabelComponent: () => (
        <Text style={{ color: "#0081F8", fontSize: 15, marginBottom: 6 }}>1 bar</Text>
      ),
    },
  ]
  const barData2 = [
    {
      value: 1,
      label: "Mon",
      frontColor: "#D32600",
      topLabelComponent: () => (
        <Text style={{ color: "#D32600", fontSize: 15, marginBottom: 6 }}>1 bar</Text>
      ),
    },

    {
      value: 0.8,
      label: "Tues",
      frontColor: "#DC8686",
      topLabelComponent: () => (
        <Text style={{ color: "#D32600", fontSize: 15, marginBottom: 6 }}>0.8 bar</Text>
      ),
    },

    {
      value: 0.75,
      label: "Wed",
      frontColor: "#FF6969",
      topLabelComponent: () => (
        <Text style={{ color: "#D32600", fontSize: 15, marginBottom: 6 }}>0.75 bar</Text>
      ),
    },

    {
      value: 0.8,
      label: "Fri",
      frontColor: "#C70039",
      topLabelComponent: () => (
        <Text style={{ color: "#D32600", fontSize: 15, marginBottom: 6 }}>0.8 bar</Text>
      ),
    },

    {
      value: 1.25,
      label: "Sat",
      frontColor: "#DC0000",
      topLabelComponent: () => (
        <Text style={{ color: "#D32600", fontSize: 15, marginBottom: 6 }}>1.25 bar</Text>
      ),
    },
    {
      value: 1,
      label: "Sun",
      frontColor: "#7D0A0A",
      topLabelComponent: () => (
        <Text style={{ color: "#D32600", fontSize: 15, marginBottom: 6 }}>1 bar</Text>
      ),
    },
  ]
  return (
    <View style={$root}>
      <View style={$innerContainer}>
        <View style={styles.row1}>
          <View style={[styles.activityLineChart]}>
            <Text semibold body1>
              Machine Activity
            </Text>

            <View style={[$horiContainer, { marginVertical: 20, justifyContent: "space-between" }]}>
              <View style={$horiContainer}>
                <Button style={[styles.dateAgo, { backgroundColor: "#0081F8" }]}>
                  <Text caption1 whiteColor>
                    7 days
                  </Text>
                </Button>
                <Button style={styles.dateAgo} outline>
                  <Text caption1 primaryColor>
                    14 days
                  </Text>
                </Button>
                <Button style={styles.dateAgo} outline>
                  <Text caption1 primaryColor>
                    21 days
                  </Text>
                </Button>
                <Button style={styles.dateAgo} outline>
                  <Text caption1 primaryColor>
                    Custom
                  </Text>
                </Button>
              </View>
              <View>
                <Dropdown
                  style={styles.dropdown}
                  data={machine1}
                  labelField="name"
                  valueField="value"
                  placeholder="Select Machine 1"
                  placeholderStyle={{ fontSize: 14.5 }}
                  // onSelect={onSelectLine}
                  search
                  value={selectedMachine.machine1}
                  onChangeText={(text: any) => {}}
                  onChange={(item) => {
                    setSelectedMachine((pre) => ({ ...pre, machine1: item }))
                  }}
                />
                <View style={{ marginVertical: 10 }}></View>
                <Dropdown
                  style={styles.dropdown}
                  data={machine2}
                  labelField="name"
                  valueField="value"
                  placeholder="Select Machine 2"
                  placeholderStyle={{ fontSize: 14.5 }}
                  // onSelect={onSelectLine}
                  search
                  value={selectedMachine.machine2}
                  onChangeText={(text: any) => {}}
                  onChange={(item) => {
                    setSelectedMachine((pre) => ({ ...pre, machine2: item }))
                  }}
                />
              </View>
            </View>

            <Divider />

            <View style={{ paddingHorizontal: 20, paddingVertical: 35 }}>
              {selectedMachine.machine1.name && selectedMachine.machine2.name && (
                <View style={$horiContainer}>
                  <BadgeChart title={selectedMachine.machine1?.name} />
                  <BadgeChart title={selectedMachine.machine2?.name} bgColor="#ED8913" />
                </View>
              )}

              <View style={{ marginVertical: 20 }}>
                <LineChart
                  data={lineData}
                  data2={lineData2}
                  height={260}
                  showVerticalLines
                  spacing={maxWidth / 8}
                  isAnimated
                  scrollAnimation
                  width={maxWidth * 0.5}
                  initialSpacing={20}
                  color1="skyblue"
                  color2="orange"
                  textColor1="#0081F8"
                  dataPointsHeight={6}
                  dataPointsWidth={6}
                  dataPointsColor1="blue"
                  dataPointsColor2="red"
                  textShiftY={-2}
                  textShiftX={-5}
                  textFontSize={13}
                />
                {/* <BarChart
                  showFractionalValues
                  showYAxisIndices
                  noOfSections={4}
                  barWidth={maxWidth * 0.05}
                  height={250}
                  width={maxWidth * 0.5}
                  maxValue={2}
                  spacing={50}
                  xAxisThickness={1}
                  // spacing={maxWidth / 20}
                  data={barData}
                  // isAnimated
                /> */}
              </View>
            </View>
          </View>
          <View style={[styles.activityPieChart]}>
            <Text semibold body1>
              Type of Status
            </Text>

            <View style={{ paddingHorizontal: 20, paddingVertical: 35 }}>
              <View style={{ marginVertical: 20, justifyContent: "center", flexDirection: "row" }}>
                <PieChart
                  data={pieData}
                  showText
                  textColor="black"
                  radius={150}
                  textSize={20}
                  focusOnPress
                  showValuesAsLabels
                  showTextBackground
                  textBackgroundRadius={26}
                />
              </View>

              <View style={[$horiContainer, { justifyContent: "center" }]}>
                <BadgeChart title="Normal" bgColor="#177AD5" />
                <BadgeChart title="Pending" bgColor="#79D2DE" />
                <BadgeChart title="Warning" bgColor="#ED6665" />
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
})

const $root: ViewStyle = {
  flex: 1,
  backgroundColor: "white",
}

export const $innerContainer: ViewStyle = {
  paddingVertical: 20,
  paddingHorizontal: 30,
}

export const $horiContainer: ViewStyle = {
  flexDirection: "row",
  gap: 10,

  alignItems: "center",
}
