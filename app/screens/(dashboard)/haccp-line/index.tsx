import { Divider, Portal, Provider } from "react-native-paper"
import { LineChart } from "react-native-gifted-charts"
import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import Icon from "react-native-vector-icons/AntDesign"
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
import { ALERT_TYPE, Dialog } from "react-native-alert-notification"
import { useStores } from "app/models"
import moment from "moment"
import { TouchableWithoutFeedback } from "react-native"
import PerformanceChart from "app/components/v2/Dashboard/PerformanceChart"
import { translate } from "../../../i18n/translate"
import PointerItem from "app/components/v2/PointerItem"

// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface LineDsScreenProps extends AppStackScreenProps<"LineDs"> {}

export const LineDsScreen: FC<LineDsScreenProps> = observer(function LineDsScreen() {
  const data = [
    { label: "All", value: "All" },
    { label: "Production Line 2", value: "Line 2" },
    { label: "Production Line 3", value: "Line 3" },
    { label: "Production Line 4", value: "Line 4" },
    { label: "Production Line 5", value: "Line 5" },
    { label: "Production Line 6", value: "Line 6" },
  ]
  const machineColors = [
    { label: data[0 + 1].value, color: "#071952" },
    { label: data[1 + 1].value, color: "#059212" },
    { label: data[2 + 1].value, color: "#D10363" },
    { label: data[3 + 1].value, color: "#DC5F00" },
    { label: data[4 + 1].value, color: "#604CC3" },
  ]
  const [selectAll, setSelectAll] = useState(false)
  const { width: maxWidth } = useWindowDimensions()
  const [modalVisible, setModalVisible] = useState(false)
  const [percentages, setPercentages] = useState(-1)
  const [isLoading, setLoading] = useState(false)
  const { dashboardStore } = useStores()
  const [emptyLine, setEmptyLine] = useState(false)
  const [selectionDate, setSelectionDate] = useState({
    start: null,
    end: null,
  })
  const [showPopup, setShowPopup] = useState(false)
  const [popupData, setPopupdata] = useState({
    percentages: "",
    label: "",
    total: "",
  })
  const [dashboard, setDashboard] = useState<AggregatedData[]>([])
  const [pieData, setPieData] = useState([
    { value: 10, color: "#EEEEEE", text: "0" },

    { value: 30, color: "#EEEEEE", text: "0" },

    { value: 10, color: "#EEEEEE", text: "0" },
  ])
  const [selectDate, setSelectDate] = useState<{
    value: Date | null
    range: number
  }>({
    value: new Date(Date.now()),
    range: 0,
  })
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
  const [selectedMachine, setSelectedMachine] = useState<string[]>([])
  const [selectColors, setSelectColors] = useState<{ label: string; color: string }[]>([])
  const [dataSet, setDataSet] = useState<DataSetProps[]>([])
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
      start: moment(startdate).format("YYYY-MM-DD") ?? "",
      end: moment(enddate).format("YYYY-MM-DD") ?? "",
    })

    setModalVisible(false)
  }

  const onLineChartData = () => {
    // let total_warning_count = 0
    // let total_normal_count = 0
    // let total_pending_count = 0
    if (dashboard?.length > 0 && selectedMachine.length > 0) {
      let total_warning_count = 0
      let total_normal_count = 0
      let total_pending_count = 0
      const newDatasets = selectedMachine.map((machine) => {
        const temporary = dashboard.map((item) => {
          const machineData = item?.machines.find((m) => m.machine === machine)

          const warningCount = machineData ? machineData.warning_count : 0
          const pendingCount = machineData ? machineData.pending_count : 0
          const normalCount = machineData ? machineData.normal_count : 0

          total_warning_count += warningCount

          total_normal_count += normalCount //check status 1 more
          total_pending_count += pendingCount

          const machineColor =
            machineColors.find((color) => color.label === machine)?.color || "#ccc"

          return {
            value: warningCount,
            label: moment(item?.date).format("LL"), // Extract date only (YYYY-MM-DD)
            dataPointText: warningCount,
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

      // console.log("Warning count is ",

      // total_warning_count,
      // "Pending Count",
      // total_pending_count,
      // "Total Normal Count",
      // total_normal_count
      // )
      const totalMachines = total_warning_count + total_normal_count + total_pending_count

      let warning_percentages
      let normal_percentage
      let pending_percentages
      if (!totalMachines) {
        setEmptyLine(true)
        setDashboard([])

        warning_percentages = 0
        normal_percentage = 0
        pending_percentages = 0

        return
      }

      warning_percentages = ((total_warning_count / totalMachines) * 100).toFixed(2)
      normal_percentage = ((total_normal_count / totalMachines) * 100).toFixed(2)
      pending_percentages = 100 - (+warning_percentages + +normal_percentage)

      setEmptyLine(false)
      setPercentages(+warning_percentages)

      setPieData([
        {
          value: total_normal_count,
          color: "#145da0",
          text: normal_percentage + "%",
          shiftTextX: -16,
          shiftTextY: 2,
          shiftTextBackgroundY: 0,
          shiftTextBackgroundX: 0,
          textBackgroundRadius: 29,
          textBackgroundColor: "#EEE",
          textColor: "#145da0",
        },
        {
          value: total_pending_count,
          color: "#0e86d4",
          text: pending_percentages?.toFixed(2) + "%",
          shiftTextX: 7,
          textBackgroundColor: "#EEE",
          shiftTextBackgroundX: 23,

          textColor: "#0e86d4",
        },
        {
          value: total_warning_count,
          color: "#BF3131",
          text: warning_percentages + "%",
          shiftTextX: -10,
          shiftTextBackgroundX: 2,
          textBackgroundColor: "#EEE",

          textColor: "#BF3131",
          shiftTextY: 1,
        },
      ])

      const allColors = newDatasets.map((item) => item.color)
      const resultColor = machineColors.filter((item) => allColors.includes(item.color))
      setSelectColors(resultColor)
    } else {
      setDataSet([])
      setPercentages(-1)
      setPieData([
        { value: 10, color: "#EEEEEE", text: "0" },

        { value: 30, color: "#EEEEEE", text: "0" },

        { value: 10, color: "#EEEEEE", text: "0" },
      ])

      setSelectColors([])
    }
  }
  const aggregateWarningCountsByDateAndMachine = (data: HACCPResponse[]): AggregatedData[] => {
    const warningCountsByDateAndMachine: Record<
      string,
      Record<
        string,
        {
          warning_count: number
          pending_count: number
          status: string | null
          normal_count: number
        }
      >
    > = {}

    data.forEach((entry) => {
      const date = entry.createdDate.split("T")[0] // Extract the date part
      if (!warningCountsByDateAndMachine[date]) {
        warningCountsByDateAndMachine[date] = {}
      }

      entry.haccplist.forEach((item) => {
        if (!warningCountsByDateAndMachine[date][item?.line]) {
          warningCountsByDateAndMachine[date][item?.line] = {
            warning_count: 0,
            pending_count: 0,
            normal_count: 0,
            status: null,
          }
        }

        console.log("item is ", item.status)

        // warningCountsByDateAndMachine[date][item?.line].warning_count += item.warning_count || 0

        if (item.status?.toLowerCase() === "normal") {
          warningCountsByDateAndMachine[date][item?.line].normal_count += 1 // Increment normal count if status is pending
        }
        if (item.status?.toLowerCase() === "warning") {
          warningCountsByDateAndMachine[date][item?.line].warning_count += 1
        }
        if (item.status?.toLowerCase() === "pending" || item.status === undefined) {
          warningCountsByDateAndMachine[date][item?.line].pending_count += 1 // Increment pending count if status is pending
        }

        warningCountsByDateAndMachine[date][item?.line].status = item.status // Add status
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

  const fetchChart = async (type: "range" | "period" = "period") => {
    try {
      setLoading(true)
      let treatments: HACCPResponse[] = []

      if (type === "period") {
        const result = await dashboardStore.getLine("day", selectDate.range?.toString())

        treatments = result?.map((item: any) => ({
          createdDate: item?.createdDate,
          haccplist: item?.haccplist?.map((haccp: any) => ({
            line: item?.line,
            status: haccp?.status,
            warning_count: haccp?.warning_count || 0,
          })),
        }))
      } else {
        const result = await dashboardStore.getCustomDateLinesWtp({
          start_date: selectionDate!.start ?? "",
          end_date: selectionDate!.end ?? "",
        })
        treatments = result?.map((item: any) => ({
          createdDate: item?.createdDate,
          haccplist: item?.haccplist?.map((haccp: any) => ({
            line: item?.line,
            status: haccp?.status,
            warning_count: haccp?.warning_count || 0,
          })),
        }))
      }

      const filteredTreatments = treatments.map((entry) => ({
        ...entry,
        haccplist: entry.haccplist.filter((item) => selectedMachine?.includes(item?.line)),
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
    setPercentages(-1)
    setDashboard([])
    setSelectColors([])
    setPieData([
      { value: 10, color: "#EEEEEE", text: "0" },

      { value: 30, color: "#EEEEEE", text: "0" },

      { value: 10, color: "#EEEEEE", text: "0" },
    ])
  }

  useEffect(() => {
    if (selectedMachine?.length > 0) {
      onLineChartData()
    }
  }, [dashboard])

  useEffect(() => {
    if (selectedMachine?.length === 0 && selectDate.value) {
      clearMachineEmpty()

      return
    }
  }, [selectedMachine])

  useEffect(() => {
    selectionDate?.end && selectionDate?.start
      ? fetchChart("range")
      : selectedMachine?.length > 0 && selectDate.value != null && fetchChart("period")
  }, [selectedMachine, selectDate, selectionDate])

  return (
    <Provider>
      <Portal>
        <TouchableWithoutFeedback
          onPress={() => {
            setShowPopup(false)
            setPopupdata({
              percentages: "",
              label: "",
            })
          }}
        >
          <View style={$root}>
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
                                  selectedMachine.includes(item.value) || selectAll
                                    ? "white"
                                    : "gray",
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
                  <View style={[styles.activityLineChart, { marginTop: 0 }, styles.shadowbox]}>
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
                            <>
                              <LineChart
                                overflowTop={50}
                                overflowBottom={50}
                                disableScroll={false}
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
                                width={maxWidth * 0.52}
                                height={320}
                                yAxisColor={"transparent"}
                                maxValue={20}
                                noOfSections={4}
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
                                      return pre + sum?.dataPointText
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
                            </>
                          )}

                          {dataSet.length === 0 && <EmptyLineChart />}
                        </View>
                      </View>
                    </View>
                  </View>

                  <View style={styles.activityPieChart}>
                    <PerformanceChart
                      isEmpyline={emptyLine}
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
            </View>
            <DateRangePicker
              onComfirm={onComfirmDate}
              isVisible={modalVisible}
              defaultEndDate={selectionDate.end}
              defaultStartDate={selectionDate.start}
              onClose={() => setModalVisible(false)}
            />
          </View>
        </TouchableWithoutFeedback>
      </Portal>
    </Provider>
  )
})

const $root: ViewStyle = { backgroundColor: "#F5F7F8", flex: 1 }

const $innerContainer: ViewStyle = {
  paddingVertical: 0,
  paddingHorizontal: 30,
}
const $horiContainer: ViewStyle = {
  flexDirection: "row",
  gap: 10,

  alignItems: "center",
}
