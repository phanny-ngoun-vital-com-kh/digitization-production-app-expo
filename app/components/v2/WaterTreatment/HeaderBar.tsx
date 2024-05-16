import React from "react"
import Icon from "react-native-vector-icons/Entypo"
import DatePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker"
import { Text } from "app/components/v2"
import { Platform, TouchableOpacity } from "react-native"
import { View } from "react-native"
import styles from "../../../screens/wtp-control-screen/water-treatment-plan/styles"
import { Dropdown } from "react-native-element-dropdown"
type HeaderProps = {
  currDate: string
  showDate: boolean
  dateValue: any
  showLine: boolean
  onPressdate: () => void
  onChangeDate: (e: DateTimePickerEvent, v: Date | undefined) => void
}
const HeaderBar = ({
  currDate = "31 May , 2024",
  showDate,
  showLine = true,
  dateValue,
  onPressdate,
  onChangeDate,
}: HeaderProps) => {
  const lines = [
    { name: "line 1", value: 1 },
    { name: "line 2", value: 2 },
  ]
  return (
    <>
      <View>
        <Text semibold headline>
          Today Task
        </Text>
        <Text body1 body2>
          {currDate}
        </Text>
      </View>

      <View style={{ flexDirection: "row" }}>
        {showLine && (
          <Dropdown
            style={styles.dropdown}
            data={lines}
            labelField="name"
            valueField="value"
            placeholder="Select Line"
            placeholderStyle={{ fontSize: 14.5 }}
            // onSelect={setSelected}
            search
            value={lines}
            onChangeText={(text: any) => {
              console.log(text)
            }}
            onChange={(item) => {
              console.log(item)
            }}
          />
        )}

        <View style={{ width: 200 }}>
          <TouchableOpacity
            onPress={onPressdate}
            style={[styles.date_button, { flexDirection: "row", alignItems: "center", gap: 10 }]}
          >
            <Text style={{ marginLeft: 10 }}>{dateValue?.toDateString() || "Select Date"}</Text>

            <Icon name="chevron-down" size={22} color={"gray"} />
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

export default HeaderBar
