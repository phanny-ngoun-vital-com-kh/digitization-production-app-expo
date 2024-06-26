import React, { useEffect, useRef, useState } from "react"
import Icon from "react-native-vector-icons/AntDesign"
import DatePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker"
import { Text } from "app/components/v2"
import { View, Platform, TextStyle, TouchableOpacity } from "react-native"
import styles from "../../../screens/wtp-control-screen/water-treatment-plan/styles"
import { Dropdown } from "react-native-element-dropdown"
import moment from "moment"
import { translate } from "../../../i18n"
type HeaderProps = {
  currDate: Date
  showDate: boolean
  dateValue: any
  selectedLine: string
  selectedWtp: any
  enableWTP: boolean
  showLine: boolean
  onSelectLine: (item: string) => void
  onSelectWtp: (item: string) => void
  onPressdate: () => void
  onChangeDate: (e: DateTimePickerEvent, v: Date | undefined) => void
}
const HeaderBar = ({
  currDate,
  showDate,
  showLine = true,
  enableWTP = false,
  dateValue,
  selectedWtp,
  selectedLine,
  onSelectLine,
  onPressdate,
  onSelectWtp,
  onChangeDate,
}: HeaderProps) => {
  const lines = [
    { name: "line 1", value: 1 },
    { name: "line 2", value: 2 },
  ]

  const [clock, setClock] = useState("")

  const wtps = [
    {
      name: "Water Treatment Plant 2",
      value: 1,
    },
    {
      name: "Water Treatment Plant 3",
      value: 2,
    },
    {
      name: "Water Treatment Plant 4",
      value: 3,
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setClock(moment(new Date(Date.now())).format("LTS"))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <View style={{ marginLeft: 50, alignItems: "center" }}>
        <Text semibold headline>
          {/* Today Task */}

          {translate("wtpcommon.todayTask")}
        </Text>
        <Text body2>{moment(currDate).format("LL")}</Text>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {/* <Icon name="clockcircle" size={22} color={"black"} />
        <View style={{marginRight:10}}
        
        >

        </View>
        <Text semibold style={{
          color:"black"
        }}>{clock || moment(new Date(Date.now())).format("LTS")} </Text> */}
        {showLine && (
          <Dropdown
            style={styles.dropdown}
            data={lines}
            labelField="name"
            valueField="value"
            placeholder="Select Line"
            placeholderStyle={{ fontSize: 14.5 }}
            // onSelect={onSelectLine}
            search
            value={selectedLine}
            onChangeText={(text: any) => {}}
            onChange={(item) => {
              onSelectLine(item)
            }}
          />
        )}

        {enableWTP && (
          <Dropdown
            style={[styles.dropdown, { width: 230 }]}
            data={wtps}
            labelField="name"
            valueField="value"
            placeholder={translate("preWaterTreatment.selectTreatment")}
            itemTextStyle={$fontSelected}
            // closeModalWhenSelectedItem
            selectedTextStyle={$fontSelected}
            placeholderStyle={$fontSelected}
            // onSelect={setSelected}

            search
            value={selectedWtp}
            onChangeText={(text: any) => {
    
            }}
            onChange={(item) => {
              onSelectWtp(item)
            }}
          />
        )}

        <View style={{ width: 200 }}>
          <TouchableOpacity
            onPress={onPressdate}
            style={[styles.date_button, { flexDirection: "row", alignItems: "center", gap: 10 }]}
          >
            <Text style={{ marginLeft: 10 }}>{dateValue?.toDateString() || "Select Date"}</Text>

            <Icon name="down" size={19} color={"gray"} />
          </TouchableOpacity>

          {/* 
        <View style={{ width: "100%",marginTop:10 }}>
          <Text caption1 errorColor>
            សូមជ្រើសរើសកាលបរិច្ឆេទ
          </Text>
        </View> */}
          {showDate && (
            <DatePicker
              value={dateValue || new Date(Date.now())}
              mode={"date"}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              is24Hour={true}
              onChange={onChangeDate}
              style={{}}
            />
          )}
        </View>
      </View>
    </>
  )
}

const $fontSelected: TextStyle = {
  fontSize: 14,
}
export default HeaderBar
