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

// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface LineDsScreenProps extends AppStackScreenProps<"LineDs"> {}

export const LineDsScreen: FC<LineDsScreenProps> = observer(function LineDsScreen() {
  const data = [
    { label: "Water Line 2", value: "Line 2" },
    { label: "Water Line 3", value: "Line 3" },
    { label: "Water Line 4", value: "Line 4" },
    { label: "Water Line 5", value: "Line 5" },
    { label: "Water Line 6", value: "Line 6" },
  ]
  const machineColors = [
    { label: data[0].value, color: "#071952" },
    { label: data[1].value, color: "#059212" },
    { label: data[2].value, color: "#D10363" },
    { label: data[3].value, color: "#DC5F00" },
    { label: data[4].value, color: "#604CC3" },
  ]
  const { width: maxWidth } = useWindowDimensions()
  const [modalVisible, setModalVisible] = useState(false)
  const [percentages, setPercentages] = useState(-1)
  const [isLoading, setLoading] = useState(false)
  const { dashboardStore } = useStores()
  const [fakeScrollIndicator, setFakeScrollIndicator] = useState(true)

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
      range: 0,
      value: null,
    })
    setSelectionDate({
      start: moment(startdate).format("YYYY-MM-DD") ?? "",
      end: moment(enddate).format("YYYY-MM-DD") ?? "",
    })

    setModalVisible(false)
  }
  const onLineChartData = () => {
    if (dashboard?.length > 0 && selectedMachine.length > 0) {
      let total_warning_count = 0
      let total_normal_count = 0
      let total_pending_count = 0
      let total_warn = 0 

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

      const totalMachines = total_warning_count + total_normal_count + total_pending_count

      const warning_percentages = Math.floor((total_warning_count / totalMachines) * 100)
      const normal_percentage = Math.floor((total_normal_count / totalMachines) * 100)
      const pending_percentages = 100 - (warning_percentages + normal_percentage)
      setPercentages(normal_percentage)

      setPieData([
        { value: total_normal_count, color: "#145da0", text: normal_percentage + "" },

        { value: total_pending_count, color: "#AED8FF", text: pending_percentages + "" },

        { value: total_warning_count, color: "#BF3131", text: warning_percentages + "" },
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
      Record<string, { warning_count: number; pending_count: number; status: string | null }>
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
            pending_count: 0, // Initialize pending count
            status: null,
          }
        }
        warningCountsByDateAndMachine[date][item?.line].warning_count += item.warning_count || 0
        if (item.status === "pending") {
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
        console.log(result.length)

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
                            style={[
                              {
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 10,

                                backgroundColor: selectedMachine.includes(item.value)
                                  ? "#0081F8"
                                  : "white",

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
                        {isLoading && (
                          <View style={styles.loadingStyle}>
                            <Text textAlign={"center"}> {translate("wtpcommon.savingRecord")}...</Text>
                          </View>
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
                                  pointerStripColor: "gray",
                                  pointerStripWidth: 2,
                                  strokeDashArray: [2, 5],
                                  activatePointersDelay: 0,

                                  persistPointer: false,
                                  // barTouchable: true,
                                  resetPointerOnDataChange: true,

                                  pointerColor: "transparent",

                                  radius: 4,

                                  activatePointersOnLongPress: true,

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
                                      <View
                                        style={[
                                          {
                                            backgroundColor: "#EEF5FF",
                                            width: 250,
                                            position: "absolute",
                                            borderRadius: 15,
                                            zIndex: 0,
                                            // alignItems: "start",
                                            paddingHorizontal: 10,
                                            paddingVertical: 10,
                                          },
                                          dashboard?.length === 1
                                            ? { left: 20 }
                                            : indexFound >= dashboard.length - 1
                                            ? { right: 0 }
                                            : { left: 0 },
                                        ]}
                                      >
                                        <Text body1 semibold style={{ marginVertical: 10 }}>
                                          Week of {items[0]?.label}
                                        </Text>
                                        <Text errorColor bold body2 style={{ marginVertical: 10 }}>
                                          Warning State Percentages
                                        </Text>
                                        {items?.map((data, index) => {
                                          const lines = selectColors.find(
                                            (colors) => colors.color === data.textColor,
                                          )
                                          return (
                                            <View key={index?.toString()}>
                                              <View key={index}>
                                                <Text body2>
                                                  <Text errorColor>
                                                    {lines?.label} count {data?.dataPointText}
                                                  </Text>
                                                </Text>
                                              </View>
                                            </View>
                                          )
                                        })}

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
                              {fakeScrollIndicator && (
                                <View
                                  style={{
                                    height: 3.8,
                                    marginLeft: 40,
                                    width: 465,
                                    backgroundColor: "#B4B4B8",
                                    marginTop: 31.5,
                                  }}
                                ></View>
                              )}
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
