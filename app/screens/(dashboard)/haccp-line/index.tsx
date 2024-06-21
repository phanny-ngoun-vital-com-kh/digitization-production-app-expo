import { Divider, Portal, Provider } from "react-native-paper"
import { LineChart, PieChart } from "react-native-gifted-charts"
import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { ScrollView, View, ViewStyle, useWindowDimensions } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Text, Button } from "app/components/v2"
import styles from "./styles"
import BadgeChart from "app/components/v2/Chart/BadgeChart"
import DateRangePicker from "app/components/v2/DateRange"
import { FlatList } from "react-native"
import { TouchableOpacity } from "react-native"
import EmptyLineChart from "app/components/v2/Dashboard/EmptyLineChart"
import { DataSetProps } from "../daily-water/type"

// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface LineDsScreenProps extends AppStackScreenProps<"LineDs"> {}

export const LineDsScreen: FC<LineDsScreenProps> = observer(function LineDsScreen() {
  const { width: maxWidth } = useWindowDimensions()
  const [modalVisible, setModalVisible] = useState(false)
  const [modalVisibleV2, setModalVisibleV2] = useState(false)
  const [selectionDateV1, setSelectionDateV1] = useState({
    start: "",
    end: "",
  })
  const [selectionDateV2, setSelectionDateV2] = useState({
    start: "",
    end: "",
  })
  const data = [
    { label: "Water Line 2", value: "Line 2" },
    { label: "Water Line 3", value: "Line 3" },
    { label: "Water Line 4", value: "Line 4" },
    { label: "Water Line 5", value: "Line 5" },
    { label: "Water Line 6", value: "Line 6" },
  ]

  // const [selectedMachine, setSelectedMachine] = useState<string[]>([])
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
  const [dashboard, setDashboard] = useState([])
  const pieData = [
    { value: 54, color: "#145da0" },

    { value: 16, color: "#0e86d4" },
    { value: 10, color: "#BF3131" },
  ]
  const [selectDate, setSelectDate] = useState<{
    value: Date | null
    range: number
  }>({
    value: null,
    range: 0,
  })
  const [selectionDate, setSelectionDate] = useState({
    start: "",
    end: "",
  })

  const onSelectRangeDate = (inDay: number) =>
    setSelectDate(() => {
      const today = new Date(Date.now())
      return {
        range: inDay,
        value: new Date(today.getFullYear(), today.getMonth(), today.getDate() - inDay),
      }
    })
  const label = ["Mon", "Tues", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const [selectedMachine, setSelectedMachine] = useState<string[]>([])
  const [selectColors, setSelectColors] = useState<{ label: string; color: string }[]>([])
  const [dataSet, setDataSet] = useState<DataSetProps[]>([])

  const onChangeMachine = (item: any) => {
    setSelectedMachine(item)
  }
  const onComfirmDate = (startDate: string, endDate: string) => {
    setSelectionDateV1({
      start: startDate,
      end: endDate,
    })
    setModalVisible(false)
  }
  const onComfirmDateV2 = (startDate: string, endDate: string) => {
    setSelectionDateV2({
      start: startDate,
      end: endDate,
    })
    setModalVisibleV2(false)
  }
  useEffect(() => {}, [selectedMachine])

  return (
    <Provider>
      <Portal>
        <View style={$root}>
          <View style={$innerContainer}>
            <ScrollView
              scrollEnabled
              showsVerticalScrollIndicator={true}
              persistentScrollbar={true}
            >
              <View style={styles.row1}>
                <View style={[styles.activityBarCharts]}>
                  <Text semibold body1>
                    <Text errorColor>* </Text> Select Lines
                  </Text>
                  <FlatList
                    horizontal
                    scrollEnabled={false}
                    renderItem={({ item, index }) => {
                      return (
                        <TouchableOpacity
                          // disabled={selectedMachine?.length >= 4}
                          onPress={() => {
                            if (selectedMachine?.length >= 5) {
                              if (selectedMachine.includes(item.value)) {
                                console.log("true")
                                setSelectedMachine((pre) =>
                                  pre.filter((machine) => machine !== item.value),
                                )
                                return
                              }
                            } else {
                              if (selectedMachine.includes(item.value)) {
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

                              backgroundColor: selectedMachine.includes(item.value)
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
                                color: selectedMachine.includes(item.value) ? "white" : "gray",
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
                    style={[
                      $horiContainer,
                      { marginVertical: 20, justifyContent: "space-between" },
                    ]}
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
                  {/* <MultiSelectComponent /> */}
    

                  <View
                    style={[
                      { paddingHorizontal: 0, paddingVertical: 25, overflow: "hidden" },
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
                          data5={dataSet[4]?.data}
                          color1={selectColors[0]?.color}
                          color2={selectColors[1]?.color}
                          color3={selectColors[2]?.color}
                          color4={selectColors[3]?.color}
                          color5={selectColors[4]?.color}
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
                                  <Text
                                    caption1
                                    regular
                                    style={{ marginVertical: 10 }}
                                    primaryColor
                                  >
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
              </View>
              {/* 
              <View style={styles.row1}>
                <View style={[styles.activityBarCharts]}>
                  <Text semibold body1>
                    Line 4,5,6
                  </Text>
                  <View style={{ width: "100%", marginTop: 20 }}>
                    <MultiSelectComponent
                      label="Select Machines"
                      data={data}
                      onChangeMachine={onChangeMachine}
                    />
                  </View>

                  <View
                    style={[
                      $horiContainer,
                      { marginVertical: 20, justifyContent: "space-between" },
                    ]}
                  >
                    <View style={$horiContainer}>
                      <Button
                        style={[styles.dateAgo, { backgroundColor: "#0081F8" }]}
                        styleText={{
                          fontWeight: "bold",
                        }}
                      >
                        <Text caption1 whiteColor>
                          7 days
                        </Text>
                      </Button>
                      <Button
                        style={styles.dateAgo}
                        outline
                        styleText={{
                          fontWeight: "bold",
                        }}
                      >
                        <Text caption1 primaryColor>
                          14 days
                        </Text>
                      </Button>
                      <Button
                        style={styles.dateAgo}
                        outline
                        styleText={{
                          fontWeight: "bold",
                        }}
                      >
                        <Text caption1 primaryColor>
                          21 days
                        </Text>
                      </Button>
                      <Button
                        style={styles.dateAgo}
                        outline
                        onPress={() => setModalVisibleV2(true)}
                        styleText={{
                          fontWeight: "bold",
                        }}
                      >
                        <Text caption1 primaryColor semibold>
                          {!selectionDateV2.start
                            ? "Date Range"
                            : selectionDateV2.start + "-" + selectionDateV2.end}
                        </Text>
                      </Button>
                    </View>
                  </View>
               
                  <Divider />

                  <View style={$horiContainer}>
                    <View style={[{ paddingHorizontal: 20, paddingVertical: 35, flex: 0.7 }]}>
                      <View style={$horiContainer}>
                        <Text semibold>Water Pressure</Text>
                      </View>

                      <View style={{ marginVertical: 20, overflow: "hidden" }}>
                        <LineChart
                          data={lineData}
                          data2={lineData2}
                          height={400}
                          spacing={maxWidth / 8}
                          isAnimated
                          scrollAnimation
                          showScrollIndicator={true}
                          width={maxWidth * 0.6}
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
                      </View>
                    </View>
                    <View style={[styles.activityPieChart]}>
                      <Text semibold body1>
                        Activity Line
                      </Text>
                      <View style={[{ justifyContent: "center", gap: 10, marginTop: 20 }]}>
                        <BadgeChart title="Normal" bgColor="#145da0" />
                        <BadgeChart title="Pending" bgColor="#0e86d4" />

                        <BadgeChart title="Warning" bgColor="#BF3131" />
                      </View>

                      <View style={{ paddingHorizontal: 20, paddingVertical: 35 }}>
                        <View
                          style={{
                            marginVertical: 20,
                            justifyContent: "center",
                            flexDirection: "row",
                          }}
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
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View> */}
            </ScrollView>
          </View>
          <DateRangePicker
            onComfirm={onComfirmDate}
            isVisible={modalVisible}
            defaultEndDate={selectionDateV1.end}
            defaultStartDate={selectionDateV1.start}
            onClose={() => setModalVisible(false)}
          />
          <DateRangePicker
            onComfirm={onComfirmDateV2}
            isVisible={modalVisibleV2}
            defaultEndDate={selectionDateV2.end}
            defaultStartDate={selectionDateV2.start}
            onClose={() => setModalVisibleV2(false)}
          />
        </View>
      </Portal>
    </Provider>
  )
})

const $root: ViewStyle = {
  flex: 1,
  backgroundColor: "white",
}

const $innerContainer: ViewStyle = {
  paddingVertical: 0,
  paddingHorizontal: 30,
}
const $horiContainer: ViewStyle = {
  flexDirection: "row",
  gap: 10,

  alignItems: "center",
}
