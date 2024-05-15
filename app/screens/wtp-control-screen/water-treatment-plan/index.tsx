/* eslint-disable camelcase */
import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { useTheme } from "app/theme-v2"
import { View, ViewStyle, TouchableOpacity, Platform, ScrollView } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import styles from "./styles"
import { Divider } from "react-native-paper"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "app/models"
import { Shift } from "./type"
import {
  WaterTreatment
} from "app/models/water-treatment/water-treatment-model"
import HeaderBar from "../../../components/v2/WaterTreatment/HeaderBar"
import TimePanel from "app/components/v2/WaterTreatment/TimePanel"
import Icon from "react-native-vector-icons/FontAwesome"
import MachinePanel from "app/components/v2/WaterTreatment/MachinePanel"
import CustomInput from "app/components/v2/DailyPreWater/CustomInput"
import { FlatList } from "react-native-gesture-handler"

interface WaterTreatmentScreenProps extends AppStackScreenProps<"WaterTreatment"> {}

export const WaterTreatmentScreen: FC<WaterTreatmentScreenProps> = observer(
  function WaterTreatmentScreen() {
    const dummy_generate = {
      check_id: Date.now(),
      waterplant_type: "B",
      shifts: [
        {
          shift: 1,
          time: "7:00:00",
          type: "A",
          tsd_ppm: null,
          ph_level: null,
          temperature: null,
          checked_by: null,
          machines: "Raw Water Stock",
          inspection_status: null,
        },
        {
          shift: 1,
          time: "13:00:00",
          type: "A",
          tsd_ppm: null,
          ph_level: null,
          temperature: null,
          checked_by: null,
          machines: "Raw Water Stock",
          inspection_status: null,
        },
        {
          shift: 2,
          time: "18:00:00",
          type: "A",
          tsd_ppm: null,
          ph_level: null,
          temperature: null,
          checked_by: null,
          machines: "Raw Water Stock",
          inspection_status: null,
        },
        {
          shift: 2,
          time: "21:00:00",
          type: "A",
          tsd_ppm: null,
          ph_level: null,
          temperature: null,
          checked_by: null,
          machines: "Raw Water Stock",
          inspection_status: null,
        },
        {
          shift: 1,
          time: "7:00:00",
          tsd_ppm: null,
          ph_level: null,
          pressure: null,
          air_release: null,
          other: null,
          temperature: null,
          type: "B",
          checked_by: null,
          machines: "Sand Filter",
          inspection_status: null,
        },
        {
          shift: 1,
          time: "13:00:00",
          tsd_ppm: null,
          ph_level: null,
          pressure: null,
          air_release: null,
          other: null,
          temperature: null,
          type: "B",
          checked_by: null,
          machines: "Sand Filter",
          inspection_status: null,
        },
        {
          shift: 2,
          time: "18:00:00",
          tsd_ppm: null,
          ph_level: null,
          pressure: null,
          air_release: null,
          other: null,
          temperature: null,
          type: "B",
          checked_by: null,
          machines: "Sand Filter",
          inspection_status: null,
        },
        {
          shift: 2,
          time: "21:00:00",
          tsd_ppm: null,
          ph_level: null,
          pressure: null,
          air_release: null,
          other: null,
          temperature: null,
          type: "B",
          checked_by: null,
          machines: "Sand Filter",
          inspection_status: null,
        },
        {
          shift: 1,
          time: "7:00:00",
          tsd_ppm: null,
          ph_level: null,
          pressure: null,
          air_release: null,
          other: null,
          temperature: null,
          type: "B",
          checked_by: null,
          machines: "Carbon Filter",
          inspection_status: null,
        },
        {
          shift: 1,
          time: "13:00:00",
          tsd_ppm: null,
          ph_level: null,
          pressure: null,
          air_release: null,
          other: null,
          temperature: null,
          type: "B",
          checked_by: null,
          machines: "Carbon Filter",
          inspection_status: null,
        },
        {
          shift: 2,
          time: "18:00:00",
          tsd_ppm: null,
          ph_level: null,
          pressure: null,
          air_release: null,
          other: null,
          temperature: null,
          type: "B",
          checked_by: null,
          machines: "Carbon Filter",
          inspection_status: null,
        },
        {
          shift: 2,
          time: "21:00:00",
          tsd_ppm: null,
          ph_level: null,
          pressure: null,
          air_release: null,
          other: null,
          temperature: null,
          type: "B",
          checked_by: null,
          machines: "Carbon Filter",
          inspection_status: null,
        },
        {
          shift: 1,
          time: "7:00:00",
          tsd_ppm: null,
          ph_level: null,
          pressure: null,
          air_release: null,
          other: null,
          temperature: null,
          type: "B",
          checked_by: null,
          machines: "Resin Filter",
          inspection_status: null,
        },
        {
          shift: 1,
          time: "13:00:00",
          tsd_ppm: null,
          ph_level: null,
          pressure: null,
          air_release: null,
          other: null,
          temperature: null,
          type: "B",
          checked_by: null,
          machines: "Resin Filter",
          inspection_status: null,
        },
        {
          shift: 2,
          time: "18:00:00",
          tsd_ppm: null,
          ph_level: null,
          pressure: null,
          air_release: null,
          other: null,
          temperature: null,
          type: "B",
          checked_by: null,
          machines: "Resin Filter",
          inspection_status: null,
        },
        {
          shift: 2,
          time: "21:00:00",
          tsd_ppm: null,
          ph_level: null,
          pressure: null,
          air_release: null,
          other: null,
          temperature: null,
          type: "B",
          checked_by: null,
          machines: "Resin Filter",
          inspection_status: null,
        },
        {
          shift: 1,
          time: "7:00:00",
          tsd_ppm: null,
          ph_level: null,
          pressure: null,
          other: null,
          temperature: null,
          type: "C",
          checked_by: null,
          machines: "Microfilter 5Mm",
          inspection_status: null,
        },
        {
          shift: 1,
          time: "13:00:00",
          tsd_ppm: null,
          ph_level: null,
          pressure: null,
          other: null,
          temperature: null,
          type: "C",
          checked_by: null,
          machines: "Microfilter 5Mm",
          inspection_status: null,
        },
        {
          shift: 2,
          time: "18:00:00",
          tsd_ppm: null,
          ph_level: null,
          pressure: null,
          other: null,
          temperature: null,
          type: "C",
          checked_by: null,
          machines: "Microfilter 5Mm",
          inspection_status: null,
        },
        {
          shift: 2,
          time: "22:00:00",
          tsd_ppm: null,
          ph_level: null,
          pressure: null,
          other: null,
          temperature: null,
          type: "C",
          checked_by: null,
          machines: "Microfilter 5Mm",
          inspection_status: null,
        },
        {
          shift: 1,
          time: "7:00:00",
          tsd_ppm: null,
          ph_level: null,
          pressure: null,
          other: null,
          temperature: null,
          type: "C",
          checked_by: null,
          machines: "Microfilter 1Mm",
          inspection_status: null,
        },
        {
          shift: 1,
          time: "18:00:00",
          tsd_ppm: null,
          ph_level: null,
          pressure: null,
          other: null,
          temperature: null,
          type: "C",
          checked_by: null,
          machines: "Microfilter 1Mm",
          inspection_status: null,
        },
        {
          shift: 2,
          time: "18:00:00",
          tsd_ppm: null,
          ph_level: null,
          pressure: null,
          other: null,
          temperature: null,
          type: "C",
          checked_by: null,
          machines: "Microfilter 1Mm",
          inspection_status: null,
        },
        {
          shift: 2,
          time: "22:00:00",
          tsd_ppm: null,
          ph_level: null,
          pressure: null,
          other: null,
          temperature: null,
          type: "C",
          checked_by: null,
          machines: "Microfilter 1Mm",
          inspection_status: null,
        },
        {
          shift: 1,
          time: "7:00:00",
          tsd_ppm: null,
          ph_level: null,
          press_inlet: null,
          press_treat: null,
          press_drain: null,
          checked_by: null,
          odor: null,
          taste: null,
          type: "D",
          machines: "Reverses Osmosis",
          inspection_status: null,
        },
        {
          shift: 1,
          time: "13:00:00",
          tsd_ppm: null,
          ph_level: null,
          press_inlet: null,
          press_treat: null,
          press_drain: null,
          checked_by: null,
          odor: null,
          taste: null,
          type: "D",
          machines: "Reverses Osmosis",
          inspection_status: null,
        },
        {
          shift: 2,
          time: "18:00:00",
          tsd_ppm: null,
          ph_level: null,
          press_inlet: null,
          press_treat: null,
          press_drain: null,
          checked_by: null,
          odor: null,
          taste: null,
          type: "D",
          machines: "Reverses Osmosis",
          inspection_status: null,
        },
        {
          shift: 2,
          time: "22:00:00",
          tsd_ppm: null,
          ph_level: null,
          press_inlet: null,
          press_treat: null,
          press_drain: null,
          checked_by: null,
          odor: null,
          taste: null,
          type: "D",
          machines: "Reverses Osmosis",
          inspection_status: null,
        },
        {
          shift: 2,
          time: "22:00:00",
          tsd_ppm: null,
          ph_level: null,
          press_inlet: null,
          press_treat: null,
          press_drain: null,
          checked_by: null,
          odor: null,
          taste: null,
          type: "D",
          machines: "Reverses Osmosis",
          inspection_status: null,
        },
      ],
      check_date: new Date(Date.now()),
    }

    const { waterTreatmentStore } = useStores()
    const { colors } = useTheme()
    const [waterPlants, setWaterplants] = useState<WaterTreatment[]>([])
    const [isloading, setLoading] = useState(false)
    const [selectMachine, setSelectMachine] = useState<Shift | null>(null)
    const [datePicker, setDatePicker] = useState({
      show: false,
      value: null,
    })
    const [selectedShift, setSelectedShift] = useState(null)

    const navigation = useNavigation()
    const shifts = [
      {
        id: 1,
        name: "shift 1",
        schedules: ["7:00:00", "13:00:00"],
      },
      {
        id: 2,
        name: "shift 2",
        schedules: ["18:00:00", "22:00:00"],
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

    const renderItem = ({ item }) => (
      <MachinePanel
        status="warning"
        machine_type={item}
        assign_to="Virek Chan"
        onPress={() =>
          navigation.navigate("WaterTreatmentPlant2Form", {
            type: item,
          })
        }
      />
    )
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
                backgroundColor: "#F5F5F5",
              },
            ]}
          >
            <View style={styles.rightPane}>
              <ScrollView scrollEnabled>
                {shifts?.map((item) => {
                  return item.schedules.map((subitem, index) => {
                    return (
                      <TimePanel
                        onPress={() => {
                          setSelectedShift(subitem)
                        }}
                        time={subitem?.trim()}
                        isSelected={selectedShift === subitem}
                        key={index.toString()}
                      />
                    )
                  })
                })}
              </ScrollView>
            </View>

            <View style={styles.leftPane}>
              <View
                style={[
                  $containerHorizon,
                  { justifyContent: "space-between", marginVertical: 10, alignItems: "center" },
                ]}
              >
                <View style={{ width: 400 }}>
                  <CustomInput
                    placeholder="Search"
                    onChangeText={(text) => setForm((pre) => ({ ...pre, item_code: text }))}
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
              <View style={{ flex: 1 }}>
                <FlatList
                  style={{ flex: 1 }}
                  data={machines}
                  keyExtractor={(item, index) => index.toString()}
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
  backgroundColor: "#fff",
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
