import React, { FC, useCallback, useEffect, useState } from "react"
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
  Alert,
} from "react-native"
import { AppStackScreenProps } from "app/navigators"
import styles from "./styles"
import { Divider } from "react-native-paper"
import { useIsFocused, useNavigation } from "@react-navigation/native"
import { useStores } from "app/models"
import { Treatment, WaterTreatment } from "app/models/water-treatment/water-treatment-model"
import HeaderBar from "../../../components/v2/WaterTreatment/HeaderBar"
import TimePanel from "app/components/v2/WaterTreatment/TimePanel"
import Icon from "react-native-vector-icons/FontAwesome"
import MachinePanel from "app/components/v2/WaterTreatment/MachinePanel"
import CustomInput from "app/components/v2/DailyPreWater/CustomInput"
import EmptyFallback from "app/components/EmptyFallback"
import { ALERT_TYPE, Dialog } from "react-native-alert-notification"

interface WaterTreatmentScreenProps extends AppStackScreenProps<"WaterTreatment"> {}

export const WaterTreatmentScreen: FC<WaterTreatmentScreenProps> = observer(
  function WaterTreatmentScreen() {
    const { waterTreatmentStore } = useStores()
    const isfocused = useIsFocused()

    const [refreshing, setRefreshing] = useState(false)
    const { colors } = useTheme()
    const [wtp2, setWtp2] = useState<WaterTreatment[]>([])
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
    const shifts = [
      {
        id: 1,
        name: "S1",
        schedules: ["7:00", "13:00"],
      },
      {
        id: 2,
        name: "S2",
        schedules: ["18:00", "22:00"],
      },
    ]

    const renderItem = ({ item }: { item: WaterTreatment }) =>
      schedules?.map((subitem, index) => {
        //Sub Collection of treatmentlist that contain the machines
        return (
          <MachinePanel
            key={index.toString()}
            status={subitem?.status ?? "pending"}
            machine_type={subitem?.machine}
            assign_to={item?.assign_to ?? "vorn"}
            time={item?.shift ?? "S1 (7:00)"}
            onPress={() =>
              navigation.navigate("WaterTreatmentPlant2Form", {
                type: subitem?.machine ?? "",
                items: subitem,
                onReturn: sendBack,
              })
            }
          />
        )
      })

    const sendBack = (isSubmit: boolean = false) => {
      refresh()
    }
    const refresh = async (showLoading = false) => {
      setRefreshing(true)
      fetchScehdules()
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
          setSchedules(results.map((item) => item?.treatmentlist)[0])
          setScheduleSnapshot(results.map((item) => item?.treatmentlist)[0])

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

    useEffect(() => {
      fetchScehdules()
    }, [datePicker.value, selectedShift])

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

      console.log(result?.length)
      if (!result?.length || query === "") {
        //length = 0 meaning no result, > 0  have result so we set to schedule
        setSchedules(scheduleSnapshot)
      } else {
        setSchedules(result)
      }
    }

    useEffect(() => {
      onSearchItem()

      return () => setSchedules(scheduleSnapshot)
    }, [query])

    useEffect(() => {
      if (isfocused && !query) {
        // refresh()
      }
    }, [isfocused])

    // console.log("observer ", waterTreatmentStore.treatments.length)
    return (
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
                setSelectedShift(`S1 (7:00)`)
              }}
              onPressdate={() => setDatePicker((pre) => ({ ...pre, show: true }))}
              dateValue={datePicker.value}
              showDate={datePicker.show}
              currDate={new Date(Date.now()).toLocaleDateString()}
            />
          </View>

          <Divider style={styles.divider_space} />

          <View
            style={[
              $containerHorizon,
              {
                gap: 10,
                marginTop: 0,
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
                        onPress={() => {
                          setSelectedShift(`${item.name} (${subitem})`)
                        }}
                        // progressValue={1}
                        time={subitem?.trim()}
                        isSelected={`${item.name} (${subitem})` === selectedShift}
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
                  { justifyContent: "space-between", marginVertical: 4, alignItems: "center" },
                ]}
              >
                <View style={{ width: 550 }}>
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
            </View>
          </View>
        </View>
      </View>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
  backgroundColor: "white",
}

const $outerContainer: ViewStyle = {
  margin: 15,
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
