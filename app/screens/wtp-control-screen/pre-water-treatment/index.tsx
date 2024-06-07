/* eslint-disable camelcase */
import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { useTheme } from "app/theme-v2"
import moment from "moment"
import {
  View,
  ViewStyle,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  FlatList,
  TextStyle,
} from "react-native"
import { AppStackScreenProps } from "app/navigators"
import styles from "./styles"
import { Divider, Provider } from "react-native-paper"
import HeaderBar from "../../../components/v2/WaterTreatment/HeaderBar"
import TimePanel from "app/components/v2/WaterTreatment/TimePanel"
import Icon from "react-native-vector-icons/FontAwesome"
import MachinePanel from "app/components/v2/WaterTreatment/MachinePanel"
import CustomInput from "app/components/v2/DailyPreWater/CustomInput"
import { useNavigation } from "@react-navigation/native"
import { ALERT_TYPE, Dialog } from "react-native-alert-notification"
import EmptyFallback from "app/components/EmptyFallback"
import { PreWaterTreatment } from "app/models/pre-water-treatment/pre-water-treatment-model"
import { useStores } from "app/models"
import { getCurrentTime } from "app/utils-v2/getCurrTime"
import AlertDialog from "app/components/v2/AlertDialog"
import { prewaterTreatmentApi } from "app/services/api/pre-water-treatment-api"

interface PrewaterTreatmentScreenProps extends AppStackScreenProps<"PrewaterTreatment"> {}

