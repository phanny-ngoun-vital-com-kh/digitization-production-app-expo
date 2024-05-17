/* eslint-disable camelcase */
import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { useTheme } from "app/theme-v2"
import { View, ViewStyle, TouchableOpacity, Platform, ScrollView } from "react-native"
import { Text } from "app/components/v2"
import { AppStackScreenProps } from "app/navigators"
import styles from "./styles"
import { Divider } from "react-native-paper"
import HeaderBar from "../../../components/v2/WaterTreatment/HeaderBar"
import TimePanel from "app/components/v2/WaterTreatment/TimePanel"
import Icon from "react-native-vector-icons/FontAwesome"
import MachinePanel from "app/components/v2/WaterTreatment/MachinePanel"
import CustomInput from "app/components/v2/DailyPreWater/CustomInput"
import { FlatList } from "react-native-gesture-handler"
import { useNavigation } from "@react-navigation/native"

interface PrewaterTreatmentScreenProps extends AppStackScreenProps<"PrewaterTreatment"> {}

export const PrewaterTreatmentScreen: FC<PrewaterTreatmentScreenProps> = observer(
  function PrewaterTreatmentScreen() {
    const navigation = useNavigation()
    const schedules = ["7:00:00", "11:00:00", "15:00:00", "19:00:00", "23:00:00", "3:00:00"]

    const inspectation_list = ["Pressure", "Air Release", "TDS", "PH", "Pressure Drop"]
    const [datePicker, setDatePicker] = useState({
      show: false,
      value: null,
    })
    const [selectedShift, setSelectedShift] = useState(null)

    const renderItem = ({ item }) => (
      <MachinePanel
        status="warning"
        machine_type={item}
        assign_to="Virek Chan"
        onPress={() => navigation.navigate("PreWaterForm2", { type: "tds" })}
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
             enableWTP ={true}
              showLine={false}
              onChangeDate={(e, v) => {
                console.log(e.nativeEvent.timestamp)

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
            <View style={styles.leftPane}>
              <ScrollView scrollEnabled>
                {schedules?.map((item, index) => (
                  <TimePanel
                    onPress={() => {
                      setSelectedShift(item)
                    }}
                    time={item?.trim()}
                    isSelected={selectedShift === item}
                    key={index?.toString()}
                  />
                ))}
              </ScrollView>
            </View>

            <View style={styles.rightPane}>
              <View
                style={[$containerHorizon, { justifyContent: "space-between",alignItems:"center"}]}
              >
                <View style={{ width: 550,marginBottom:10 }}>
                  <CustomInput
                    placeholder="Search"
                    onChangeText={(text) => setForm((pre) => ({ ...pre, item_code: text }))}
                    label=""
                    errormessage={""}
                    type="search"
                  />
                </View>
                <View style={styles.sortIcon}>
                  <TouchableOpacity style={{}}>
                    <Icon name="sort" size={20} color={"black"} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <FlatList
                  style={{ flex: 1 }}
                  data={inspectation_list}
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

const $containerHorizon: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: 5,
}

const $useflex: ViewStyle = {
  flex: 1,
}
