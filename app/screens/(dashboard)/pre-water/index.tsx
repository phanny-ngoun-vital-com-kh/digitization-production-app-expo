import React, { FC, useEffect, useState } from "react"
import { LineChart } from "react-native-gifted-charts"
import Icon from "react-native-vector-icons/AntDesign"
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view"
import { observer } from "mobx-react-lite"
import { View, ViewStyle, useWindowDimensions, ScrollView } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Button, Text } from "app/components/v2"
import styles from "./styles"
import DateRangePicker from "app/components/v2/DateRange"
import { FlatList } from "react-native"
import { TouchableOpacity } from "react-native"
import { DataSetProps } from "../daily-water/type"
import EmptyLineChart from "app/components/v2/Dashboard/EmptyLineChart"
import moment from "moment"
import { useStores } from "app/models"
import PerformanceChart from "app/components/v2/Dashboard/PerformanceChart"
import { ALERT_TYPE, Dialog } from "react-native-alert-notification"
import { TouchableWithoutFeedback } from "react-native"
import BadgeChart from "app/components/v2/Chart/BadgeChart"
import { translate } from "../../../i18n/translate"
import PointerItem from "app/components/v2/PointerItem"

interface PreWaterDsScreenProps extends AppStackScreenProps<"PreWaterDs"> {}