export const PrewaterTreatmentScreen: FC<PrewaterTreatmentScreenProps> = observer(
  function PrewaterTreatmentScreen() {
    const navigation = useNavigation()
    const { preWaterTreatmentStore, authStore } = useStores()
    const [schedules, setSchedules] = useState([
      { time: "7:00", isWarning: false, pre_treatment_id: "" },
      { time: "11:00", isWarning: false, pre_treatment_id: "" },
      { time: "15:00", isWarning: false, pre_treatment_id: "" },
      { time: "19:00", isWarning: false, pre_treatment_id: "" },
      { time: "23:00", isWarning: false, pre_treatment_id: "" },
      { time: "3:00", isWarning: false, pre_treatment_id: "" },
    ])
    const [isloading, setLoading] = useState(false)
    const [wtp, setWtp] = useState<PreWaterTreatment[] | null>([])
    const [datePicker, setDatePicker] = useState({
      show: false,
      value: new Date(Date.now()),
    })
    const [visible, setVisible] = React.useState(false)
    const [taskAssignto, setTaskAssignTo] = useState("")
    const [sort, setSort] = useState("asc")
    const [query, setQuery] = useState("")
    const [selectProgess, setSelectProgess] = useState(0)
    const [selectTime, setSelectTime] = useState<PreWaterTreatment[] | null>([])
    const [machineSnapshot, setMachineSnapshot] = useState<PreWaterTreatment[] | null>([])
    const { colors } = useTheme()
    const [selectedShift, setSelectedShift] = useState({
      item: "",
      index: 0,
      pre_treatment_id: "",
    })
    const [selectedWTP, setSelectedWTP] = useState({
      name: "",
      value: "",
    })
    const [assignUser, setAssignUser] = useState<{
      id: number | null
      assign_to_user: string
      currUser?: string | null
      pretreatment_type?: string | null
      treatment_id: string | null
    }>({
      assign_to_user: "",
      id: null,
      currUser: "",
    })
    const getCurrentSchedule = (schedules: any[], currTime: string) => {
      const currentTime = currTime
      // Convert currentTime to minutes
      const [currentHour, currentMinute] = currentTime.split(":").map(Number)
      const currentTimeInMinutes = currentHour * 60 + currentMinute

      // Sort schedules by time in minutes (assuming schedules are already sorted)
      const sortedSchedules = schedules.map((schedule) => {
        const [hour, minute] = schedule.time.split(":").map(Number)
        const timeInMinutes = hour * 60 + minute
        return { ...schedule, timeInMinutes }
      })

      // Find the latest schedule that hasn't passed yet
      let latestSchedule = null
      for (let i = 0; i < sortedSchedules.length; i++) {
        const schedule = sortedSchedules[i]
        if (schedule.timeInMinutes <= currentTimeInMinutes) {
          latestSchedule = schedule
        } else {
          break
        }
      }

      // Return the latest schedule or the last schedule if none found
      return latestSchedule || sortedSchedules[schedules.length - 1]
    }
    const getCurrentUserName = async () => {
      const userinfo = await authStore.getUserInfo()
      const { login } = userinfo.data
      setAssignUser((pre) => ({ ...pre, currUser: login }))
    }
    const onSendback = () => {
      setSchedules([
        { time: "7:00", isWarning: false, pre_treatment_id: "" },
        { time: "11:00", isWarning: false, pre_treatment_id: "" },
        { time: "15:00", isWarning: false, pre_treatment_id: "" },
        { time: "19:00", isWarning: false, pre_treatment_id: "" },
        { time: "23:00", isWarning: false, pre_treatment_id: "" },
        { time: "3:00", isWarning: false, pre_treatment_id: "" },
      ])
      setSelectedShift((pre) => ({ ...pre }))
      fetchWtp()
    }
    const onCalculateSchedule = (completed: string, total: string) => {
      if (completed && total) {
        const progress = Number(completed) / Number(total)
        setSelectProgess(progress)
      }
    }
    const handleAssignTask = async () => {
      try {
        setVisible(false)
        await prewaterTreatmentApi.saveAssign({
          id: assignUser?.id?.toString() || "",
          action: taskAssignto.split(" ").includes(assignUser?.currUser ?? "")
            ? "has remove the assignment from this machine "
            : "has self assign this machine",
          pre_treatment_type: assignUser?.pretreatment_type ?? "",
          pre_treatment_id: assignUser?.treatment_id,
        })
        refetchAssign()
      } catch (error) {
        console.log(error.message)
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "បរាជ័យ",
          textBody: "បញ្ហាបច្ចេកទេសនៅលើ server",
          button: "បិទ",
        })
      }
    }
    const renderItem = ({ item }: { item: PreWaterTreatment }) => {
      return (
        <FlatList
          ListEmptyComponent={<EmptyFallback placeholder="No Task for this schedule !!!" />}
          showsVerticalScrollIndicator
          persistentScrollbar
          data={item?.pretreatmentlist || []}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item: subitem }) => {
            return (
              <MachinePanel
                warning_count={subitem.warning_count}
                status={subitem?.status}
                handleAssigntask={(id: number, assign_to_user: string) => {
                  setVisible(true)
                  setTaskAssignTo(assign_to_user)
                  setAssignUser((pre) => ({
                    ...pre,
                    id,
                    treatment_id: item?.pre_treatment_id ?? "",
                    pretreatment_type: item?.pre_treatment_type,
                  }))
                }}
                created_date={moment(item.assign_date).format("LL")}
                machine_type={subitem?.control}
                id={subitem.id}
                currUser={assignUser?.currUser}
                assign_to_user={subitem.assign_to_user ?? ""}
                assign_to={item.assign_to}
                time={item.time}
                onPress={() => {
                  setLoading(false)
                  navigation.navigate(
                    item?.pre_treatment_type?.toString() == "Water Treatment Plant 2" ||
                      item?.pre_treatment_type.toString() == "Water Treatment Plant 3"
                      ? "PreWaterForm1"
                      : "PreWaterForm2",
                    {
                      type: subitem?.control,
                      onBack: onSendback,

                      item: {
                        ...subitem,
                        pre_treatment_type: item?.pre_treatment_type,
                        pre_treatment_id: item?.pre_treatment_id,
                      },
                    },
                  )
                }}
              />
            )
          }}
        />
      )
    }
    const refresh = (showLoading = false) => {
      fetchWtp()
    }

    const refetchAssign = async () => {
      try {
        setLoading(true)

        const result = await preWaterTreatmentStore.getListPreTreatment(
          datePicker.value ?? "",
          selectedWTP?.name,
        )

        const sortedResult = result?.sort((a, b) => (a.id > b.id ? 1 : -1))

        fetchWtpbyTime(
          selectedShift.item,
          sortedResult[selectedShift.index]?.pre_treatment_id,
          result[selectedShift.index]?.pre_treatment_type,
        )

        const foundwarning = []

        for (const item of sortedResult) {
          const count = item.pretreatmentlist.filter((subitem) => {
            return subitem?.warning_count > 0
          }).length
          if (count) {
            foundwarning.push(item?.time)
          }
        }

        const indexFound = schedules.findIndex((s) => foundwarning?.includes(s.time))
        const times = sortedResult.map((item) => item?.time)
        const pre_types = sortedResult.map((item) => item?.pre_treatment_id) as []

        if (indexFound >= 0) {
          setSchedules((pre) => {
            return pre.map((item, index) => {
              if (index === indexFound) {
                item.isWarning = true
              }

              if (times.includes(item.time)) {
                const foundIndex = times.findIndex((subitem) => subitem === item.time)

                item.pre_treatment_id = pre_types[foundIndex]
              }
              return item
            })
          })
        } else {
          setSchedules((pre) => {
            return pre.map((item, index) => {
              if (times.includes(item.time)) {
                const foundIndex = times.findIndex((subitem) => subitem === item.time)

                item.pre_treatment_id = pre_types[foundIndex]
              }
              return item
            })
          })
        }
        setWtp(sortedResult)
        // setSchedule(pre=>())
      } catch (error: unknown) {
        console.log(error.message)
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "បរាជ័យ",
          textBody: "បញ្ហាបច្ចេកទេសនៅលើ server",
          button: "បិទ",
        })
      } finally {
        setLoading(false)
      }
    }

    // console.log("Select time",selectTime)

    const fetchWtp = async () => {
      try {
        getCurrentUserName()
        setQuery("")
        setSort("asc")
        setLoading(true)

        const result = await preWaterTreatmentStore.getListPreTreatment(
          datePicker.value ?? "",
          selectedWTP?.name,
        )

        if (result?.length > 0) {
          setSelectedShift((pre) => ({ ...pre }))
          // setLoading(false)
        } else {
          setSelectedShift((pre) => ({ ...pre }))
          setLoading(false)

          return
        }
        const sortedResult = result?.sort((a, b) => (a.id > b.id ? 1 : -1))
        fetchWtpbyTime("7:00", sortedResult[0]?.pre_treatment_id, result[0]?.pre_treatment_type)

        const foundwarning = []

        for (const item of sortedResult) {
          const count = item.pretreatmentlist.filter((subitem) => {
            return subitem?.warning_count > 0
          }).length
          if (count) {
            foundwarning.push(item?.time)
          }
        }

        const indexFound = schedules.findIndex((s) => foundwarning?.includes(s.time))
        const times = sortedResult.map((item) => item?.time)
        const pre_types = sortedResult.map((item) => item?.pre_treatment_id) as []

        if (indexFound >= 0) {
          setSchedules((pre) => {
            return pre.map((item, index) => {
              if (index === indexFound) {
                item.isWarning = true
              }

              if (times.includes(item.time)) {
                const foundIndex = times.findIndex((subitem) => subitem === item.time)

                item.pre_treatment_id = pre_types[foundIndex]
              }
              return item
            })
          })
        } else {
          setSchedules((pre) => {
            return pre.map((item, index) => {
              if (times.includes(item.time)) {
                const foundIndex = times.findIndex((subitem) => subitem === item.time)

                item.pre_treatment_id = pre_types[foundIndex]
              }
              return item
            })
          })
        }
        setWtp(sortedResult)
        // setSchedule(pre=>())
      } catch (error: unknown) {
        console.log(error.message)
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "បរាជ័យ",
          textBody: "បញ្ហាបច្ចេកទេសនៅលើ server",
          button: "បិទ",
        })
      } finally {
        // setLoading(false)
      }
    }

    const onSortItem = () => {
      sort === "asc" ? setSort("desc") : setSort("asc")
      if (selectTime?.length) {
        setSelectTime((pre) => {
          return pre?.map((item) => {
            return {
              ...item,
              pretreatmentlist: item?.pretreatmentlist?.sort((a, b) => {
                if (sort === "asc") {
                  return a?.control?.toLowerCase() < b.control.toLowerCase() ? 1 : -1
                }
                if (sort === "desc") {
                  return a?.control?.toLowerCase() > b.control.toLowerCase() ? 1 : -1
                }
              }),
            }
          })
        })
      }
    }

    const fetchWtpbyTime = async (
      time: string,
      pre_treatment_id: string,
      pre_treatment_type: string,
    ) => {
      try {
        // setLoading(true)
        const result = await preWaterTreatmentStore.getSelectedPretreatment(
          time,
          pre_treatment_id,
          pre_treatment_type,
        )
        console.log(result)
        const [allprogress] = result?.map((item) => item?.pretreatmentlist) as []
        const selectProgress = allprogress?.filter((item) => item?.status !== "pending")
        const pretreatmentlist = result?.map((item) => item?.pretreatmentlist)[0]
        onCalculateSchedule(selectProgress?.length, pretreatmentlist?.length)
        console.log(result?.length)
        // setWtp(result
        setSelectTime(result)
        setMachineSnapshot(result)
      } catch (error: any) {
        console.log(error?.message)
      } finally {
        setLoading(false)
      }
    }
    const hideDialog = () => setVisible(false)

    useEffect(() => {

   
      if (selectedWTP.value) {
        const result = getCurrentSchedule(schedules, getCurrentTime())
        const Foundindex = schedules.findIndex((item) => item.time === result?.time)

        setSelectedShift((pre) => ({ ...pre, item: "7:00", index: 0 }))
        setSchedules([
          { time: "7:00", isWarning: false, pre_treatment_id: "" },
          { time: "11:00", isWarning: false, pre_treatment_id: "" },
          { time: "15:00", isWarning: false, pre_treatment_id: "" },
          { time: "19:00", isWarning: false, pre_treatment_id: "" },
          { time: "23:00", isWarning: false, pre_treatment_id: "" },
          { time: "3:00", isWarning: false, pre_treatment_id: "" },
        ]) //
        setSelectProgess(0)
        if (wtp?.length) {
          setSelectedShift({
            index: 0,
            item: "7:00",
            pre_treatment_id: "",
          })
        }
        fetchWtp()
      }

      return () => {
        setWtp([]) 
        // setSelectTime([])
        // setLoading(false)
      }
    }, [datePicker.value, selectedWTP])

    useEffect(() => {

      if (wtp?.length) {
        fetchWtpbyTime(
          selectedShift.item,
          selectedShift.pre_treatment_id,
          wtp[0]?.pre_treatment_type,
        )
        // setLoading(false)
      } else {
        setSelectTime([])
      }

      // return () => setSelectTime((pre) => pre)
    }, [selectedShift])

    useEffect(() => {

      if (!wtp?.length) {
        return
      }

      const resultSnapshot = machineSnapshot?.slice()

      const machineLists = resultSnapshot?.map((item) => item.pretreatmentlist)[0]
      const result = machineLists?.filter((item) => item.control?.includes(query.trim()))

      setSelectTime(
        resultSnapshot?.map((item) => ({
          ...item,
          pretreatmentlist: result,
        })),
      )

      return () =>
        setSelectTime((pre) => {
          return pre?.map((item) => {
            return {
              ...item,
              pretreatmentlist: machineSnapshot,
            }
          })
        })
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
                enableWTP={true}
                showLine={false}
                onChangeDate={(e, v) => {
                  setDatePicker((pre) => ({ show: false, value: v }))
                  if (e.type === "set") {
                    setSelectProgess(0)
                  }
                }}
                selectedWtp={selectedWTP}
                onSelectWtp={(item) => setSelectedWTP(item)}
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
                  marginTop: 0,
                  marginBottom: 15,
                  flex: 1,
                  backgroundColor: "#F5F5F5",
                },
              ]}
            >
              <View style={styles.leftPane}>
                <ScrollView scrollEnabled showsVerticalScrollIndicator persistentScrollbar>
                  {schedules?.map((item, index) => (
                    <TimePanel
                      onPress={() => {
                        setSelectedShift({
                          item: item.time,
                          index: index.toString(),
                          pre_treatment_id: item.pre_treatment_id,
                        })
                        setSelectProgess(0)
                      }}
                      isWarning={item.isWarning && selectedShift?.item != item.time}
                      progressValue={selectProgess ?? 0}
                      time={item?.time?.trim()}
                      isSelected={selectedShift?.item === item.time}
                      key={index?.toString()}
                    />
                  ))}
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
                      placeholder="Search"
                      onChangeText={(text) => setQuery(text)}
                      label=""
                      errormessage={""}
                      type="search"
                    />
                  </View>
                  <View style={styles.sortIcon}>
                    <TouchableOpacity style={{ padding: 10 }} onPress={onSortItem}>
                      <Icon name="sort" size={20} color={"black"} />
                    </TouchableOpacity>
                  </View>
                </View>
                {/* {isloading && <ActivityIndicator size="large" color={colors.primary} />} */}

                <View style={{ flex: 1 }}>
                  <FlatList
                    // contentContainerStyle={{flex:1}}
                    ListEmptyComponent={
                      <EmptyFallback placeholder="No Task for this schedule !!!" />
                    }
                    showsVerticalScrollIndicator
                    persistentScrollbar
                    data={selectTime}
                    refreshControl={
                      <RefreshControl
                        colors={[colors.primary]}
                        tintColor={colors.primary}
                        refreshing={isloading}
                        onRefresh={() => refresh()}
                      />
                    }
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                  />
                </View>
                <AlertDialog
                  visible={visible}
                  content="Are you sure about that?"
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
const $fontSelected: TextStyle = {
  fontSize: 14,
}
const $outerContainer: ViewStyle = {
  margin: 15,
  marginTop: 20,
  padding: 10,
  flex: 1,
}

const $containerHorizon: ViewStyle = {
  flexDirection: "row",
  // height:"100%",
  alignItems: "center",
  gap: 5,
  // ,paddingBottom:25
}

const $useflex: ViewStyle = {
  flex: 1,
}
