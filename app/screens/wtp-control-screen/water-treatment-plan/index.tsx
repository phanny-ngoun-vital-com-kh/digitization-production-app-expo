import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import moment from "moment"
import { useTheme } from "app/theme-v2"
import {
  View,
  ViewStyle,
  TouchableOpacity,
  Platform,
  ScrollView,
  FlatList,
  RefreshControl,
  Alert,
} from "react-native"
import { AppStackScreenProps } from "app/navigators"
import styles from "./styles"
import { Divider } from "react-native-paper"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "app/models"
import { WaterTreatment } from "app/models/water-treatment/water-treatment-model"
import HeaderBar from "../../../components/v2/WaterTreatment/HeaderBar"
import TimePanel from "app/components/v2/WaterTreatment/TimePanel"
import Icon from "react-native-vector-icons/FontAwesome"
import MachinePanel from "app/components/v2/WaterTreatment/MachinePanel"
import CustomInput from "app/components/v2/DailyPreWater/CustomInput"
import EmptyFallback from "app/components/EmptyFallback"

interface WaterTreatmentScreenProps extends AppStackScreenProps<"WaterTreatment"> {}

export const WaterTreatmentScreen: FC<WaterTreatmentScreenProps> = observer(
  function WaterTreatmentScreen() {
    const { waterTreatmentStore } = useStores()
    const [refreshing, setRefreshing] = useState(false)
    const { colors } = useTheme()
    const [wtp2, setWtp2] = useState<WaterTreatment[]>([])
    const [isloading, setLoading] = useState(false)
    const [datePicker, setDatePicker] = useState({
      show: false,
      value: new Date(Date.now()),
    })
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

    const machines = [
      "Raw Water Stock",
      "Sand Filter",
      "Carbon Filter",
      "Resin Filter",
      "Microfilter 5Mm",
      "Microfilter 1Mm",
      "Reverses Osmosis",
    ]

    const renderItem = ({ item }: { item: WaterTreatment }) =>
      item?.treatmentlist?.map((subitem, index) => {
        //Sub Collection of treatmentlist that contain the machines
        return (
          <MachinePanel
            key={index.toString()}
            status={subitem.status}
            machine_type={subitem?.machine}
            assign_to={item?.assign_to ?? 'vorn'}
            time={item?.shift ?? 'S1 (7:00)' }
            onPress={() =>
              navigation.navigate("WaterTreatmentPlant2Form", {
                type: subitem?.machine,
              })
            }
          />
        )
      })
    const refresh = async (showLoading = false) => {
      try {
        setRefreshing(true)
      } catch (error) {
      } finally {
        setRefreshing(false)
      }
    }

    const fetchScehdules = async () => {
      try {
        setLoading(true)
        const assign_date = moment(datePicker.value).format("YYYY-MM-DD")
        const results = (await waterTreatmentStore.getWtpSchedules(
          assign_date?.toString(),
          "S1 (7:00)",
        )) as []
        setWtp2(results)
        // setSelectedShift(results.map((item) => item?.shift)[0])
      } catch (error:unknown) {
        Alert.alert("error has been occur")
        console.log(error?.message)
      }
      setLoading(false)
    }

    useEffect(() => {
      fetchScehdules()
    }, [])

    console.log(selectedShift)

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
              showLine={false}
              onChangeDate={(e, v) => {
                setDatePicker((pre) => ({ show: false, value: v }))
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
                          setSelectedShift(`${item.name} ( ${subitem} )`)
                        }}
                        time={subitem?.trim()}
                        isSelected={false}
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
                <View style={{ width: 400 }}>
                  <CustomInput
                    placeholder="Search"
                    onChangeText={(text) => {}}
                    label=""
                    errormessage={""}
                  />
                </View>

                <View
                  style={{
                    width: 50,
                    height: 50,
                    backgroundColor: "white",
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: "#EFEBEB",
                  }}
                >
                  <TouchableOpacity style={{}}>
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
                  ListEmptyComponent={<EmptyFallback placeholder="Please Select Shift!!!" />}
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
