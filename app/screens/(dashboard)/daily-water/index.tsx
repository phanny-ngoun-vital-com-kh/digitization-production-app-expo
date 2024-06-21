import React, { useEffect, useState } from "react"
import { LineChart, PieChart } from "react-native-gifted-charts"
import { Badge, Divider, Portal, Provider } from "react-native-paper"
import { observer } from "mobx-react-lite"
import {
  FlatList,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
  useWindowDimensions,
} from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Button, Text } from "app/components/v2"
import styles from "./styles"
import BadgeChart from "app/components/v2/Chart/BadgeChart"
import DateRangePicker from "app/components/v2/DateRange"
import { ScrollView } from "react-native-gesture-handler"
import { DataSetProps } from "./type"
import EmptyLineChart from "app/components/v2/Dashboard/EmptyLineChart"
import { TouchableOpacity } from "react-native"
import { useStores } from "app/models"
import { ALERT_TYPE, Dialog } from "react-native-alert-notification"
import moment from "moment"
import PieChartAlert from "app/components/v2/Dashboard/PieChartAlert"
interface DailyDsScreenProps extends AppStackScreenProps<"DailyDs"> {}

export const DailyDsScreen: React.FC<DailyDsScreenProps> = observer(function DailyDsScreen() {
  const { width: maxWidth } = useWindowDimensions()
  const machineColors = [
    { label: "Raw Water Stock", color: "#11009E" },
    { label: "Sand Filter", color: "#059212" },
    { label: "Carbon Filter", color: "#D10363" },
    { label: "Resin Filter", color: "#FF9800" },
    { label: "MicroFilter 5 Mm", color: "#604CC3" },
    { label: "MicroFilter 1Mm", color: "#40A2E3" },
    { label: "Reverses Osmosis", color: "#AF6B58" },
  ]
  const [isLoading, setLoading] = useState(false)
  const { dashboardStore } = useStores()
  const [modalVisible, setModalVisible] = useState(false)
  const [selectionDate, setSelectionDate] = useState({
    start: null,
    end: null,
  })
  const [percentages, setPercentages] = useState(0)
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

  const [selectedMachine, setSelectedMachine] = useState<string[]>([])
  const [selectColors, setSelectColors] = useState<{ label: string; color: string }[]>([])
  const [dataSet, setDataSet] = useState<DataSetProps[]>([])
  const [showPopup, setShowPopup] = useState(false)
  const [popupData, setPopupdata] = useState({
    percentages: "",
    label: "",
    total:""
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
    { value: 10, color: "#EEEEEE", text: "0%" },

    { value: 30, color: "#EEEEEE", text: "0%" },

    { value: 10, color: "#EEEEEE", text: "0%" },
  ])
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

    setSelectionDate({
      start: moment(startdate).format("YYYY-MM-DD") ?? "",
      end: moment(enddate).format("YYYY-MM-DD") ?? "",
    })
    setModalVisible(false)
  }
  const onSelectRangeDate = (inDay: number) => {
    setSelectDate(() => {
      const today = new Date(Date.now())
      return {
        range: inDay,
        value: new Date(today.getFullYear(), today.getMonth(), today.getDate() - inDay),
      }
    })
    setSelectionDate({
      end: null,
      start: null,
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

  const getStatusPerformance = (percentages: number): { color: string; label: string } => {
    if (percentages === -1) {
      return { color: "#145da0", label: "" }
    }
    if (percentages < 30) {
      return { color: "#BF3131", label: "Danger" }
    } else if (percentages < 50) {
      return { color: "#BF3131", label: "Warning" }
    } else if (percentages < 70) {
      return { color: "orange", label: "Normal" }
    } else if (percentages < 90) {
      return { color: "#0e86d4", label: "Excellent" }
    } else if (percentages <= 100) {
      return { color: "#145da0", label: "Perfect" }
    }
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
              // console.log("Status is ",item.status)
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
            dataPointText: warningCount.toString(),
            customDataPoint: () => customDataPoint(machineColor),
            textColor: machineColor,
            dataPointColor: machineColor,
          }
        })

        const color = machineColors.find((item) => item.label === machine)?.color || "#ccc"
        // console.log("total machines", temporary?.length)

        return {
          data: temporary,
          color: color,
        }
      })

      setDataSet(newDatasets)

      const totalMachines = total_warning_count + total_normal_count + total_pending_count

      setPercentages(100 - Math.floor((total_warning_count / totalMachines) * 100))
      const normal_percentage = 100 - Math.floor((total_normal_count / totalMachines) * 100)
      const warning_percentages = 100 - normal_percentage
      const pending_percentages = 100 - Math.floor((total_pending_count / totalMachines) * 100)

      setPieData([
        { value: total_normal_count, color: "#145da0", text: normal_percentage + "" },

        { value: total_pending_count, color: "#0e86d4", text: warning_percentages + "" },

        { value: total_warning_count, color: "#BF3131", text: pending_percentages + "" },
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
      // setPieData([
      //   { value: 0, color: "#EEEEEE", text: "0" },

      //   { value: 0, color: "#EEEEEE", text: "0" },

      //   { value: 0, color: "#EEEEEE", text: "0" },
      // ])
      setSelectColors([])
    }
  }
  useEffect(() => {
    onLineChartData()
  }, [dashboard, selectedMachine])

  useEffect(() => {
    selectionDate?.end && selectionDate?.start
      ? fetchChart("range")
      : selectedMachine?.length > 0 && selectDate.value != null && fetchChart("period")
  }, [selectedMachine, selectDate, selectionDate])

  console.log("Data set is ", dataSet.length)
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

                    <View
                      style={[$horiContainer, { marginTop: 15, justifyContent: "space-between" }]}
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

                    <View style={{ marginTop: 10 }}>
                      <FlatList
                        horizontal
                        data={selectColors}
                        contentContainerStyle={{ gap: 25 }}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                          <View style={$horiContainer}>
                            <BadgeChart bgColor={item.color} title=" " />
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
                            <Text textAlign={"center"}> Loading...</Text>
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
                      <View style={[styles.activityPieChart]}>
                        <Text semibold body1 textAlign={"center"}>
                          Performance Statistic
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
                              innerRadius={70}
                              showText={selectedMachine?.length > 0 ? true : false}
                              textBackgroundColor="#EEEEEE"
                              textColor="black"
                              centerLabelComponent={() => {
                                const { color, label } = getStatusPerformance(percentages)
                                return (
                                  <View style={{ alignItems: "center" }}>
                                    <Text style={{ color: color, fontSize: 22 }} semibold>
                                      {percentages < 0 ? 0 : percentages} %
                                    </Text>

                                    <Text style={{ color: color, fontSize: 18 }}>{label}</Text>
                                  </View>
                                )
                              }}
                              onLabelPress={(item, index) => {
                                console.log("press label")
                                setShowPopup(true)
                                setPopupdata({
                                  total:selectedMachine?.length + "",
                                  
                                  percentages: item?.text,
                                  label: item?.value,
                                })


                              }}
                              onPress={(item, index) => {
                                // console.log("press panel")

                                // setShowPopup(true)
                                // setPopupdata({
                                //   percentages: item?.text,
                                //   label: item?.value,
                                // })
                              }}
                              radius={130}
                              textSize={16}
                              // focusOnPress

                              showValuesAsLabels
                              showTextBackground
                              textBackgroundRadius={20}
                            />
                          </View>

                          <View style={[$horiContainer, { justifyContent: "center" }]}>
                            <BadgeChart title="Normal" bgColor="#145da0" />
                            <BadgeChart title="Pending" bgColor="#0e86d4" />
                            <BadgeChart title="Warning" bgColor="#BF3131" />
                          </View>
                          <PieChartAlert visible={showPopup}  onClose={() => setShowPopup(false)} data={popupData} />
                        </View>
                      </View>
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
          </View>
        </TouchableWithoutFeedback>
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
  justifyContent: "center",
}