export const PreWaterDsScreen: FC<PreWaterDsScreenProps> = observer(function PreWaterDsScreen() {
  const [modalVisible, setModalVisible] = useState(false)
  const [selectionDate, setSelectionDate] = useState({
    start: null,
    end: null,
  })
  const [fakeScrollIndicator, setFakeScrollIndicator] = useState(true)

  const data = [
    { label: "All", value: "All" },
    { label: "Water Treatment Plant 2", value: "Water Treatment Plant 2" },
    { label: "Water Treatment Plant 3", value: "Water Treatment Plant 3" },
    { label: "Water Treatment Plant 4", value: "Water Treatment Plant 4" },
  ]
  const machineColors = [
    { label: data[1].label, color: "#604CC3" },
    { label: data[2].label, color: "#059212" },
    { label: data[3].label, color: "#D10363" },
  ]

  const { width: maxWidth } = useWindowDimensions()
  const { dashboardStore } = useStores()
  const [dashboard, setDashboard] = useState([])
  const [selectedMachine, setSelectedMachine] = useState<string[]>([])
  const [selectColors, setSelectColors] = useState<{ label: string; color: string }[]>([])
  const [dataSet, setDataSet] = useState<DataSetProps[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [popupData, setPopupdata] = useState({
    percentages: "",
    label: "",
    total: "",
  })
  const [percentages, setPercentages] = useState(-1)
  const [isLoading, setLoading] = useState(false)
  const [selectDate, setSelectDate] = useState<{
    value: Date | null
    range: number
  }>({
    value: new Date(Date.now()),
    range: 0,
  })
  const [pieData, setPieData] = useState([
    { value: 10, color: "#EEEEEE", text: "0%" },

    { value: 30, color: "#EEEEEE", text: "0%" },

    { value: 10, color: "#EEEEEE", text: "0%" },
  ])
  const onSelectRangeDate = (inDay: number) => {
    setSelectionDate({
      end: null,
      start: null,
    })
    setSelectDate(() => {
      const today = new Date(Date.now())
      return {
        range: inDay,
        value: new Date(today.getFullYear(), today.getMonth(), today.getDate() - inDay),
      }
    })
  }
  const onComfirmDate = (startDate: string, endDate: string) => {
    const [day, month, year] = startDate.split("/")
    const [eday, emonth, eyear] = endDate.split("/")

    // Create a Date object
    const startdate = new Date(year, month - 1, day)
    const enddate = new Date(eyear, emonth - 1, eday)
    setSelectDate({
      range: -1,
      value: null,
    })
    setSelectionDate({
      start: moment(startdate)!.format("YYYY-MM-DD") ?? "",
      end: moment(enddate)!.format("YYYY-MM-DD") ?? "",
    })

    setModalVisible(false)
  }
  const customDataPoint = (color) => {
    return (
      <View
        style={{
          width: 15,

          height: 15,

          backgroundColor: "white",

          borderWidth: 4,

          borderRadius: 10,

          borderColor: color,
        }}
      />
    )
  }

  const onLineChartData = () => {
    if (dashboard?.length > 0 && selectedMachine.length > 0) {
      let total_warning_count = 0
      let total_normal_count = 0
      let total_pending_count = 0

      const newDatasets = selectedMachine.map((machine) => {
        const temporary = dashboard.map((item) => {
          const machineData = item?.machines.find((m) => m.machine === machine)

          const warningCount = machineData ? machineData.warning_count : 0
          const pendingCount = machineData ? machineData.pending_count : 0
          const normalCount = machineData ? machineData?.normal_count : 0

          total_warning_count += warningCount
          total_normal_count += normalCount //check status 1 more
          total_pending_count += pendingCount

          const machineColor =
            machineColors.find((color) => color.label === machine)?.color || "#ccc"

          return {
            value: warningCount,
            label: moment(item?.date).format("LL"), // Extract date only (YYYY-MM-DD)
            dataPointText: warningCount.toString(),
            customDataPoint: () => customDataPoint(machineColor),
            textColor: machineColor,
            dataPointColor: machineColor,
          }
        })

        const color = machineColors.find((item) => item.label === machine)?.color || "#ccc"

        return {
          data: temporary,
          color: color,
        }
      })

      setDataSet(newDatasets)

      const totalMachines = total_warning_count + total_normal_count + total_pending_count
      const warning_percentages = ((total_warning_count / totalMachines) * 100).toFixed(2)
      const normal_percentage = ((total_normal_count / totalMachines) * 100).toFixed(2)
      const pending_percentages = 100 - (+warning_percentages + +normal_percentage)

      setPercentages(+normal_percentage)

      setPieData([
        {
          value: total_normal_count,
          color: "#145da0",
          text: normal_percentage + "%",
          shiftTextX: 35,
          shiftTextBackgroundX: 43,
          textBackgroundColor: "#EEE",
          textColor: "#145da0",
          textBackgroundRadius: 29,

          shiftTextY: 10,
        },
        {
          value: total_pending_count,
          color: "#0e86d4",
          text: pending_percentages + "%",
          shiftTextX: 10,
          shiftTextBackgroundX: 23,
          textBackgroundRadius: 29,
          textBackgroundColor: "#EEE",
          textColor: "#0e86d4",
        },
        {
          value: total_warning_count,
          color: "#BF3131",
          text: warning_percentages + "%",
          shiftTextX: -7,
          shiftTextBackgroundX: 2,
          textBackgroundColor: "#EEE",
          textColor: "#BF3131",
          shiftTextY: 10,
        },
      ])

      const allColors = newDatasets.map((item) => item.color)
      const resultColor = machineColors.filter((item) => allColors.includes(item.color))

      setSelectColors(resultColor)
    } else {
      setDataSet([])
      setPercentages(-1)
      setPieData([
        { value: 10, color: "#EEEEEE", text: "0%" },

        { value: 30, color: "#EEEEEE", text: "0%" },

        { value: 10, color: "#EEEEEE", text: "0%" },
      ])

      setSelectColors([])
    }
  }

  const aggregateWarningCountsByDateAndMachine = (data) => {
    const warningCountsByDateAndMachine = {}

    data?.forEach((entry) => {
      const date = entry.assign_date
      if (!warningCountsByDateAndMachine[date]) {
        warningCountsByDateAndMachine[date] = {}
      }

      entry.pretreatmentlist.forEach((item) => {
        if (!warningCountsByDateAndMachine[date][entry.pre_treatment_type]) {
          warningCountsByDateAndMachine[date][entry.pre_treatment_type] = {
            warning_count: 0,
            normal_count: 0,
            pending_count: 0, // Initialize pending count
            status: null,
          }
        }

        if (item.status === "pending") {
          warningCountsByDateAndMachine[date][entry.pre_treatment_type].pending_count += 1 // Increment pending count if status is pending
        }
        if (item.status === "normal") {
          warningCountsByDateAndMachine[date][entry.pre_treatment_type].normal_count += 1 // Increment pending count if status is pending
        }

        if (item.status === "warning") {
          warningCountsByDateAndMachine[date][entry.pre_treatment_type].warning_count += 1
        }

        warningCountsByDateAndMachine[date][entry.pre_treatment_type].status = item.status // Add status
      })
    })

    return Object.keys(warningCountsByDateAndMachine).map((date) => ({
      date,
      machines: Object.keys(warningCountsByDateAndMachine[date]).map((machine) => ({
        machine,
        warning_count: warningCountsByDateAndMachine[date][machine].warning_count,
        normal_count: warningCountsByDateAndMachine[date][machine].normal_count,
        pending_count: warningCountsByDateAndMachine[date][machine].pending_count, // Include pending count
        status: warningCountsByDateAndMachine[date][machine].status, // Include status
      })),
    }))
  }

  const fetchChart = async (type = "period") => {
    try {
      setLoading(true)
      let treatments = []

      if (type === "period") {
        const result = await dashboardStore.getPre("day", selectDate.range?.toString())

        treatments = result?.map((item) => ({
          assign_date: item?.assign_date,
          pre_treatment_type: item?.pre_treatment_type,
          pretreatmentlist: item?.pretreatmentlist?.map((pretreat) => ({
            control: pretreat?.control,
            status: pretreat?.status,
            warning_count: pretreat?.warning_count || 0,
          })),
        }))
      } else {
        const result = await dashboardStore.getCustomDatePreWtp({
          start_date: selectionDate!.start ?? "",
          end_date: selectionDate!.end ?? "",
        })
        treatments = result?.map((item) => ({
          assign_date: item?.assign_date,
          pre_treatment_type: item?.pre_treatment_type,
          pretreatmentlist: item?.pretreatmentlist?.map((pretreat) => ({
            control: pretreat?.control,
            status: pretreat?.status,
            warning_count: pretreat?.warning_count || 0,
          })),
        }))
      }

      const filteredTreatments = treatments.map((entry) => ({
        ...entry,
        pretreatmentlist: entry.pretreatmentlist?.filter((item) =>
          selectedMachine?.includes(entry.pre_treatment_type),
        ),
      }))

      const aggregatedData = aggregateWarningCountsByDateAndMachine(filteredTreatments)

      setDashboard(aggregatedData)
    } catch (error) {
      console.error(error?.message)
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "មិនជោគជ័យ",
        textBody: "កំណត់ត្រាមិនត្រូវបានរក្សាទុកទេ។",
        autoClose: 200,
      })
    } finally {
      setLoading(false)
    }
  }

  const clearMachineEmpty = () => {
    setDataSet([])
    setDashboard([])
    setPieData([
      { value: 10, color: "#EEEEEE", text: "0%" },

      { value: 30, color: "#EEEEEE", text: "0%" },

      { value: 10, color: "#EEEEEE", text: "0%" },
    ])
    setPercentages(-1)
  }
  useEffect(() => {
    if (selectedMachine?.length > 0) {
      onLineChartData()
    }
  }, [dashboard])

  useEffect(() => {
    if (selectedMachine?.length == 0 && dashboard.length > 0) {
      clearMachineEmpty()

      return
    }
    selectionDate?.end && selectionDate?.start
      ? fetchChart("range")
      : selectedMachine?.length > 0 && selectDate.value != null && fetchChart("period")
  }, [selectedMachine, selectDate, selectionDate])

  return (
    <View style={$root}>
      <TouchableWithoutFeedback
        onPress={() => {
          setShowPopup(false)
          setPopupdata({
            percentages: "",
            label: "",
          })
        }}
      >
        <View style={$innerContainer}>
          <ScrollView showsVerticalScrollIndicator persistentScrollbar>
            <View style={{ marginVertical: 20, gap: 0 }}>
              <View style={[$horiContainer, { justifyContent: "start", alignItems: "center" }]}>
                <Text semibold errorColor body1>
                  *
                </Text>
                <Text semibold body1>
                  {translate("haccpMonitoring.selectLine")}
                </Text>
              </View>

              <FlatList
                horizontal
                scrollEnabled={false}
                style={{ marginTop: 10 }}
                renderItem={({ item, index }) => {
                  return (
                    <TouchableOpacity
                      // disabled={selectedMachine?.length >= 4}
                      onPress={() => {
                        console.log(item)
                        if (index === 0) {
                          const Allmachines = data
                            .filter((machine) => machine!.label !== "All")
                            .map((item) => item.value)

                          selectAll ? setSelectedMachine([]) : setSelectedMachine(Allmachines)
                          setSelectAll((pre) => !pre)
                          return
                        }
                        setSelectAll(false)
                        if (selectedMachine.includes(item.value)) {
                          setSelectedMachine((pre) =>
                            pre.filter((machine) => machine !== item.value),
                          )
                          return
                        } else {
                          setSelectedMachine((pre) => pre.concat(item.value))
                        }
                      }}
                    >
                      <View
                        style={[
                          {
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 10,

                            backgroundColor:
                              selectedMachine.includes(item.value) || selectAll
                                ? "#0081F8"
                                : "#DFDFDE",

                            gap: 10,
                            marginTop: 8,
                            marginRight: 12,
                            paddingHorizontal: 12,
                            paddingVertical: 10,
                          },
                        ]}
                      >
                        {selectedMachine.includes(item.value) ? (
                          <Icon name="close" size={15} color="white" />
                        ) : (
                          <></>
                        )}
                        <Text
                          style={{
                            fontSize: 13,
                            color:
                              selectedMachine.includes(item.value) || selectAll ? "white" : "gray",
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
            </View>

            <View style={styles.row1}>
              <View
                style={[
                  styles.activityLineChart,
                  { marginTop: 0, overflow: "visible" },
                  styles.shadowbox,
                ]}
              >
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text body1 semibold>
                      Machine Status
                    </Text>

                    <View
                      style={[
                        $horiContainer,
                        { justifyContent: "space-between", marginBottom: 10 },
                      ]}
                    >
                      <View style={$horiContainer}>
                        <Button
                          style={[
                            styles.dateAgo,
                            selectDate.range === 0 && { backgroundColor: "#0081F8" },
                          ]}
                          outline
                          onPress={() => onSelectRangeDate(0)}
                          styleText={{
                            fontWeight: "bold",
                          }}
                        >
                          <Text caption1 primaryColor whiteColor={selectDate.range === 0}>
                            Today
                          </Text>
                        </Button>

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
                          style={[
                            styles.dateAgo,
                            selectionDate?.end && { backgroundColor: "#0081F8" },
                          ]}
                          outline
                          onPress={() => setModalVisible(true)}
                          styleText={{
                            fontWeight: "bold",
                          }}
                        >
                          <Text caption1 primaryColor whiteColor={!!selectionDate?.end}>
                            {!selectionDate.start
                              ? "Date Range"
                              : selectionDate.start + "-" + selectionDate.end}
                          </Text>
                        </Button>
                      </View>
                    </View>
                  </View>

                  <View style={{ marginVertical: 15 }}>
                    <FlatList
                      horizontal
                      data={selectColors}
                      contentContainerStyle={{ gap: 25 }}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item }) => (
                        <View style={$horiContainer}>
                          <BadgeChart bgColor={item.color} title=" " value={null} />
                          <Text caption1>{item.label}</Text>
                        </View>
                      )}
                    />
                  </View>

                  <View
                    style={[
                      { paddingHorizontal: 0, paddingBottom: 0, overflow: "visible" },
                      $horiContainer,
                    ]}
                  >
                    {isLoading ? (
                      <View style={styles.loadingStyle}>
                        <Text textAlign={"center"} primaryColor>
                          {translate("wtpcommon.loadingData")}.....
                        </Text>
                      </View>
                    ) : dashboard.length === 0 && selectedMachine?.length !== 0 ? (
                      <View style={styles.loadingStyle}>
                        <Text textAlign={"center"} errorColor>
                          {translate("wtpcommon.noRecordFound")}
                        </Text>
                      </View>
                    ) : (
                      <></>
                    )}

                    <View style={{ marginBottom: 0, flex: 1, zIndex: 0 }}>
                      {dataSet && dataSet.length > 0 && (
                        <ReactNativeZoomableView
                        pinchToZoomInSensitivity ={10}
                          zoomStep={1}
                          minZoom={100}
                          maxZoom={100}
                          initialZoom={0.75}
                          // Give these to the zoomable view so it can apply the boundaries around the actual content.
                          // Need to make sure the content is actually centered and the width and height are
                          // dimensions when it's rendered naturally. Not the intrinsic size.
                          // For example, an image with an intrinsic size of 400x200 will be rendered as 300x150 in this case.
                          // Therefore, we'll feed the zoomable view the 300x150 size.
                        >
                          <LineChart
                            overflowTop={15}
                            overflowBottom={50}
                            disableScroll={false}
                            dataSet={dataSet}
                            data={dataSet[0]?.data}
                            data2={dataSet[1]?.data}
                            data3={dataSet[2]?.data}
                            color1={selectColors[0]?.color}
                            color2={selectColors[1]?.color}
                            color3={selectColors[2]?.color}
                            thickness={2}
                            // width={maxWidth * 1}
                            height={320}
                            yAxisColor={"transparent"}
                            // maxValue={100}
                            noOfSections={4}
                            onStartReached={() => setFakeScrollIndicator(true)}
                            isAnimated={true}
                            rulesType="dashed"
                            endOpacity={0.1}
                            spacing={maxWidth / 6}
                            endSpacing={25}
                            indicatorColor="white"
                            showScrollIndicator={true}
                            initialSpacing={40}
                            dataPointsHeight={5}
                            dataPointsWidth={10}
                            textShiftY={-3}
                            adjustToWidth
                            animateTogether
                            textShiftX={-3}
                            yAxisTextStyle={{
                              fontSize: 13,
                              fontWeight: "bold",
                            }}
                            xAxisLabelTextStyle={{
                              fontSize: 10.5,
                              fontWeight: "bold",
                            }}
                            textFontSize={12}
                            onScroll={() => setFakeScrollIndicator(false)}
                            curved={false}
                            // yAxisLabelSuffix="%"
                            xAxisColor={"gray"}
                            xAxisThickness={1}
                            hideDataPoints={false}
                            xAxisType={"dashed"}
                            pointerConfig={{
                              pointerStripUptoDataPoint: false,
                              pointerStripColor: "black",
                              pointerStripWidth: 2,
                              strokeDashArray: [2, 5],
                              activatePointersDelay: 0,
                              persistPointer: false,
                              pointerVanishDelay: 0,

                              // barTouchable: true,
                              resetPointerOnDataChange: true,
                              pointerColor: "transparent",
                              radius: 4,

                              activatePointersOnLongPress: false,

                              pointerLabelComponent: (items: any[]) => {
                                const datatoshow = dataSet?.map((item) => item.data)[0]

                                const labels = items.map((item) => item.label)[0]
                                const indexFound = datatoshow
                                  ?.map((item) => item.label)
                                  .findIndex((data) => labels.includes(data))

                                const warning_count = items?.reduce((pre, sum) => {
                                  return pre + +sum?.dataPointText
                                }, 0)
                                return (
                                  <PointerItem
                                    dataPopup={items}
                                    indexFound={indexFound}
                                    length={dashboard.length}
                                    label={items[0]?.label}
                                    selectedColors={selectColors}
                                    warning_count={warning_count}
                                  />
                                )
                              },
                            }}
                          ></LineChart>
                        </ReactNativeZoomableView>
                      )}

                      {dataSet.length === 0 && <EmptyLineChart />}
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.activityPieChart}>
                <PerformanceChart
                  pieData={pieData}
                  isloading={isLoading}
                  popupData={popupData}
                  percentages={percentages}
                  setPopupdata={setPopupdata}
                  setShowPopup={setShowPopup}
                  showPopup={showPopup}
                  machineLength={dataSet?.length}
                />
              </View>
            </View>
          </ScrollView>

          {/* <Barchartdialog visible={showPopup} onClose={() => setShowPopup(false)} data={[]} /> */}
          <DateRangePicker
            onComfirm={onComfirmDate}
            isVisible={modalVisible}
            defaultEndDate={selectionDate.end}
            defaultStartDate={selectionDate.start}
            onClose={() => setModalVisible(false)}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  )
})

const $root: ViewStyle = { backgroundColor: "#F5F7F8", flex: 1 }

export const $innerContainer: ViewStyle = {
  paddingVertical: 0,
  paddingHorizontal: 30,
}

export const $horiContainer: ViewStyle = {
  flexDirection: "row",
  gap: 10,

  alignItems: "center",
}
