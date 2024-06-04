import { Dropdown } from "react-native-element-dropdown"
import { Divider } from "react-native-paper"
import { BarChart, PieChart, LineChart } from "react-native-gifted-charts"
import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ScrollView, View, ViewStyle, useWindowDimensions } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Text, Button } from "app/components/v2"
import styles from "./styles"
import { $horiContainer } from "../daily-water"
import BadgeChart from "app/components/v2/Chart/BadgeChart"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface PreWaterDsScreenProps extends AppStackScreenProps<"PreWaterDs"> {}

export const PreWaterDsScreen: FC<PreWaterDsScreenProps> = observer(function PreWaterDsScreen() {
  const { width: maxWidth } = useWindowDimensions()
  const lines = [
    { name: "line 1", value: 1 },
    { name: "line 2", value: 2 },
  ]
  const machines = [
    { name: "Water Treatment Plant 2", value: 1 },
    { name: "Water Treatment Plant 3", value: 2 },
    { name: "Water Treatment Plant 4", value: 3 },
  ]

  const controls = [
    {
      name: "Pressure",
    },
    {
      name: "Air Released",
    },
    {
      name: "TDS",
    },
    {
      name: "PH",
    },
    {
      name: "Pressure Drop",
    },
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
      frontColor: "#0081F8",
      topLabelComponent: () => (
        <Text style={{ color: "#0081F8", fontSize: 15, marginBottom: 6 }}>0.8 bar</Text>
      ),
    },

    {
      value: 0.75,
      label: "Wed",
      frontColor: "#0081F8",
      topLabelComponent: () => (
        <Text style={{ color: "#0081F8", fontSize: 15, marginBottom: 6 }}>0.75 bar</Text>
      ),
    },

    {
      value: 0.8,
      label: "Fri",
      frontColor: "#0081F8",
      topLabelComponent: () => (
        <Text style={{ color: "#0081F8", fontSize: 15, marginBottom: 6 }}>0.8 bar</Text>
      ),
    },

    {
      value: 1.25,
      label: "Sat",
      frontColor: "#0081F8",
      topLabelComponent: () => (
        <Text style={{ color: "#0081F8", fontSize: 15, marginBottom: 6 }}>1.25 bar</Text>
      ),
    },
    {
      value: 1,
      label: "Sun",
      frontColor: "#0081F8",
      topLabelComponent: () => (
        <Text style={{ color: "#0081F8", fontSize: 15, marginBottom: 6 }}>1 bar</Text>
      ),
    },
  ]
  const pieData = [
    { value: 50, color: "#177AD5" },

    { value: 10, color: "#8CC8FF" },

    { value: 30, color: "#ED6665" },
  ]
  return (
    <ScrollView>
      <View style={$root}>
        <View style={$innerContainer}>
          <View style={styles.row1}>
            <View style={[styles.activityLineChart]}>
              <View style={[$horiContainer, { justifyContent: "space-between", marginBottom: 20 }]}>
                <Text semibold body1>
                  Machine Usage
                </Text>
                <View style={$horiContainer}>
                  <Dropdown
                    style={styles.dropdown}
                    data={lines}
                    labelField="name"
                    valueField="value"
                    placeholder="Select Machine"
                    placeholderStyle={{ fontSize: 14.5 }}
                    // onSelect={onSelectLine}
                    search
                    value={{}}
                    onChangeText={(text: any) => {}}
                    onChange={(item) => {}}
                  />
                  <Dropdown
                    style={styles.dropdown}
                    data={lines}
                    labelField="name"
                    valueField="value"
                    placeholder="Select Control"
                    placeholderStyle={{ fontSize: 14.5 }}
                    // onSelect={onSelectLine}
                    search
                    value={{}}
                    onChangeText={(text: any) => {}}
                    onChange={(item) => {}}
                  />
                </View>
              </View>

              <View
                style={[$horiContainer, { marginVertical: 20, justifyContent: "space-between" }]}
              >
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
              </View>

              <Divider />

              <View style={{ paddingHorizontal: 20, paddingVertical: 35 }}>
                <View style={$horiContainer}>
                  <Text body1 semibold>
                    PH
                  </Text>
                </View>

                <View style={{ marginVertical: 20, overflow: "hidden" }}>
                  <BarChart
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
                  />
                </View>
              </View>
            </View>
            <View style={[styles.activityPieChart]}>
              <Text semibold body1>
                Activity Machine
              </Text>

              <View style={{ paddingHorizontal: 20, paddingVertical: 35 }}>
                <View
                  style={{ marginVertical: 20, justifyContent: "center", flexDirection: "row" }}
                >
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
                  <View style={[{ justifyContent: "center", gap: 20 }]}>
                    <BadgeChart title="Normal" bgColor="#177AD5" />
                    <BadgeChart title="Pending" bgColor="#8CC8FF" />
                    <BadgeChart title="Warning" bgColor="#ED6665" />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  )
})

const $root: ViewStyle = {
  flex: 1,
  backgroundColor: "white",
}

const $innerContainer: ViewStyle = {
  paddingVertical: 40,
  paddingHorizontal: 30,
}
