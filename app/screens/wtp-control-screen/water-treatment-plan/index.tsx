import React, { FC, useEffect, useLayoutEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import moment from "moment"
import { useTheme } from "app/theme-v2"
import {
  View,
  ViewStyle,
  TouchableOpacity,
  ScrollView,
  FlatList,
  RefreshControl,
} from "react-native"
import { AppStackScreenProps } from "app/navigators"
import styles from "./styles"
import { Divider, Provider } from "react-native-paper"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "app/models"
import { Treatment, WaterTreatment } from "app/models/water-treatment/water-treatment-model"
import HeaderBar from "../../../components/v2/WaterTreatment/HeaderBar"
import TimePanel from "app/components/v2/WaterTreatment/TimePanel"
import Icon from "react-native-vector-icons/FontAwesome"
import MachinePanel from "app/components/v2/WaterTreatment/MachinePanel"
import CustomInput from "app/components/v2/DailyPreWater/CustomInput"
import EmptyFallback from "app/components/EmptyFallback"
import { ALERT_TYPE, Dialog } from "react-native-alert-notification"
import AlertDialog from "app/components/v2/AlertDialog"

interface WaterTreatmentScreenProps extends AppStackScreenProps<"WaterTreatment"> {}

export const WaterTreatmentScreen: FC<WaterTreatmentScreenProps> = observer(
  function WaterTreatmentScreen() {
    const { waterTreatmentStore, authStore } = useStores()
    const [selectProgess, setSelectProgess] = useState(0)
    const [refreshing, setRefreshing] = useState(false)
    const { colors } = useTheme()
    const [wtp2, setWtp2] = useState<WaterTreatment[]>([])
    const [visible, setVisible] = React.useState(false)
    const [schedules, setSchedules] = useState<Treatment[]>()
    const [scheduleSnapshot, setScheduleSnapshot] = useState<Treatment[]>()
    const [isloading, setLoading] = useState(false)
    const [datePicker, setDatePicker] = useState({
      show: false,
      // value: new Date(Date.now()),
      value: null,
    })
    const [sort, setSort] = useState("asc")
    const [query, setQuery] = useState("")
    const [selectedShift, setSelectedShift] = useState("")
    const navigation = useNavigation()

    const [shifts, setShifts] = useState([
      {
        id: 1,
        name: "S1",
        schedules: [
          { time: "7:00", isWarning: false },
          { time: "13:00", isWarning: false },
        ],
      },
      {
        id: 2,
        name: "S2",
        schedules: [
          { time: "18:00", isWarning: false },
          { time: "22:00", isWarning: false },
        ],
      },
    ])

    const handleAssignTask = async () => {
      try {
        console.log(await authStore.getUserInfo())
        const userinfo = await authStore.getUserInfo()
        const { login } = userinfo.data
        const payload = await waterTreatmentStore.assignTask(
          selectedShift,
          login,
          moment(datePicker.value).format("YYYY-MM-DD"),
        )

        console.log("full finished", payload)
      } catch (error) {
        console.log(error.message)
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "បរាជ័យ",
          textBody: "បញ្ហាបច្ចេកទេសនៅលើ server",
          button: "បិទ",
        })
      }

      setVisible(false)
    }

    const onCalculateSchedule = (completed: string, total: string) => {
      if (completed && total) {
        const progress = Number(completed) / Number(total)
        setSelectProgess(progress)
      }
    }
    const hideDialog = () => setVisible(false)

    const renderItem = ({ item }: { item: WaterTreatment }) =>
      schedules?.map((subitem, index) => {
        //Sub Collection of treatmentlist that contain the machines
        return (
          <MachinePanel
            handleAssigntask={() => setVisible(true)}
            key={index.toString()}
            status={subitem?.status ?? "pending"}
            created_date={moment(subitem.createdDate).format("LL")}
            machine_type={subitem?.machine}
            assign_to={item?.assign_to ?? "vorn"}
            warning_count={subitem?.warning_count ?? 0}
            time={item?.shift ?? "S1 (7:00)"}
            onPress={() => {
              navigation.navigate("WaterTreatmentPlant2Form", {
                type: subitem?.machine ?? "",
                items: subitem,
                onReturn: sendBack,
              })
            }}
          />
        )
      })

    const sendBack = () => {
      refresh()
    }
    const refresh = async (showLoading = false) => {
      setRefreshing(true)
      fetchScehdules()
    }

    const fetchTimePanel = async () => {
      const assign_date = moment(datePicker?.value).format("YYYY-MM-DD")
      const times = (await waterTreatmentStore.getWtpByDate(assign_date?.toString() || "")) as []
      const warningTime = []

      for (const item of times) {
        const count = item?.treatmentlist.filter((subitem) => subitem?.warning_count > 0).length

        if (count) {
          warningTime.push(item?.shift)
        }
      }

      const updatedShifts = [
        {
          id: 1,
          name: "S1",
          schedules: [
            { time: "7:00", isWarning: false },
            { time: "13:00", isWarning: false },
          ],
        },
        {
          id: 2,
          name: "S2",
          schedules: [
            { time: "18:00", isWarning: false },
            { time: "22:00", isWarning: false },
          ],
        },
      ].map((shift) => {
        const updatedSchedules = shift.schedules.map((schedule) => {
          const condition = `${shift.name} (${schedule.time})`
          if (warningTime?.includes(condition)) {
            return { ...schedule, isWarning: true }
          }
          return schedule
        })
        return { ...shift, schedules: updatedSchedules }
      })

      setShifts(updatedShifts)
    }
    const fetchScehdules = async () => {
      try {
        setQuery("")
        setSort("asc")
        setLoading(true)

        if (datePicker.value) {
          const assign_date = moment(datePicker?.value).format("YYYY-MM-DD")

          const results = (await waterTreatmentStore.getWtpSchedules(
            assign_date?.toString() || "",
            selectedShift || "",
          )) as []

          setWtp2(results)
          const schedules = results.map((item) => item?.treatmentlist)[0]
          setSchedules(schedules)
          setScheduleSnapshot(schedules)
          const [allprogress] = results.map((item) => item?.treatmentlist) as []

          const selectProgress = allprogress?.filter((item) => item?.status !== null)

          onCalculateSchedule(selectProgress?.length, schedules?.length)

          return
        }
        setWtp2([])
      } catch (error: unknown) {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "បរាជ័យ",
          textBody: "បញ្ហាបច្ចេកទេសនៅលើ server",
          button: "បិទ",
        })
        console.log(error?.message)
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    }

    const onSortItem = () => {
      sort === "asc"
        ? setSchedules((pre) =>
            pre?.sort((a, b) => (a?.machine?.toLowerCase() > b.machine?.toLowerCase() ? 1 : -1)),
          )
        : setSchedules((pre) =>
            pre?.sort((a, b) => (b?.machine?.toLowerCase() > a?.machine?.toLowerCase() ? 1 : -1)),
          )

      sort === "asc" ? setSort("desc") : setSort("asc")
    }

    const onSearchItem = () => {
      const result = schedules?.filter((item) =>
        item.machine?.trim().toLowerCase().includes(query?.trim().toLowerCase()),
      )

      if (!result?.length || query === "") {
        //length = 0 meaning no result, > 0  have result so we set to schedule
        setSchedules(scheduleSnapshot)
      } else {
        setSchedules(result)
      }
    }
    useEffect(() => {
      fetchScehdules()

      if (datePicker.value) {
        fetchTimePanel()
      }
    }, [datePicker.value, selectedShift])
    useEffect(() => {
      onSearchItem()
      return () => setSchedules(scheduleSnapshot)
    }, [query])

    return (
      <Provider>
        <View style={$root}>
          <View style={[$outerContainer]}>
            <View
              style={[
                $containerHorizon,
                {
                  justifyContent: "space-between",
                },
              ]}
            >
              <HeaderBar
                enableWTP={false}
                showLine={false}
                onChangeDate={(e, v) => {
                  setDatePicker((pre) => ({ show: false, value: v }))

                  if (e.type === "set") {
                    setSelectProgess(0)
                    // setShifts([
                    //   {
                    //     id: 1,
                    //     name: "S1",
                    //     schedules: [
                    //       { time: "7:00", isWarning: false },
                    //       { time: "13:00", isWarning: false },
                    //     ],
                    //   },
                    //   {
                    //     id: 2,
                    //     name: "S2",
                    //     schedules: [
                    //       { time: "18:00", isWarning: false },
                    //       { time: "22:00", isWarning: false },
                    //     ],
                    //   },
                    // ])

                    setSelectedShift(`S1 (7:00)`)
                  }
                }}
                onPressdate={() => setDatePicker((pre) => ({ ...pre, show: true }))}
                dateValue={datePicker.value}
                showDate={datePicker.show}
                currDate={new Date(Date.now())}
              />
            </View>

            <Divider style={styles.divider_space} />

            <View
              style={[
                $containerHorizon,
                {
                  gap: 10,
                  // marginBottom: 20,
                  height: "88%",
                  backgroundColor: "#F6F5F5",
                },
              ]}
            >
              <View style={styles.leftPane}>
                <ScrollView scrollEnabled>
                  {shifts?.map((item) => {
                    return item.schedules.map((subitem, index) => {
                      return (
                        <TimePanel
                          isWarning={
                            subitem.isWarning && `${item.name} (${subitem.time})` !== selectedShift
                          }
                          onPress={() => {
                            if (`${item.name} (${subitem.time})` === selectedShift) {
                              return
                            }
                            setSelectProgess(0)
                            setSelectedShift(`${item.name} (${subitem.time})`)
                          }}
                          progressValue={selectProgess ?? 0}
                          time={subitem?.time?.trim()}
                          isSelected={`${item.name} (${subitem.time})` === selectedShift}
                          key={index.toString()}
                        />
                      )
                    })
                  })}
                </ScrollView>
              </View>

              <View style={styles.rightPane}>
                <View
                  style={[
                    $containerHorizon,
                    { justifyContent: "space-between", alignItems: "center" },
                  ]}
                >
                  <View style={{ width: 550, marginBottom: 10 }}>
                    <CustomInput
                      type="search"
                      value={query ?? ""}
                      placeholder="Search"
                      onChangeText={(text: string) => {
                        setQuery(text)
                      }}
                      label=""
                      errormessage={""}
                    />
                  </View>

                  <View>
                    <TouchableOpacity style={styles.sortingIcon} onPress={onSortItem}>
                      <Icon name="sort" size={20} color={"black"} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={$useflex}>
                  <FlatList
                    refreshControl={
                      <RefreshControl
                        colors={[colors.primary]}
                        tintColor={colors.primary}
                        refreshing={isloading ? true : refreshing}
                        onRefresh={() => refresh()}
                      />
                    }
                    style={$useflex}
                    data={wtp2}
                    ListEmptyComponent={<EmptyFallback placeholder="No Schedule yet" />}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={renderItem}
                  />
                </View>
                <AlertDialog
                  visible={visible}
                  hideDialog={hideDialog}
                  onPositive={handleAssignTask}
                  onNegative={() => setVisible(false)}
                />
              </View>
            </View>
          </View>
        </View>
      </Provider>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
  backgroundColor: "white",
}

const $outerContainer: ViewStyle = {
  // margin: 15,
  marginTop: 20,
  padding: 10,
}

export const $containerHorizon: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",

  gap: 0,
}

const $useflex: ViewStyle = {
  flex: 1,
}
