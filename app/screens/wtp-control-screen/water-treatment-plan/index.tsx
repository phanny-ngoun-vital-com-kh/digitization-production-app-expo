import * as SQLite from "expo-sqlite"
import React, { FC, useEffect, useLayoutEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import moment from "moment"
import { useTheme } from "app/theme-v2"
import { default as IconSecondary } from "react-native-vector-icons/Ionicons"

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
import {
  cleanTimeCurrent,
  cleanTimeString,
  convertToMinutes,
  getCurrentTime,
} from "app/utils-v2/getCurrTime"
import { translate } from "../../../i18n"
import ActivityModal from "app/components/v2/ActivitylogModal"
import { getDBConnection } from "app/lib/offline-db"
import networkStore from "app/models/network"
import { Text } from "app/components/v2"
import { saveAssignTreatment } from "app/lib/offline-db/wtp"

interface WaterTreatmentScreenProps extends AppStackScreenProps<"WaterTreatment"> {}

export const WaterTreatmentScreen: FC<WaterTreatmentScreenProps> = observer(
  function WaterTreatmentScreen() {
    const { waterTreatmentStore, authStore } = useStores()
    const [selectProgess, setSelectProgess] = useState(0)
    const [refreshing, setRefreshing] = useState(false)
    const { colors } = useTheme()
    const [showOffline, setShowoffline] = useState(false)
    const [wtpUsers, setWtpUsers] = useState<string[]>([])
    const flatListRef = useRef<FlatList>(null)
    const [wtp2, setWtp2] = useState<WaterTreatment[]>([])
    const [visible, setVisible] = React.useState(false)
    const [schedules, setSchedules] = useState<Treatment[]>()
    const [scheduleSnapshot, setScheduleSnapshot] = useState<Treatment[]>()
    const [isloading, setLoading] = useState(false)
    const [roleLoading, setRoleLoading] = useState(false)
    const [roles, setRoles] = useState<string[]>([])
    const [cancelDate, setCancelDate] = useState(false)
    const [datePicker, setDatePicker] = useState({
      show: false,
      value: new Date(Date.now()),
      // value: null,
    })
    const [assignUser, setAssignUser] = useState<{
      id: number | null
      treatment_id: string
      currUser?: string | null
    }>({
      treatment_id: "",
      id: null,
      currUser: "",
    })

    const [taskAssignto, setTaskAssignTo] = useState("")
    const [offlineWtp, setOfflineWtp] = useState<WaterTreatment[]>()
    const [sort, setSort] = useState("asc")
    const [query, setQuery] = useState("")
    const [showActivitylog, setShowActivitylog] = useState(false)

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

    const dummyShifts = [
      { time: "7:00", type: "S1" },
      { time: "13:00", type: "S1" },
      { time: "18:00", type: "S2" },
      { time: "22:00", type: "S2" },
    ]

    const invalidDate = (created_date: any) =>
      moment(Date.now()).format("LL") === moment(created_date).format("LL")

    const isValidShift = (time: any) =>
      getCurrentTime() > cleanTimeCurrent(!time.includes("(") ? time : time?.split(" ")[1]) &&
      getCurrentTime().localeCompare(
        cleanTimeString(!time.includes("(") ? time : time?.split(" ")[1]),
      )

    const handleAssignTask = async () => {
      try {
        let modifyUser: string[] = []

        setRoleLoading(true)
        const isExisted = wtpUsers?.includes(authStore?.userLogin ?? "")

        if (isExisted) {
          //exist = remove user

          modifyUser = wtpUsers?.filter((user) => user !== authStore?.userLogin)
        } else {
          if (wtpUsers?.length === 0) {
            console.log("Current user is ", authStore?.userLogin)
            modifyUser.push(authStore?.userLogin ?? "")
          } else {
            modifyUser = wtpUsers
          }
        }
        //notexist = assign user

        console.log("array of modify user", modifyUser)
        const strUser = modifyUser.toString()
        const newStrUser = strUser.replace(",", " ")

        // Prod1,User1,Ware1

        if (networkStore.isConnected) {
          await waterTreatmentStore.assignMachine(
            assignUser!.id?.toString() || "",
            taskAssignto.split(" ").includes(assignUser?.currUser ?? "")
              ? "has remove the assignment from this machine"
              : "has self assign this machine",
            assignUser!.treatment_id,
          )
          await saveAssignTreatment(+assignUser?.id ?? 0, newStrUser, assignUser!.treatment_id)
          refresh()
        } else {
          //user assign task in offline-mode

          //prod1 admin1 ware1

          const db = await saveAssignTreatment(
            +assignUser?.id ?? 0,
            newStrUser,
            assignUser!.treatment_id,
          )

          if (db?.success === 200) {
        
            fetchScehdules()
          } else {
            console.log("ERROR _ WTP - 400")
          }
        }
        setVisible(false)
        // console.log("full finished", payload)
      } catch (error) {
        // console.log(error.message)
        // Dialog.show({
        //   type: ALERT_TYPE.DANGER,
        //   title: "បរាជ័យ",
        //   textBody: "បញ្ហាបច្ចេកទេសនៅលើ server",
        //   button: "បិទ",
        // })
      } finally {
        setRoleLoading(false)
        // refresh()
      }
    }

    const onCalculateSchedule = (completed: string, total: string) => {
      // console.log(completed, total)
      if (completed && total) {
        const progress = Number(completed) / Number(total)
        setSelectProgess(progress)
      }
    }

    const hideDialog = () => setVisible(false)

    // console.log("machine and user", assignUser)
    const renderItem = ({ item }: { item: WaterTreatment }) =>
      schedules?.map((subitem: Treatment, index) => {
        //Sub Collection of treatmentlist that contain the machines
        return (
          <View key={index.toString()}>
            <MachinePanel
              handleAssigntask={(id: number, assign_to_user: string, users?: string[]) => {
                if (users?.length ? users[0] === "" : true) {
                  setWtpUsers([])
                } else {
                  setWtpUsers(users!)
                }

                setVisible(true)
                setTaskAssignTo(assign_to_user)
                setAssignUser((pre) => ({ ...pre, id, treatment_id: item?.treatment_id ?? "" }))
              }}
              handleShowdialog={(users) => {
                setShowActivitylog(true)

                if (users.includes("")) {
                  return
                }
                setRoles(users)
              }}
              currUser={assignUser?.currUser}
              key={index.toString()}
              id={subitem.id}
              validDate={invalidDate(item?.createdDate)}
              validShift={isValidShift(item?.shift)}
              isAssign={subitem.assign_to_user?.split(" ").includes(assignUser?.currUser ?? "")}
              assign_to_user={subitem.assign_to_user ?? ""}
              status={subitem?.status ?? "pending"}
              created_date={item?.assign_date}
              machine_type={subitem?.machine}
              assign_to={item?.assign_to ?? "vorn"}
              warning_count={subitem?.warning_count ?? 0}
              time={item?.shift ?? "S1 (7:00)"}
              onPress={(shift: any) => {
                navigation.navigate("WaterTreatmentPlant2Form", {
                  type: subitem?.machine ?? "",
                  items: subitem,
                  onReturn: sendBack,
                  isValidShift: shift === -1 ? true : false,
                  isvalidDate:
                    moment(Date.now()).format("LL") === moment(item?.createdDate).format("LL"),
                  isEdit:
                    subitem?.assign_to_user?.split(" ").includes(assignUser?.currUser ?? "") &&
                    shift === -1
                      ? true
                      : false &&
                        moment(Date.now()).format("LL") === moment(item?.createdDate).format("LL"),
                })
              }}
            />
          </View>
        )
      })

    const sendBack = () => {
      refresh()
    }
    const refresh = async (showLoading = false) => {
      setRefreshing(true)
      fetchScehdules()
    }

    const getCurrentTimeAndShift = (dummyShifts, getCurrentTime) => {
      const currentTime = getCurrentTime
      const currentTimeInMinutes = convertToMinutes(currentTime)

      for (let i = 0; i < dummyShifts.length; i++) {
        const shift = dummyShifts[i]
        const shiftTimeInMinutes = convertToMinutes(shift.time)

        if (currentTimeInMinutes < shiftTimeInMinutes) {
          if (i === 0) {
            // If current time is before the first shift, return the first shift time and type
            return { time: dummyShifts[0].time, type: dummyShifts[0].type }
          } else {
            // If current time is after a shift but before the next, return the previous shift time and type
            return { time: dummyShifts[i - 1].time, type: dummyShifts[i - 1].type }
          }
        }
      }

      // If current time is after the last shift, return the last shift time and type
      const lastIndex = dummyShifts.length - 1
      return { time: dummyShifts[lastIndex].time, type: dummyShifts[lastIndex].type }
    }
    const fetchTimePanel = async () => {
      let times = []
      const assign_date = moment(datePicker?.value).format("YYYY-MM-DD")
      if (networkStore.isConnected == true) {
        times = (await waterTreatmentStore.getWtpByDate(assign_date?.toString() || "")) as []
      } else {
        console.log("itnernet disconnected", networkStore.isConnected)
        times = (await waterTreatmentStore.getOfflineWtpByDate(assign_date?.toString() || "")) as []
      }

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
    const getCurrentUserName = async () => {
      const userinfo = networkStore.isConnected
        ? await authStore.getUserInfo()
        : authStore.authInfo?.roles

      const user = userinfo?.data
      setAssignUser((pre) => ({ ...pre, currUser: user?.login ?? authStore.userLogin }))
    }
    const fetchScehdules = async () => {
      try {

        console.log("pull refresh ")
        setLoading(true)
        setRefreshing(true)
        getCurrentUserName()
        setQuery("")
        setSort("asc")

        if (datePicker.value) {
          const assign_date = moment(datePicker?.value).format("YYYY-MM-DD")
          let results
          if (networkStore.isConnected) {
            results = (await waterTreatmentStore.getWtpSchedules(
              assign_date?.toString() || "",
              selectedShift || "",
            )) as []
          } else {
            console.log("Fetch fromlocal wtp ")
            results = (await waterTreatmentStore.getOfflineWtp(
              assign_date?.toString() || "",
              selectedShift || "",
            )) as []
          }

          // console.log("done fetching", results.length)
          // flatListRef?.current?.scrollToOffset({
          //   animated: true,
          //   offset: 0,
          // })

          setWtp2(results)
          const schedules = results.map((item) => item?.treatmentlist)[0]
          setSchedules(schedules)
          setScheduleSnapshot(schedules)
          const [allprogress] = results.map((item) => item?.treatmentlist) as []

          const selectProgress = allprogress?.filter((item) =>
            item?.status == null ? item?.status != null : item?.status !== "pending",
          )

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
        setTimeout(() => {
          setLoading(false)
        }, 500)

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
      if (query === "") {
        setSchedules(scheduleSnapshot)
      }
      if (!result?.length) {
        //length = 0 meaning no result, > 0  have result so we set to schedule
        setSchedules([])
      } else {
        setSchedules(result)
      }
    }
    const [selectedShift, setSelectedShift] = useState(() => {
      const result = getCurrentTimeAndShift(dummyShifts, getCurrentTime())
      const currShift = result.type + " " + "(" + result.time + ")"
      // console.log(currShift)
      return currShift
    })

    // const logSqlInfo = async () => {
    //   const db? = await getDBConnection()

    //   console.log("sql lite version is ", db?.databaseName)
    // }

    useLayoutEffect(() => {
      // loadAllTreatments()

      if (cancelDate === false && datePicker.value) {
        fetchScehdules()
        fetchTimePanel()
      }
    }, [datePicker.value, selectedShift, cancelDate])
    useEffect(() => {
      onSearchItem()
      return () => setSchedules(scheduleSnapshot)
    }, [query])

    useEffect(() => {
      if (networkStore.isConnected == false) {
        setShowoffline(true)

        return
      } else {
        setShowoffline(false)

        //when internet or first open this bind
      }
    }, [networkStore, navigation])

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
                isLoading={isloading}
                enableWTP={false}
                showLine={false}
                onChangeDate={(e, v) => {
                  setDatePicker({ show: false, value: v })

                  if (e.type === "set") {
                    // setWtp2([])
                    setSelectProgess(0)

                    setCancelDate(false)
                    // setSelectedShift(`S1 (7:00)`)
                  } else {
                    setCancelDate(true)
                  }
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
                  // marginBottom: 20,
                  height: "88%",
                  backgroundColor: "#F6F5F5",
                },
              ]}
            >
              <View style={styles.leftPane}>
                <ScrollView>
                  {shifts?.map((item, i) => {
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
                            flatListRef?.current?.scrollToOffset({
                              animated: true,
                              offset: 0,
                            })
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
                      placeholder={translate("dailyWaterTreatment.search")}
                      onChangeText={(text: string) => {
                        setQuery(text)
                      }}
                      label=""
                      errormessage={""}
                    />
                  </View>
                  {showOffline && (
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                      <IconSecondary name="cloud-offline" size={19} color={"red"} />
                      <Text style={{ marginRight: 5 }} errorColor caption1 semibold>
                        You are offline
                      </Text>
                    </View>
                  )}

                  <View>
                    <TouchableOpacity style={styles.sortingIcon} onPress={onSortItem}>
                      <Icon name="sort" size={20} color={"black"} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={$useflex}>
                  <FlatList
                    showsVerticalScrollIndicator
                    persistentScrollbar
                    refreshControl={
                      <RefreshControl
                        colors={[colors.primary]}
                        tintColor={colors.primary}
                        refreshing={refreshing}
                        onRefresh={() => refresh()}
                      />
                    }
                    ref={flatListRef}
                    style={$useflex}
                    data={wtp2}
                    ListEmptyComponent={
                      !refreshing ? (
                        <EmptyFallback placeholder={translate("wtpcommon.noScheduleYet")} />
                      ) : (
                        <></>
                      )
                    }
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={renderItem}
                  />
                </View>
                <AlertDialog
                  visible={visible}
                  isLoading={roleLoading}
                  content="Are you sure about that?"
                  hideDialog={hideDialog}
                  wtpUsers={wtpUsers}
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
