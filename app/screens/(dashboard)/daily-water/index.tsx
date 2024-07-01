import React, { useEffect, useState } from "react"
import { LineChart } from "react-native-gifted-charts"
import { Divider, Portal, Provider } from "react-native-paper"
import { observer } from "mobx-react-lite"
import {
  FlatList,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
  useWindowDimensions,
} from "react-native"
import Icon from "react-native-vector-icons/AntDesign"
import { AppStackScreenProps } from "app/navigators"
import { Button, Text } from "app/components/v2"
import styles from "./styles"
import BadgeChart from "app/components/v2/Chart/BadgeChart"
import DateRangePicker from "app/components/v2/DateRange"
import { DataPoint, DataSetProps } from "./type"
import EmptyLineChart from "app/components/v2/Dashboard/EmptyLineChart"
import { useStores } from "app/models"
import { ALERT_TYPE, Dialog } from "react-native-alert-notification"
import moment from "moment"
import { translate } from "../../../i18n"
import PerformanceChart from "app/components/v2/Dashboard/PerformanceChart"
import { customDataPoint } from "app/utils-v2/dashboard/customPoint"
import PointerItem from "app/components/v2/PointerItem"
interface DailyDsScreenProps extends AppStackScreenProps<"DailyDs"> {}

export const DailyDsScreen: React.FC<DailyDsScreenProps> = observer(function DailyDsScreen() {
  const { width: maxWidth } = useWindowDimensions()
  const machineColors = [
    { label: "Raw Water Stock", color: "#088395" },
    { label: "Sand Filter", color: "#059212" },
    { label: "Carbon Filter", color: "#D10363" },
    { label: "Resin Filter", color: "#DC5F00" },
    { label: "MicroFilter 5 Mm", color: "#604CC3" },
    { label: "MicroFilter 1Mm", color: "#071952" },
    { label: "Reverses Osmosis", color: "#79155B" },
  ]
  const [isLoading, setLoading] = useState(false)
  const { dashboardStore } = useStores()
  const [modalVisible, setModalVisible] = useState(false)
  const [selectionDate, setSelectionDate] = useState({
    start: null,
    end: null,
  })
  const [percentages, setPercentages] = useState(-1)
  const [selectDate, setSelectDate] = useState<{
    value: Date | null
    range: number
  }>({
    value: null,
    range: 0,
  })
  const data = [
    { label: "Raw Water Stock", value: "Raw Water Stock" },
    { label: "Sand Filter", value: "Sand Filter" },
    { label: "Carbon Filter", value: "Carbon Filter" },
    { label: "Resin Filter", value: "Resin Filter" },
    { label: "MicroFilter 5 Mm", value: "MicroFilter 5 Mm" },
    { label: "MicroFilter 1Mm", value: "MicroFilter 1Mm" },
    { label: "Reverses Osmosis", value: "Reverses Osmosis" },
  ]

  const [showPointerBar, setShowPointerBar] = useState(true)
  const [selectedMachine, setSelectedMachine] = useState<string[]>([])
  const [selectColors, setSelectColors] = useState<{ label: string; color: string }[]>([])
  const [dataSet, setDataSet] = useState<DataSetProps[]>([])
  const [showPopup, setShowPopup] = useState(false)
  const [popupData, setPopupdata] = useState({
    percentages: "",
    label: "",
    total: "",
  })
  const [dashboard, setDashboard] = useState<
    {
      machines: {
        machine: string
        warning_count: number
        pending_count: number
        status: "pending" | "normal" | "warning"
      }[]
      date: string
    }[]
  >([])
  const [pieData, setPieData] = useState([
    { value: 10, color: "#EEEEEE", text: "0" },

    { value: 30, color: "#EEEEEE", text: "0" },

    { value: 10, color: "#EEEEEE", text: "0" },
  ])

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
    setSelectDate({
      range: null,
      value: null,
    })
    setModalVisible(false)
  }
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

  const aggregateWarningCountsByDateAndMachine = (data) => {
    const warningCountsByDateAndMachine = {}

    data.forEach((entry) => {
      const date = entry.createdDate.split("T")[0] // Extract the date part
      if (!warningCountsByDateAndMachine[date]) {
        warningCountsByDateAndMachine[date] = {}
      }

      entry.data.forEach((item) => {
        if (!warningCountsByDateAndMachine[date][item?.machine]) {
          warningCountsByDateAndMachine[date][item?.machine] = {
            warning_count: 0,
            pending_count: 0, // Initialize pending count
            status: null,
          }
        }
        warningCountsByDateAndMachine[date][item?.machine].warning_count += item.warning_count || 0
        if (item.status === "pending") {
          warningCountsByDateAndMachine[date][item?.machine].pending_count += 1 // Increment pending count if status is pending
        }
        warningCountsByDateAndMachine[date][item?.machine].status = item.status // Add status
      })
    })

    return Object.keys(warningCountsByDateAndMachine).map((date) => ({
      date,
      machines: Object.keys(warningCountsByDateAndMachine[date]).map((machine) => ({
        machine,
        warning_count: warningCountsByDateAndMachine[date][machine].warning_count,
        pending_count: warningCountsByDateAndMachine[date][machine].pending_count, // Include pending count
        status: warningCountsByDateAndMachine[date][machine].status, // Include status
      })),
    }))
  }
  const clearMachineEmpty = () => {
    setDataSet([])
    setDashboard([])
    setSelectColors([])
    setPieData([
      { value: 10, color: "#EEEEEE", text: "0" },

      { value: 30, color: "#EEEEEE", text: "0" },

      { value: 10, color: "#EEEEEE", text: "0" },
    ])
    setPercentages(-1)
  }
  const fetchChart = async (type: "range" | "period" = "period") => {
    try {
      setLoading(true)
      if (type === "period") {
        const result = await dashboardStore.getWtp("day", selectDate.range?.toString())
        const treatments = result?.map((item) => {
          return {
            createdDate: item?.createdDate,
            data: item?.treatmentlist?.map((item) => {
              return {
                machine: item?.machine,
                status: item.status,
                warning_count: item?.warning_count || 0,
              }
            }),
          }
        })
        const filteredTreatments = treatments.map((entry) => ({
          ...entry,
          data: entry.data.filter((item) => selectedMachine?.includes(item?.machine)),
        }))

        const aggregatedData = aggregateWarningCountsByDateAndMachine(filteredTreatments)
        setDashboard(aggregatedData)
      } else {
        const result = await dashboardStore.getCustomDateWtp({
          start_date: selectionDate!.start ?? "",
          end_date: selectionDate!.end ?? "",
        })
        const treatments = result?.map((item) => {
          return {
            createdDate: item?.createdDate,

            data: item?.treatmentlist?.map((item) => ({
              machine: item?.machine,
              status: item.status,
              warning_count: item?.warning_count || 0,
            })),
          }
        })
        const filteredTreatments = treatments.map((entry) => ({
          ...entry,
          data: entry.data.filter((item) => selectedMachine?.includes(item?.machine)),
        }))

        const aggregatedData = aggregateWarningCountsByDateAndMachine(filteredTreatments)
        setDashboard(aggregatedData)
      }
    } catch (error) {
      console.error(error?.message)
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "មិនជោគជ័យ",
        textBody: "កំណត់ត្រាមិនត្រូវបានរក្សាទុកទេ។",
        // button: 'close',
        autoClose: 200,
      })
    } finally {
      setLoading(false)
    }
  }
  const onLineChartData = () => {
    if (dashboard?.length > 0 && selectedMachine.length > 0) {
      let total_warning_count = 0
      let total_normal_count = 0
      let total_pending_count = 0

      const newDatasets = selectedMachine.map((machine) => {
        const temporary = dashboard.map((item) => {
          const machineData = item.machines.find((m) => m.machine === machine)

          const warningCount = machineData ? machineData.warning_count : 0
          const pendingCount = machineData ? machineData?.pending_count : 0
          total_warning_count += warningCount
          total_normal_count += warningCount <= 0 ? 1 : 0
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
          dataPointsColor: color,
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
          shiftTextX: -13,
          shiftTextY: 2,
          textBackgroundRadius: 35,
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
          shiftTextBackgroundX: 20,
          textBackgroundColor: "#EEE",
          textBackgroundRadius: 29,
          textColor: "#0e86d4",
        },
        {
          value: total_warning_count,
          color: "#BF3131",
          text: warning_percentages + "%",
          shiftTextX: -10,
          shiftTextBackgroundX: 2,
          textBackgroundColor: "#EEE",
          textBackgroundRadius: 29,
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

  // console.log('data set is',dataSet[0]?.data)
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
                    <View>
                      {/* {selectedMachine?.length > 4 && (
                        <Text errorColor body2>
                          ( Maximum 5 water treatment machines )
                        </Text>
                      )} */}
                    </View>
                  </View>

                  <FlatList
                    horizontal
                    scrollEnabled={false}
                    renderItem={({ item, index }) => {
                      return (
                        <TouchableOpacity
                          // disabled={selectedMachine?.length >= 4}
                          onPress={() => {
                            // if (selectedMachine?.length >= 5) {
                            //   if (selectedMachine.includes(item.value)) {
                            //     setSelectedMachine((pre) =>
                            //       pre.filter((machine) => machine !== item.value),
                            //     )
                            //     return
                            //   }
                            // }

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

                                backgroundColor: selectedMachine.includes(item.value)
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
                          {translate("dashboard.machineActivity")}
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
                            <>
                              <LineChart
                                overflowTop={15}
                                overflowBottom={50}
                                disableScroll={false}
                                // dataSet={dataSet}
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
                                // maxValue={100}
                                noOfSections={4}
                                onStartReached={() => {}}
                                isAnimated={true}
                                rulesType="dashed"
                                endOpacity={0.1}
                                spacing={maxWidth / 6}
                                endSpacing={50}
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
                                onScroll={() => {}}
                                curved={false}
                                // yAxisLabelSuffix="%"
                                xAxisColor={"gray"}
                                xAxisThickness={1}
                                hideDataPoints={false}
                                unFocusOnPressOut
                                xAxisType={"dashed"}
                                pointerConfig={{
                                  pointerStripUptoDataPoint: false,
                                  pointerStripColor: "black",
                                  pointerStripWidth: 3,
                                  strokeDashArray: [2, 5],
                                  activatePointersDelay: 0,
                                  pointerColor: "transparent",
                                  resetPointerOnDataChange: true,
                                  radius: 4,
                                  activatePointersOnLongPress: false,
                                  pointerVanishDelay: 0,

                                  pointerLabelComponent: (items: any[]) => {
                                    const datatoshow = dataSet?.map((item) => item.data)[0]
                                    const dataPopup: DataPoint[] = []
                                    dataSet.forEach((item, index) => {
                                      const data: DataPoint = item.data.find(
                                        (item) => item.label === items[0]?.label,
                                      )
                                      dataPopup.push(data)
                                    })

                                    const labels = items.map((item) => item.label)[0]
                                    const indexFound = datatoshow
                                      ?.map((item) => item.label)
                                      .findIndex((data) => labels.includes(data))

                                    const warning_count = items?.reduce((pre, sum) => {
                                      return pre + sum?.dataPointText
                                    }, 0)

                                    return (
                                      <PointerItem
                                        dataPopup={dataPopup}
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
  justifyContent: "center",
}
