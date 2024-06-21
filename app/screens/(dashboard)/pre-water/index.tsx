import React, { FC, useState } from "react"
import { LineChart, PieChart } from "react-native-gifted-charts"
import { Divider } from "react-native-paper"
import { observer } from "mobx-react-lite"
import { View, ViewStyle, useWindowDimensions } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Button, Text } from "app/components/v2"
import styles from "./styles"
import BadgeChart from "app/components/v2/Chart/BadgeChart"
import DateRangePicker from "app/components/v2/DateRange"
import { ScrollView } from "react-native-gesture-handler"
import { Dropdown } from "react-native-element-dropdown"
import { FlatList } from "react-native"
import { TouchableOpacity } from "react-native"
import { DataSetProps } from "../daily-water/type"
import EmptyLineChart from "app/components/v2/Dashboard/EmptyLineChart"
import moment from "moment"

interface PreWaterDsScreenProps extends AppStackScreenProps<"PreWaterDs"> {}

export const PreWaterDsScreen: FC<PreWaterDsScreenProps> = observer(function PreWaterDsScreen() {
  const { width: maxWidth } = useWindowDimensions()
  const [modalVisible, setModalVisible] = useState(false)
  const [selectionDate, setSelectionDate] = useState({
    start: "",
    end: "",
  })
  const data = [
    { label: "Pressure", value: "Pressure" },
    { label: "Air Released", value: "Air Released" },
    { label: "TDS", value: "TDS" },
    { label: "PH", value: "PH" },
    { label: "Pressure Drop", value: "Pressure Drop" },
  ]
  const wtps = [
    {
      name: "Water Treatment Plant 2",
      value: 1,
    },
    {
      name: "Water Treatment Plant 3",
      value: 2,
    },
    {
      name: "Water Treatment Plant 4",
      value: 3,
    },
  ]
  const [dashboard, setDashboard] = useState([])
  const [selectSecondaryMachine, setSelectSecondaryMachine] = useState<string[]>([])
  const [selectedControl, setSelectedControl] = useState<any>([])
  const [selectedMachine, setSelectedMachine] = useState<string[]>([])
  const [selectColors, setSelectColors] = useState<{ label: string; color: string }[]>([])
  const [dataSet, setDataSet] = useState<DataSetProps[]>([])
  const [pieData, setPieData] = useState([
    { value: 10, color: "#EEEEEE", text: "0%" },

    { value: 30, color: "#EEEEEE", text: "0%" },

    { value: 10, color: "#EEEEEE", text: "0%" },
  ])
  const [selectDate, setSelectDate] = useState<{
    value: Date | null
    range: number
  }>({
    value: null,
    range: 0,
  })
  const onSelectRangeDate = (inDay: number) =>
    setSelectDate(() => {
      const today = new Date(Date.now())
      return {
        range: inDay,
        value: new Date(today.getFullYear(), today.getMonth(), today.getDate() - inDay),
      }
    })
  const onChangeMachine = (item: string) => {
    setSelectedControl(item)
  }
  const onComfirmDate = (startDate: string, endDate: string) => {
    const [day, month, year] = startDate.split("/")
    const [eday, emonth, eyear] = endDate.split("/")

    // Create a Date object
    const startdate = new Date(year, month - 1, day)
    const enddate = new Date(eyear, emonth - 1, eday)

    setSelectionDate({
      start: moment(startdate).format("YYYY-MM-DD") ?? "",
      end: moment(enddate).format("YYYY-MM-DD") ?? "",
    })
    setModalVisible(false)
  }

  return (
    <View style={$root}>
      <View style={$innerContainer}>
        <ScrollView showsVerticalScrollIndicator persistentScrollbar>
          <View style={styles.row1}>
            <View style={[styles.activityLineChart]}>
              <View style={{ flex: 1, marginBottom: 10 }}>
                <Text semibold body1 style={{ marginBottom: 25 }}>
                  <Text errorColor>* </Text> Select Machine
                </Text>
                <Dropdown
                  style={[
                    styles.dropdown,
                    {
                      width: "100%",
                      marginBottom: 0,
                      marginLeft: 0,
                      marginRight: 0,
                    },
                  ]}
                  data={wtps}
                  labelField="name"
                  valueField="value"
                  selectedTextStyle={{
                    fontSize: 13.5,
                  }}
                  placeholder="Select Water Treatment"
                  itemTextStyle={{ fontSize: 13.5 }}
                  placeholderStyle={{ fontSize: 13.5, marginLeft: 10 }}
                  // onSelect={onSelectLine}
                  search
                  value={selectedMachine}
                  onChangeText={(text: any) => {}}
                  onChange={(item) => {
                    setSelectedMachine(item)
                  }}
                />
              </View>

              <FlatList
                horizontal
                renderItem={({ item, index }) => {
                  return (
                    <TouchableOpacity
                      // disabled={selectedMachine?.length >= 4}
                      onPress={() => {
                        if (selectSecondaryMachine?.length >= 4) {
                          if (selectSecondaryMachine.includes(item.value)) {
                            console.log("true")
                            setSelectedMachine((pre) =>
                              pre.filter((machine) => machine !== item.value),
                            )
                            return
                          }
                        } else {
                          if (selectSecondaryMachine.includes(item.value)) {
                            console.log("true")
                            setSelectedMachine((pre) =>
                              pre.filter((machine) => machine !== item.value),
                            )
                            return
                          } else {
                            setSelectedMachine((pre) => pre.concat(item.value))
                          }
                        }
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: 10,

                          backgroundColor: selectSecondaryMachine.includes(item.value)
                            ? "#0081F8"
                            : "#EEEEEE",
                          // shadowColor: '#000',
                          gap: 10,
                          marginTop: 8,
                          marginRight: 12,
                          paddingHorizontal: 12,
                          paddingVertical: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 13,
                            color: selectSecondaryMachine.includes(item.value) ? "white" : "gray",
                          }}
                        >
                          {item.label}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )
                }}
                data={data}
                keyExtractor={(item, index) => index.toString()}
              />

       
              <View
                style={[$horiContainer, { marginTop:10, justifyContent: "space-between" }]}
              >
                <View style={$horiContainer}>
                  <Button
                    style={[
                      styles.dateAgo,
                      selectDate.range === 7 && { backgroundColor: "#0081F8" },
                    ]}
                    outline
                    onPress={() => onSelectRangeDate(7)}
                    styleText={{
                      fontWeight: "bold",
                    }}
                  >
                    <Text caption1 primaryColor whiteColor={selectDate.range === 7}>
                      7 days
                    </Text>
                  </Button>
                  <Button
                    style={[
                      styles.dateAgo,
                      selectDate.range === 14 && { backgroundColor: "#0081F8" },
                    ]}
                    outline
                    onPress={() => onSelectRangeDate(14)}
                    styleText={{
                      fontWeight: "bold",
                    }}
                  >
                    <Text caption1 primaryColor whiteColor={selectDate.range === 14}>
                      14 days
                    </Text>
                  </Button>
                  <Button
                    style={[
                      styles.dateAgo,
                      selectDate.range === 21 && { backgroundColor: "#0081F8" },
                    ]}
                    outline
                    styleText={{
                      fontWeight: "bold",
                    }}
                    onPress={() => onSelectRangeDate(21)}
                  >
                    <Text caption1 primaryColor whiteColor={selectDate.range === 21}>
                      21 days
                    </Text>
                  </Button>
                  <Button
                    style={styles.dateAgo}
                    outline
                    onPress={() => setModalVisible(true)}
                    styleText={{
                      fontWeight: "bold",
                    }}
                  >
                    <Text caption1 primaryColor>
                      {!selectionDate.start
                        ? "Date Range"
                        : selectionDate.start + "-" + selectionDate.end}
                    </Text>
                  </Button>
                </View>
              </View>

              <View
                style={[
                  { paddingHorizontal: 20, paddingVertical: 35, overflow: "hidden" },
                  $horiContainer,
                ]}
              >
                <View style={{ marginVertical: 0, flex: 1, zIndex: 0 }}>
                  {dataSet && dataSet.length > 0 && (
                    <LineChart
                      dataSet={dataSet}
                      data={dataSet[0]?.data}
                      data2={dataSet[1]?.data}
                      data3={dataSet[2]?.data}
                      data4={dataSet[3]?.data}
                      color1={selectColors[0]?.color}
                      color2={selectColors[1]?.color}
                      color3={selectColors[2]?.color}
                      color4={selectColors[3]?.color}
                      data5={dataSet[4]?.data}
                      thickness={2}
                      height={400}
                      // width={maxWidth * 1}
                      width={maxWidth * 0.65}
                      maxValue={100}
                      isAnimated
                      // maxValue={110}
                      noOfSections={4}
                      yAxisLabelSuffix="%"
                      rulesType="solid"
                      // yAxisThickness={2}
                      // xAxisThickness={2}
                      endOpacity={0.1}
                      spacing={maxWidth / 10}
                      // maxValue={100}
                      scrollAnimation
                      showScrollIndicator={true}
                      animationDuration={2000}
                      // maxValue={100}
                      initialSpacing={20}
                      dataPointsHeight={16}
                      dataPointsWidth={16}
                      color="blue"
                      textShiftY={-12}
                      adjustToWidth
                      animateTogether
                      textShiftX={-3}
                      yAxisTextStyle={{
                        fontSize: 13,
                        // fontWeight:"600"
                      }}
                      textFontSize={12}
                      curved
                      pointerConfig={{
                        pointerStripUptoDataPoint: false,
                        pointerStripColor: "gray",
                        pointerStripWidth: 2,
                        strokeDashArray: [2, 5],
                        pointerColor: "transparent",

                        radius: 4,

                        activatePointersOnLongPress: true,
                        pointerLabelComponent: (items) => {
                          const datatoshow = dataSet?.map((item) => item.data)[0]
                          const indexFound = datatoshow?.findIndex(
                            (item) => item.value === items[0]?.value,
                          )

                          return (
                            <View
                              style={[
                                {
                                  zIndex: 1000,
                                  backgroundColor: "#EEF5FF",
                                  width: 200,
                                  position: "absolute",

                                  // Adjust height as needed
                                  // justifyContent: "center",
                                  borderRadius: 15,
                                  // alignItems: "start",
                                  paddingHorizontal: 10,
                                  paddingVertical: 10,
                                },

                                indexFound === dataSet?.length - 1 ? { left: 0 } : { right: 0 },
                              ]}
                            >
                              <Text caption1 semibold style={{ marginVertical: 10 }}>
                                Week of Jan 23 - Jan 29
                              </Text>
                              {dataSet.map((item, index) => (
                                <View key={index}>
                                  <Text caption1 errorColor>
                                    {selectColors[index]?.label} warning count:
                                    {item?.data[indexFound]?.value}
                                  </Text>
                                </View>
                              ))}
                              <Divider style={{ marginVertical: 15 }} />
                              <Text caption1 regular style={{ marginVertical: 10 }} primaryColor>
                                Percentage 75.50 %
                              </Text>
                            </View>
                          )
                        },
                      }}
                    />
                  )}
                  {selectedMachine?.length === 0 && <EmptyLineChart />}
                </View>
                <View style={[styles.activityPieChart]}>
                      <Text semibold body1>
                        Warning Statistic
                      </Text>

                      <View style={{ paddingHorizontal: 20, paddingVertical: 35, zIndex: 0 }}>
                        <View
                          style={{
                            marginVertical: 20,
                            justifyContent: "center",
                            flexDirection: "row",
                          }}
                        >
                          <PieChart
                            data={pieData}
                            showText={dashboard?.length > 0 ? true : false}
                            textColor="black"
                            radius={130}
                            textSize={14}
                            focusOnPress
                            showValuesAsLabels
                            showTextBackground
                            textBackgroundRadius={26}
                          />
                        </View>

                        <View style={[$horiContainer, { justifyContent: "center" }]}>
                          <BadgeChart title="Normal" bgColor="#145da0" />
                          <BadgeChart title="Pending" bgColor="#0e86d4" />
                          <BadgeChart title="Warning" bgColor="#BF3131" />
                        </View>
                      </View>
                    </View>
              </View>
            </View>

            {/* <View style={[styles.activityPieChart]}>
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
          </View> */}
          </View>
        </ScrollView>
        <DateRangePicker
          onComfirm={onComfirmDate}
          isVisible={modalVisible}
          defaultEndDate={selectionDate.end}
          defaultStartDate={selectionDate.start}
          onClose={() => setModalVisible(false)}
        />
      </View>
    </View>
  )
})

const $root: ViewStyle = {
  flex: 1,
  backgroundColor: "white",
  zIndex: 0,
}

export const $innerContainer: ViewStyle = {
  paddingVertical: 0,
  paddingHorizontal: 30,
}

export const $horiContainer: ViewStyle = {
  flexDirection: "row",
  gap: 10,

  alignItems: "center",
}
