import { Dropdown } from "react-native-element-dropdown"
import { Divider } from "react-native-paper"
import { BarChart, PieChart } from "react-native-gifted-charts"
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

interface LineDsScreenProps extends AppStackScreenProps<"LineDs"> {}

export const LineDsScreen: FC<LineDsScreenProps> = observer(function LineDsScreen() {
  const { width: maxWidth } = useWindowDimensions()
  const linetypeA = [
    { name: "Water Pressure", value: 1 },
    { name: "Nozzies Rinser", value: 2 },
    { name: "FG [O3]", value: 3 },
  ]
  const linetypeB = [
    { name: "Side - Wall", value: 1 },
    { name: "Air Pressure", value: 2 },
    { name: "Temperature Preform", value: 2 },
    { name: "TWP / Flow Scale", value: 3 },
    { name: "FG [O3]", value: 4 },
  ]
  const pieData = [
    { value: 60, color: "#177AD5" },

    { value: 40, color: "#ED6665" },
  ]
  const pieData2 = [
    { value: 80, color: "#D32600" },

    { value: 20, color: "#DCAA9F" },
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
        <ScrollView scrollEnabled showsVerticalScrollIndicator={true} persistentScrollbar={true}>
          <View style={styles.row1}>
            <View style={[styles.activityBarCharts]}>
              <Text semibold body1>
                Line 2,3
              </Text>

              <View
                style={[$horiContainer, { marginVertical: 20, justifyContent: "space-between" }]}
              >
                <View style={$horiContainer}>
                  <Button style={[styles.dateAgo, { backgroundColor: "#0081F8" }]}>
                    <Text caption1 whiteColor>
                      7 days
                    </Text>
                  </Button>
                  <Button style={[styles.dateAgo]} outline>
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
                    data={linetypeA}
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
                </View>
              </View>

              <Divider />

              <View style={{ paddingHorizontal: 20, paddingVertical: 35 }}>
                <View style={$horiContainer}>
                  <Text semibold>Water Pressure</Text>
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
                Activity Line 2,3
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

                    <BadgeChart title="Warning" bgColor="#ED6665" />
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.row1}>
            <View style={[styles.activityBarCharts]}>
              <Text semibold body1>
                Line 4,5,6
              </Text>

              <View
                style={[$horiContainer, { marginVertical: 20, justifyContent: "space-between" }]}
              >
                <View style={$horiContainer}>
                  <Button style={[styles.dateAgo, { backgroundColor: "#D32600" }]}>
                    <Text caption1 whiteColor>
                      7 days
                    </Text>
                  </Button>
                  <Button
                    style={[
                      styles.dateAgo,
                      {
                        borderColor: "#D32600",
                      },
                    ]}
                    outline
                  >
                    <Text caption1 errorColor>
                      14 days
                    </Text>
                  </Button>
                  <Button
                    style={[
                      styles.dateAgo,
                      {
                        borderColor: "#D32600",
                      },
                    ]}
                    outline
                  >
                    <Text caption1 errorColor>
                      21 days
                    </Text>
                  </Button>
                  <Button
                    style={[
                      styles.dateAgo,
                      {
                        borderColor: "#D32600",
                      },
                    ]}
                    outline
                  >
                    <Text caption1 errorColor>
                      Custom
                    </Text>
                  </Button>
                </View>
                <View>
                  <Dropdown
                    style={styles.dropdown}
                    data={linetypeB}
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
                </View>
              </View>

              <Divider />

              <View style={{ paddingHorizontal: 20, paddingVertical: 35 }}>
                <View style={$horiContainer}>
                  <Text semibold>Temperature Preform</Text>
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
                    data={barData2}
                    // isAnimated
                  />
                </View>
              </View>
            </View>
            <View style={[styles.activityPieChart]}>
              <Text semibold body1>
                Activity Line 4,5,6
              </Text>

              <View style={{ paddingHorizontal: 20, paddingVertical: 35 }}>
                <View
                  style={{ marginVertical: 20, justifyContent: "center", flexDirection: "row" }}
                >
                  <PieChart
                    data={pieData2}
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
                    <BadgeChart title="Normal" bgColor="#D32600" />
                    <BadgeChart title="Warning" bgColor="#DCAA9F" />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
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
