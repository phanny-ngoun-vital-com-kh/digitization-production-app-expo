import React, { useEffect, useState } from "react"
import { LineChart, PieChart } from "react-native-gifted-charts"
import { Badge, Divider, Portal, Provider } from "react-native-paper"
import { observer } from "mobx-react-lite"
import { FlatList, View, ViewStyle, useWindowDimensions } from "react-native"
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
import { Treatment, WaterTreatment } from "app/models/water-treatment/water-treatment-model"
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
    start: "",
    end: "",
  })
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

  const [dashboard, setDashboard] = useState<
    { machine: string; warning_count: number; createdDate: string }[]
  >([])
  const pieData = [
    { value: 54, color: "#177AD5" },

    { value: 40, color: "#79D2DE" },

    { value: 20, color: "#ED6665" },
  ]
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
    setSelectionDate({
      start: startDate,
      end: endDate,
    })
    setModalVisible(false)
  }
  const onSelectRangeDate = (inDay: number) =>
    setSelectDate(() => {
      const today = new Date(Date.now())
      return {
        range: inDay,
        value: new Date(today.getFullYear(), today.getMonth(), today.getDate() - inDay),
      }
    })
  function getSpecificMachineData(
    data: { createdDate: string; data: Treatment[] }[],
    machineName: string,
  ) {
    const filteredData = data.filter((treatment) =>
      treatment.data.some((machine) => machine.machine === machineName),
    )

    const mappedData = filteredData.map((item) => ({
      createdDate: item?.createdDate,
      machineData: item?.data?.find((treatment) => treatment.machine === machineName),
    }))

    return mappedData.filter((item) => item !== undefined)
  }
  const label = ["Mon", "Tues", "Wed", "Thu", "Fri", "Sat", "Sun"]

  const fetchChart = async (type: "range" | "period" = "period") => {
    try {
      setLoading(true)
      if (type === "period") {
        const result = await dashboardStore.getWtp("day", selectDate.range?.toString())
        console.log("raw", result?.length)
        const allTreatments = result?.map((item) => {
          return { createdDate: item?.createdDate, data: item?.treatmentlist }
        })
        // console.log("filterout", allTreatments)
        const specificMachineData = getSpecificMachineData(allTreatments, "Raw Water Stock")

        // console.log("Specific data", specificMachineData) // Array of objects with treatmentId and machine data

        const data: { machine: string; warning_count: number; createdDate: string }[] =
          specificMachineData?.map((item) => {
            return {
              machine: item?.machineData?.machine,
              createdDate: item?.createdDate,
              warning_count: item?.machineData?.warning_count ?? 0,
            }
          })

        setDashboard(data)
      } else {
        const result = await dashboardStore?.getWtp("day", selectDate.range?.toString())

        // setDashboard(result)
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

  useEffect(() => {
    console.log(selectDate)
    if (selectDate) {
      fetchChart("period")
    }
  }, [selectDate])
  // console.log("render")
  useEffect(() => {
    // console.log("effect run")
    if (selectedMachine.length > 0) {
      // const newDatasets: DataSetProps[] = []
      // selectedMachine?.forEach((machine, index) => {
      //   const temporary = []

      //   for (let i = 0; i < 7; i++) {
      //     const randomValue = Math.floor(Math.random() * 100)
      //     temporary.push({
      //       value: randomValue,
      //       dataPointText: randomValue.toString(),
      //       label: label[i],

      //       customDataPoint: () =>
      //         customDataPoint(machineColors.find((item) => item?.label.startsWith(machine))?.color),

      //       textColor: machineColors.find((item) => item?.label.startsWith(machine))?.color,
      //       dataPointColor: machineColors.find((item) => item?.label.startsWith(machine))?.color,
      //     })
      //   }
      //   newDatasets.push({
      //     data: temporary,

      //     color: machineColors.find((item) => item?.label.startsWith(machine))?.color,
      //   })
      // })
      setDataSet(newDatasets)
      const allColors = newDatasets.map((item) => item.color)
      const resultColor = machineColors.filter((item) => allColors.includes(item.color))
      setSelectColors(resultColor)
    } else {
      setDataSet([])
      setSelectColors([])
    }
  }, [selectedMachine])
  console.log("result is ", dashboard)
  return (
    <Provider>
      <Portal>
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
                  <Divider />
                  <View style={{ marginTop: 50 }}>
                    <FlatList
                      horizontal
                      data={selectColors}
                      contentContainerStyle={{ gap: 25 }}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item }) => (
                        <View style={$horiContainer}>
                          <Badge
                            style={{ backgroundColor: item.color, textAlign: "center" }}
                          ></Badge>
                          <Text>{item.label}</Text>
                        </View>
                      )}
                    />
                  </View>
                  <View
                    style={[
                      { paddingHorizontal: 0, paddingVertical: 15, overflow: "visible" },
                      $horiContainer,
                    ]}
                  >
                    <View style={{ marginVertical: 0, flex: 1, zIndex: 0 }}>
                      {dataSet && dataSet.length > 0 && (
                        <LineChart
                          overflowTop={25}
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
                          // height={400}
                          // width={maxWidth * 1}
                          width={maxWidth * 0.65}
                          maxValue={100}
                          isAnimated
                          noOfSections={5}
                          yAxisLabelSuffix="%"
                          rulesType="solid"
                          animateOnDataChange
                          animationDuration={1000}
                          // yAxisThickness={2}
                          // xAxisThickness={2}
                          endOpacity={0.1}
                          spacing={maxWidth / 10}
                          indicatorColor="black"
                          // maxValue={100}
                          scrollAnimation
                          showScrollIndicator={true}
                          // maxValue={100}
                          initialSpacing={20}
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
                          height={350}
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
                                    Week of Jan 23 - Jan 29
                                  </Text>
                                  <Text errorColor bold body2 style={{ marginVertical: 10 }}>
                                    Warning State Percentages
                                  </Text>
                                  {dataSet.map((item, index) => (
                                    <View key={index}>
                                      <Text body2 errorColor>
                                        {selectColors[index]?.label} {item?.data[indexFound]?.value}{" "}
                                        %
                                      </Text>
                                    </View>
                                  ))}
                                  <Divider style={{ marginVertical: 15 }} />
                                  <Text body2 regular style={{ marginVertical: 10 }} errorColor>
                                    Total Warning Count
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
                            showText
                            textColor="black"
                            radius={100}
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
                    </View>
                  </View>
                </View>
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
