import React from "react"
import Icon from "react-native-vector-icons/Entypo"
import DatePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker"
import { Text } from "app/components/v2"
import { View, Platform, TextStyle, TouchableOpacity } from "react-native"
import styles from "../../../screens/wtp-control-screen/water-treatment-plan/styles"
import { Dropdown } from "react-native-element-dropdown"
import moment from "moment"
type HeaderProps = {
  currDate: Date
  showDate: boolean
  dateValue: any
  enableWTP: boolean
  showLine: boolean
  onPressdate: () => void
  onChangeDate: (e: DateTimePickerEvent, v: Date | undefined) => void
}
const HeaderBar = ({
  currDate ,
  showDate,
  showLine = true,
  enableWTP = false,
  dateValue,
  onPressdate,
  onChangeDate,
}: HeaderProps) => {
  const lines = [
    { name: "line 1", value: 1 },
    { name: "line 2", value: 2 },
  ]
  const wtps = [
    {
      name: "Water Treatment plant 2",
      value: 1,
    },
    {
      name: "Water Treatment plant 3",
      value: 2,
    },
    {
      name: "Water Treatment plant 4",
      value: 3,
    },
  ]
  return (
    <>
      <View style={{ marginLeft: 50, alignItems: "center" }}>
        <Text semibold headline>
          Today Task
        </Text>
        <Text body1 body2>

        
          {moment(currDate).format('LL')}
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
        {enableWTP && (
          <Dropdown
            style={[styles.dropdown, { width: 230 }]}
            data={wtps}
            labelField="name"
            valueField="value"
            placeholder="Select Water Treatment"
            mode="default"
            itemTextStyle={$fontSelected}
            confirmSelectItem 
            closeModalWhenSelectedItem
            selectedTextStyle ={$fontSelected}
            placeholderStyle={$fontSelected}
            // onSelect={setSelected}
            search
            value={wtps}
            onChangeText={(text: any) => {
              console.log(text)
            }}
            onChange={(item) => {
              console.log(item)
            }}
          />
        )}
      </View>
    </>
  )
}


const $fontSelected : TextStyle= {
  fontSize:14
}
export default HeaderBar
