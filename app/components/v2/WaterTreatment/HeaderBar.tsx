import React, { useEffect, useState } from "react"
import Icon from "react-native-vector-icons/AntDesign"
import { default as SecondaryIcon } from "react-native-vector-icons/Ionicons"
import DatePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker"
import { Text } from "app/components/v2"
import { View, Platform, TextStyle, TouchableOpacity } from "react-native"
import styles from "../../../screens/wtp-control-screen/water-treatment-plan/styles"
import { Dropdown } from "react-native-element-dropdown"
import moment from "moment"
import { translate } from "../../../i18n"
import { HACCPMonitoringOzoneSystem } from "app/models/haccp-monitoring-ozone/haccp-monitoring-ozone-model"
type HeaderProps = {
  currDate: Date
  isLoading?: boolean
  showDate: boolean
  dateValue: any
  selectedLine?: string
  selectedWtp?: any
  enableWTP?: boolean
  enableHaccpOzone: boolean
  showLine: boolean
  onSelectLine?: (item: string) => void
  onSelectWtp: (item: string) => void
  onPressdate: () => void
  onChangeDate: (e: DateTimePickerEvent, v: Date | undefined) => void
  haccpOzoneData:HACCPMonitoringOzoneSystem[]
  preData:[{id:number,plant:string}]
}
const HeaderBar = ({
  currDate,
  showDate,
  showLine = true,
  enableWTP = false,
  enableHaccpOzone = false,
  dateValue,
  selectedWtp,
  selectedLine,
  onSelectLine,
  onPressdate,
  onSelectWtp,
  onChangeDate,
  isLoading = false,
  haccpOzoneData,
  preData
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
        <Text body2>
          {dateValue?.toDateString() || moment(currDate).format("LL")}

          {/* {
              clock
            } */}
        </Text>
      </View>






      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <SecondaryIcon name="filter-sharp" size={20} style={{ marginRight: 8 }} />
        <Text style={{ marginRight: 5 }}>Filter by:</Text>
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
            onChangeText={(text: any) => { }}
            onChange={(item) => {
              onSelectLine(item)
            }}
          />
        )}

        {enableWTP && (
          <Dropdown
            style={[styles.dropdown, { width: 230 }]}
            data={preData.map(r => ({ name: r.plant, value: r.plant }))}
            disable={isLoading}
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
            onChangeText={(text: any) => { }}
            onChange={(item) => {
              onSelectWtp(item)
            }}
          />
        )}

        {enableHaccpOzone && (
          <Dropdown
            style={[styles.dropdown, { width: 300 }]}
            data={haccpOzoneData}
            disable={isLoading}
            labelField="ozone"
            valueField="ozone"
            // placeholder={translate("preWaterTreatment.selectTreatment")}
            itemTextStyle={$fontSelected}
            // closeModalWhenSelectedItem
            selectedTextStyle={$fontSelected}
            placeholderStyle={$fontSelected}
            // onSelect={setSelected}

            search
            value={selectedWtp}
            onChangeText={(text: any) => { }}
            onChange={(item) => {
              onSelectWtp(item)
            }}
          />
        )}

        <View style={{ width: 200 }}>
          <TouchableOpacity
            disabled={isLoading}
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
