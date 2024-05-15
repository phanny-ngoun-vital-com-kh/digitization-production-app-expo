import React, { FC, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { ScrollView, TouchableOpacity, View, ViewStyle } from "react-native"
import { ActivityIndicator, DataTable, Divider } from "react-native-paper"
import DatePicker from "@react-native-community/datetimepicker"
import { AppStackScreenProps } from "app/navigators"
import { Text } from "app/components/v2"
import { Dropdown } from "react-native-element-dropdown"
import styles from "./styles"
import { Button, EmptyState } from "app/components"
import { Platform } from "react-native"
import SelectionDropDown from "app/components/SelectionDropDown"
import SelectDropdown from "react-native-select-dropdown"
import ModalDailyPreWater from "app/components/v2/DailyPreWaterModal"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface WaterTreatmentControlFormScreenProps
  extends AppStackScreenProps<"WaterTreatmentControlForm"> {}

const WaterTreatmentControlFormScreen: FC<WaterTreatmentControlFormScreenProps> = observer(
  function WaterTreatmentControlFormScreen() {
    const dropmenu_one = useRef<SelectDropdown>(null)
    const [form, setForm] = useState()
    const [showDate, setShowDate] = useState(false)
    const [date, setDate] = useState(new Date(Date.now()))

    const [visible, setVisible] = useState(false)
    const watertreatment = [
      { id: "1", name: "Water Treatment Plant 2" },
      { id: "2", name: "Water Treatment Plant 3" },
      { id: "3", name: "Water Treatment Plant 4" },
    ]

    const onClickRow = () => {

      
    }
    return (
      <View style={$root}>
        <View style={$outerContainer}>
          <View style={$containerHorizon}>
            <View style={{ width: "50%", marginRight: 2.5 }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ margin: 5, color: "red", fontSize: 18 }}>*</Text>
                <Text style={{ margin: 5, fontSize: 18 }}> Date</Text>
              </View>
              <View style={{}}>
                <TouchableOpacity onPress={() => setShowDate(true)} style={styles.date_button}>
                  <Text style={{ marginLeft: 10 }}>{date.toDateString() ?? "Show Picker"}</Text>
                </TouchableOpacity>

                <View style={{ width: "100%" }}>
                  <Text caption1 errorColor>
                    សូមជ្រើសរើសកាលបរិច្ឆេទ
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ width: "50%", marginRight: 2.5 }}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ margin: 5, color: "red", fontSize: 18 }}>*</Text>
                <Text style={{ margin: 5, fontSize: 18 }}> Water Treatment Type</Text>
              </View>
              <Dropdown
                style={styles.dropdown}
                data={watertreatment}
                labelField="name"
                valueField="name"
                placeholder="Select Type"
                // onSelect={setSelected}

                value={watertreatment}
                onChange={(item) => {
                  // console.log(item)
                  // console.log(item.title)
                  // setSelected(item.title);
                }}
              />

              <View style={{ width: "100%" }}>
                <Text caption1 errorColor>
                  សូមជ្រើសរើស type
                </Text>
              </View>
            </View>
          </View>

          {showDate && (
            <DatePicker
              value={date}
              mode={"date"}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              is24Hour={true}
              onChange={(e, v) => {
                setDate(v)
                setShowDate(false)
              }}
              style={{}}
            />
          )}
          <Button style={{ backgroundColor: "#378CE7", marginTop: 20 }} onPress={() => {setVisible(true)}}>
            <Text style={{ color: "white" }}> Add Time</Text>
          </Button>
          <ScrollView style={styles.rightPane}>
            <View>
              <DataTable style={{ marginTop: "2%" }}>
                <DataTable.Header>
                  <DataTable.Title style={{ flex: 0.3 }} textStyle={styles.textHeader}>
                    No
                  </DataTable.Title>
                  <DataTable.Title style={{ flex: 0.9 }} textStyle={styles.textHeader}>
                    Time
                  </DataTable.Title>
                  <DataTable.Title style={{ flex: 0.8 }} textStyle={styles.textHeader}>
                    Progress
                  </DataTable.Title>
                  <DataTable.Title style={{ flex: 0.95 }} textStyle={styles.textHeader}>
                    Remark
                  </DataTable.Title>
                </DataTable.Header>

                {[1, 2, 3, 5].map((item, index) => (
                  <TouchableOpacity onPress={onClickRow} key={index}>
                    <DataTable.Row style={{}}>
                      <DataTable.Cell style={{ flex: 0.3 }} textStyle={styles.textHeader}>
                        <Text>{index + 1}</Text>
                      </DataTable.Cell>
                      <DataTable.Cell style={{ flex: 0.9 }} textStyle={styles.textHeader}>
                        <Text>7:00</Text>
                      </DataTable.Cell>

                      <DataTable.Cell style={{ flex: 0.8 }} textStyle={styles.textHeader}>
                        <Text style={{ textAlign: "center" }}>N / A</Text>
                      </DataTable.Cell>
                      <DataTable.Cell style={{ flex: 0.96 }} textStyle={styles.textHeader}>
                        <Text style={{ textAlign: "center" }}>N / A</Text>
                      </DataTable.Cell>
                    </DataTable.Row>
                  </TouchableOpacity>
                ))}
              </DataTable>
            </View>
          </ScrollView>
          <ModalDailyPreWater
            isVisible={visible}
            onClose={() => {
              setVisible(false)
            }}
            handleAddItem={(item: any) => {}}
            textChange={(text) => {}}
            data={[]}
            // onAddPress={(item) => setListItem([...new Set([...listItem, item])])}
            onAddPress={(item) => {}}
          />
        </View>
      </View>
    )
  },
)
export default WaterTreatmentControlFormScreen
const $root: ViewStyle = {
  flex: 1,
  backgroundColor: "#fff",
}

const $outerContainer: ViewStyle = {
  margin: 15,
  marginTop: 20,
  padding: 0,
}

const $containerHorizon: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: 5,
}

const $useflex: ViewStyle = {
  flex: 1,
}
