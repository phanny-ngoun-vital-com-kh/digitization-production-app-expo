/* eslint-disable camelcase */
import React, { FC, useEffect, useRef, useState } from "react"
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
import { cleanTimeCurrent, cleanTimePreWtp, getCurrentTime } from "app/utils-v2/getCurrTime"
import AlertDialog from "app/components/v2/AlertDialog"
import { prewaterTreatmentApi } from "app/services/api/pre-water-treatment-api"
import { translate } from "../../../i18n"
import ActivityModal from "app/components/v2/ActivitylogModal"
import { isCancel } from "apisauce"

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
    const flatListRef = useRef<FlatList>(null)
    const [cancelDate, setCancelDate] = useState(false)
    const [roles, setRoles] = useState<string[]>([])
    const [isRefreshing, setRefreshing] = useState(false)
    const [showActivitylog, setShowActivitylog] = useState(false)
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
      name: "Water Treatment Plant 2",
      value: 1,
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
      const [currentHour, currentMinute] = currentTime.split(":").map(Number)
      const currentTimeInMinutes = currentHour * 60 + currentMinute
      const sortedSchedules = schedules.map((schedule) => {
        const [hour, minute] = schedule.time.split(":").map(Number)
        const timeInMinutes = hour * 60 + minute
        let index = 0
        switch (schedule?.time) {
          case "7:00":
            index = 0
            break
          case "11:00":
            index = 1
            break

          case "15:00":
            index = 2
            break
          case "19:00":
            index = 3
            break
          case "23:00":
            index = 4
            break
          case "3:00":
            index = 5
            break
          default:
            index = -1
            break
        }

        return { ...schedule, timeInMinutes, index }
      })
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
      refresh()
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
        setRefreshing(true)
        await prewaterTreatmentApi.saveAssign({
          id: assignUser?.id?.toString() || "",
          action: taskAssignto.split(" ").includes(assignUser?.currUser ?? "")
            ? "has remove the assignment from this machine "
            : "has self assign this machine",
          pre_treatment_type: assignUser?.pretreatment_type ?? "",
          pre_treatment_id: assignUser?.treatment_id,
        })
        refresh()
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
    const invalidDate = (created_date: any) =>
      moment(Date.now()).format("YYYY-MM-DD") === moment.utc(created_date).format("YYYY-MM-DD")

    const isValidShift = (time: any) =>
      getCurrentTime() > cleanTimeCurrent(!time.includes("(") ? time : time?.split(" ")[1]) &&
      getCurrentTime().localeCompare(
        cleanTimePreWtp(!time.includes("(") ? time : time?.split(" ")[1]),
      )
    const renderItem = ({ item }: { item: PreWaterTreatment }) => {
      return (
        <FlatList
          ListEmptyComponent={<EmptyFallback placeholder="No Task for this schedule!!!" />}
          // ListEmptyComponent={<EmptyFallback placeholder="No Task for this schedule !!!" />}
          showsVerticalScrollIndicator
          persistentScrollbar
          data={item?.pretreatmentlist || []}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item: subitem }) => {
            return (
              <MachinePanel
                handleShowdialog={(users: string[]) => {
                  setShowActivitylog(true)
                  if (users.includes("")) {
                    return
                  }
                  setRoles(users)
                }}
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
                validDate={invalidDate(item?.assign_date)}
                validShift={isValidShift(item?.time)}
                created_date={item?.assign_date}
                machine_type={subitem?.control}
                id={subitem.id}
                isAssign={subitem.assign_to_user?.split(" ").includes(assignUser?.currUser ?? "")}
                currUser={assignUser?.currUser}
                assign_to_user={subitem.assign_to_user ?? ""}
                assign_to={item.assign_to}
                time={item.time}
                onPress={(shift: any) => {
                  setLoading(false)
                  // navigation.navigate(
                  //   item?.pre_treatment_type?.toString() == "Water Treatment Plant 2" ||
                  //     item?.pre_treatment_type.toString() == "Water Treatment Plant 3"
                  //     ? "PreWaterForm1"
                  //     : "PreWaterForm2",
                  //   {
                  //     type: subitem?.control,
                  //     onBack: onSendback,
                  //     isValidShift: isValidShift(item?.time) === -1 ? true : false,

                  //     isvalidDate:
                  //       moment(Date.now()).format("LL") === moment(item?.createdDate).format("LL"),

                  //     item: {
                  //       ...subitem,
                  //       pre_treatment_type: item?.pre_treatment_type,
                  //       pre_treatment_id: item?.pre_treatment_id,
                  //     },
                  //     isEdit:
                  //       isValidShift(item?.time) === -1
                  //         ? true
                  //         : false &&
                  //           moment(Date.now()).format("LL") ===
                  //             moment(item?.createdDate).format("LL"),
                  //   },
                  // )
                  
                  navigation.navigate(
                    item?.pre_treatment_type?.toString() == "Water Treatment Plant 2" ||
                      item?.pre_treatment_type.toString() == "Water Treatment Plant 3"
                      ? "PreWaterForm1"
                      : "PreWaterForm2",
                    {
                      type: subitem?.control,
                      onBack: onSendback,
                      isValidShift: shift === -1 ? true : false,

                      isvalidDate:moment(Date.now()).format("LL") === moment(item?.assign_date).format("LL"),

                      item: {
                        ...subitem,
                        pre_treatment_type: item?.pre_treatment_type,
                        pre_treatment_id: item?.pre_treatment_id,
                      },
                      isEdit: true,
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
      fetchWtp(selectedShift?.item, selectedShift.index?.toString(), selectedWTP.name)
    }

    const fetchWtp = async (time: string, index: string, type:string) => {
      try {
        getCurrentUserName()
        setQuery("")
        setSort("asc")
        // setLoading(true)
        setRefreshing(true)

        const result = await preWaterTreatmentStore.getListPreTreatment(
          datePicker.value ?? '',
          selectedWTP?.name,
        )

        const sortedResult = result.sort((a, b) => {
          const specialTimes = { "7:00": -1, "3:00": 1 }

          // Handle special times explicitly
          if (a.time === "7:00") return -1
          if (b.time === "7:00") return 1
          if (a.time === "3:00") return 1
          if (b.time === "3:00") return -1

          // Regular time comparison
          const [hoursA, minutesA] = a.time.split(":").map(Number)
          const [hoursB, minutesB] = b.time.split(":").map(Number)

          if (hoursA !== hoursB) {
            return hoursA - hoursB
          }
          return minutesA - minutesB
        })
        
        if (result?.length > 0) {
          const item = result.find(a => a.time === time);
          if(!item){
            setRefreshing(false)
            return
          }
          setSelectedShift((pre) => ({ ...pre}))
          fetchWtpbyTime(time, item.pre_treatment_id, type)
          // setLoading(false)
        } else {
          setSelectedShift((pre) => ({ ...pre }))
          // setLoading(false)
          setRefreshing(false)
          return
        }
        const foundwarning = []
        // setLoading(false)
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
          console.log(indexFound,'indexFound')
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
            console.log('indexFound',indexFound)
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
          textBody: "បញ្ហាបច្ចេកទេសនៅលើ hiserver",
          button: "បិទ",
        })
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
        const result = await preWaterTreatmentStore.getSelectedPretreatment(
          time,
          pre_treatment_id,
          pre_treatment_type,
        )
        // console.log('time',time)
        // console.log('pre_treatment_id',pre_treatment_id)
        // console.log('pre_treatment_type',pre_treatment_type)
        // console.log(result)
        const [allprogress] = result?.map((item) => item?.pretreatmentlist) as []
        const selectProgress = allprogress?.filter((item) => item?.status !== "pending")
        const pretreatmentlist = result?.map((item) => item?.pretreatmentlist)[0]
        flatListRef.current?.scrollToOffset({
          animated: true,
          offset: 0,
        })
        onCalculateSchedule(selectProgress?.length, pretreatmentlist?.length)

        setSelectTime(result)
        setMachineSnapshot(result)
      } catch (error: any) {
        console.log(error?.message)
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    }
    const hideDialog = () => setVisible(false)

    useEffect(() => {
      if (selectedWTP.value && datePicker.value && !cancelDate) {
        setLoading(true)
        const result = getCurrentSchedule(schedules, getCurrentTime())

        // const Foundindex = schedules.findIndex((item) => item.time === result?.time)

        if (moment(datePicker.value).format("L") !== moment(Date.now()).format("L")) {
          setWtp([])
          setSelectTime([])

          fetchWtp(selectedShift?.item, selectedShift.index?.toString(), selectedWTP.name)

          return
        }
        setSelectedShift((pre) => ({ ...pre, item: result?.time, index: result?.index }))

        setSchedules([
          { time: "7:00", isWarning: false, pre_treatment_id: "" },
          { time: "11:00", isWarning: false, pre_treatment_id: "" },
          { time: "15:00", isWarning: false, pre_treatment_id: "" },
          { time: "19:00", isWarning: false, pre_treatment_id: "" },
          { time: "23:00", isWarning: false, pre_treatment_id: "" },
          { time: "3:00", isWarning: false, pre_treatment_id: "" },
        ]) //

        setSelectProgess(0)
        // console.log(selectedWTP)
        // console.log('me',result?.time, result?.index, selectedWTP.name)
        fetchWtp(result?.time, result?.index, selectedWTP.name)
      }
    }, [datePicker.value, selectedWTP.value, cancelDate])

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
              {/* <Pressable
                onPress={() =>
                  navigation.navigate("PreWaterForm2", {
                    type: null,
                    onBack: onSendback,
                    isvalidDate: true,
                    item: null,
                  })
                }
              >
                <Text>Test Form offline</Text>
              </Pressable> */}
              <HeaderBar
                isLoading={isRefreshing}
                enableWTP={true}
                showLine={false}
                onChangeDate={(e, v) => {
                  setDatePicker((pre) => ({ show: false, value: v }))
                  if (e.type === "set") {
                    setSelectProgess(0)
                    setCancelDate(false)
                  } else {
                    setCancelDate(true)
                  }
                }}
                selectedWtp={selectedWTP}
                onSelectWtp={(item) => {
                  // setSelectTime([])
                  setSelectTime([])
                  setSelectedWTP(item)
                }}
                onPressdate={() => {
                  setDatePicker((pre) => ({ ...pre, show: true }))
                  setCancelDate(true)
                }}
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
                        setRefreshing(true)
                        setSelectTime([])
                        setSelectedShift({
                          item: item.time,
                          index: index,
                          pre_treatment_id: item.pre_treatment_id,
                          
                        })
                        fetchWtpbyTime(
                          item.time,
                          item.pre_treatment_id,

                          selectedWTP.name,
                        )
                        console.log(item.isWarning)

                        setSelectProgess(0)
                      }}
                      isWarning={item.isWarning }
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
                      placeholder={translate("preWaterTreatment.search")}
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
                      !isRefreshing && (
                        <EmptyFallback placeholder={translate("wtpcommon.noScheduleYet")} />
                      )
                    }
                    showsVerticalScrollIndicator
                    persistentScrollbar
                    ref={flatListRef}
                    data={selectTime}
                    refreshControl={
                      <RefreshControl
                        colors={[colors.primary]}
                        tintColor={colors.primary}
                        refreshing={isRefreshing}
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
        <ActivityModal
          title="Users"
          type="roles"
          log={roles}
          isVisible={showActivitylog}
          onClose={() => {
            setShowActivitylog(false)
          }}
        />
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
