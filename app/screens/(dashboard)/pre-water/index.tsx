import React, { FC, useEffect, useState } from "react"
import { LineChart, PieChart } from "react-native-gifted-charts"
import { Divider } from "react-native-paper"
import { observer } from "mobx-react-lite"
import { View, ViewStyle, useWindowDimensions } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Button, Text } from "app/components/v2"
import styles from "./styles"
import DateRangePicker from "app/components/v2/DateRange"
import { ScrollView } from "react-native-gesture-handler"
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

interface PreWaterDsScreenProps extends AppStackScreenProps<"PreWaterDs"> {}

export const PreWaterDsScreen: FC<PreWaterDsScreenProps> = observer(function PreWaterDsScreen() {
  const [modalVisible, setModalVisible] = useState(false)
  const [selectionDate, setSelectionDate] = useState({
    start: null,
    end: null,
  })

  const data = [
    { label: "Water Treatment Plant 2", value: "Water Treatment Plant 2" },
    { label: "Water Treatment Plant 3", value: "Water Treatment Plant 3" },
    { label: "Water Treatment Plant 4", value: "Water Treatment Plant 4" },
  ]
  const machineColors = [
    { label: data[0].label, color: "#40A2E3" },
    { label: data[1].label, color: "#059212" },
    { label: data[2].label, color: "#D10363" },
  ]
 
  const { width: maxWidth } = useWindowDimensions()
  const { dashboardStore } = useStores()
  const [dashboard, setDashboard] = useState([])
  const [selectedMachine, setSelectedMachine] = useState<string[]>([])
  const [selectColors, setSelectColors] = useState<{ label: string; color: string }[]>([])
  const [dataSet, setDataSet] = useState<DataSetProps[]>([])
  const [pieData, setPieData] = useState([
    { value: 10, color: "#EEEEEE", text: "0%" },

    { value: 30, color: "#EEEEEE", text: "0%" },

    { value: 10, color: "#EEEEEE", text: "0%" },
  ])
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
    value: null,
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
  const onComfirmDate = (startDate: string, endDate: string) => {
    const [day, month, year] = startDate.split("/")
    const [eday, emonth, eyear] = endDate.split("/")

    // Create a Date object
    const startdate = new Date(year, month - 1, day)
    const enddate = new Date(eyear, emonth - 1, eday)
    setSelectDate({
      range: 0,
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

          total_warning_count += warningCount
          total_normal_count += warningCount <= 0 ? 1 : 0
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

      const warning_percentages = Math.floor((total_warning_count / totalMachines) * 100)
      const normal_percentage = Math.floor((total_normal_count / totalMachines) * 100)
      const pending_percentages = 100 - (warning_percentages + normal_percentage)
      setPercentages(normal_percentage)

      setPieData([
        { value: total_normal_count, color: "#145da0", text: normal_percentage },
        { value: total_pending_count, color: "#0e86d4", text: pending_percentages },
        { value: total_warning_count, color: "#BF3131", text: warning_percentages },
      ])

      const allColors = newDatasets.map((item) => item.color)

      console.log("   map color",allColors)
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
            pending_count: 0, // Initialize pending count
            status: null,
          }
        }
        warningCountsByDateAndMachine[date][entry.pre_treatment_type].warning_count +=
          item.warning_count || 0
        if (item.status === "pending") {
          warningCountsByDateAndMachine[date][entry.pre_treatment_type].pending_count += 1 // Increment pending count if status is pending
        }
        warningCountsByDateAndMachine[date][entry.pre_treatment_type].status = item.status // Add status
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
    if (selectedMachine?.length == 0) {
      clearMachineEmpty()

      return
    }
    selectionDate?.end && selectionDate?.start
      ? fetchChart("range")
      : selectedMachine?.length > 0 && selectDate.value != null && fetchChart("period")
  }, [selectedMachine, selectDate, selectionDate])


  console.log('selected color is',selectColors)
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
            <View style={styles.row1}>
              <View style={[styles.activityLineChart]}>
                <Text semibold body1>
                  <Text errorColor>* </Text> Select Machine
                </Text>
                {selectedMachine?.length > 4 && (
                  <Text errorColor>( Maximum 5 water treatment machines )</Text>
                )}
                <FlatList
                  horizontal
                  renderItem={({ item, index }) => {
                    return (
                      <TouchableOpacity
                        // disabled={selectedMachine?.length >= 4}
                        onPress={() => {
                          if (selectedMachine?.length >= 5) {
                            if (selectedMachine.includes(item.value)) {
                              setSelectedMachine((pre) =>
                                pre.filter((machine) => machine !== item.value),
                              )
                              return
                            }
                          } else {
                            if (selectedMachine.includes(item.value)) {
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

                <View style={[$horiContainer, { marginTop: 15, justifyContent: "space-between" }]}>
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
                      style={[styles.dateAgo, selectionDate?.end && { backgroundColor: "#0081F8" }]}
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

                <View style={{ marginTop: 10 }}>
                  <FlatList
                    horizontal
                    data={selectColors}
                    contentContainerStyle={{ gap: 25 }}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <View style={$horiContainer}>
                        <BadgeChart  bgColor={item.color} title=" " />
                        <Text>{item.label}</Text>
                      </View>
                    )}
                  />
                </View>
                <View
                  style={[
                    { paddingHorizontal: 0, paddingBottom: 35, overflow: "visible" },
                    $horiContainer,
                  ]}
                >
                  <View style={{ marginBottom: 0, flex: 1, zIndex: 0 }}>
                    {isLoading && (
                      <View style={styles.loadingStyle}>
                        <Text textAlign={"center"}> Loading data ...</Text>
                      </View>
                    )}
                    {dataSet && dataSet.length > 0 && (
                      <LineChart
                        overflowTop={15}
                        overflowBottom={30}
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
                        width={maxWidth * 0.65}
                        maxValue={10}
                        noOfSections={4}
                        isAnimated={true}
                        rulesType="solid"
                        endOpacity={0.1}
                        spacing={maxWidth / 5}
                        endSpacing={55}
                        indicatorColor="black"
                        showScrollIndicator={true}
                        initialSpacing={40}
                        dataPointsHeight={10}
                        dataPointsWidth={10}
                        color="blue"
                        textShiftY={-3}
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
                          pointerLabelComponent: (items: any[]) => {
                            const datatoshow = dataSet?.map((item) => item.data)[0]
                            const indexFound = datatoshow?.findIndex(
                              (item) => item.value === items[0]?.value,
                            )

                            const warning_count = items?.reduce((pre, sum) => {
                              return pre + sum?.value
                            }, 0)

                            return (
                              <View
                                style={[
                                  {
                                    zIndex: 1000,
                                    backgroundColor: "#EEF5FF",
                                    width: 300,
                                    position: "absolute",
                                    borderRadius: 15,
                                    // alignItems: "start",
                                    paddingHorizontal: 10,
                                    paddingVertical: 10,
                                  },

                                  indexFound <= 2 ? { left: 0 } : { right: 0 },
                                ]}
                              >
                                <Text body1 semibold style={{ marginVertical: 10 }}>
                                  Week of {items[0]?.label}
                                </Text>
                                <Text errorColor bold body2 style={{ marginVertical: 10 }}>
                                  Warning State Percentages
                                </Text>
                                {items?.map((data, index) => (
                                  <View key={index?.toString()}>
                                    <View key={index}>
                                      <Text body2 errorColor>
                                        {selectColors[index]?.label} : {data?.value}{" "}
                                      </Text>
                                    </View>
                                  </View>
                                ))}

                                <Divider style={{ marginVertical: 15 }} />

                                <Text
                                  body2
                                  regular
                                  semibold
                                  style={{ marginVertical: 10 }}
                                  errorColor
                                >
                                  Total Warning Count : {warning_count}
                                </Text>
                              </View>
                            )
                          },
                        }}
                      ></LineChart>
                    )}

                    {dataSet.length === 0 && <EmptyLineChart />}
                  </View>
                  <PerformanceChart
                    pieData={pieData}
                    isloading={!isLoading}
                    popupData={popupData}
                    percentages={percentages}
                    setPopupdata={setPopupdata}
                    setShowPopup={setShowPopup}
                    showPopup={showPopup}
                    machineLength={selectedMachine?.length}
                  />
                </View>
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
