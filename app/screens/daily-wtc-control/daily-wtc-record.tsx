/* eslint-disable camelcase */
import React, { FC, useEffect, useLayoutEffect, useState } from "react"
import DatePicker from "@react-native-community/datetimepicker"
import { observer } from "mobx-react-lite"
import { detach } from "mobx-state-tree"
import { BaseStyle, useTheme } from "app/theme-v2"
import SelectDropdown from "react-native-select-dropdown"
import Icon from "react-native-vector-icons/Fontisto"
import { Dropdown } from "react-native-element-dropdown"
import {
  View,
  ViewStyle,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Platform,
  TextInput,
} from "react-native"
import { Text } from "app/components/v2"
import { Menu, MenuProvider, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu"
import { AppStackScreenProps } from "app/navigators"
import { ActivityIndicator, DataTable, Divider } from "react-native-paper"
import moment from "moment"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "app/models"
import { Shift, WaterPlant } from "./type"
import RightSliderModal from "app/components/v2/ModalWaterPlant"
import { Button, EmptyState } from "app/components"
import EmptyFallback from "app/components/EmptyFallback"
import ModalWaterTreatment from "app/components/v2/ModalWaterTreatment"
import {
  WaterTreatment,
  WaterTreatmentModel,
} from "app/models/water-treatment/water-treatment-model"
import data from "../../utils/dummy/water-treatment-control/index.json"
import styles from "./styles"

// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface DailyWtcRecordScreenProps extends AppStackScreenProps<"DailyWtcRecord"> {}

export const DailyWtcRecordScreen: FC<DailyWtcRecordScreenProps> = observer(
  function DailyWtcRecordScreen() {
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()

    // Pull in navigation via hook
    const watertreatment = [
      "Water Treatment Plant 2",
      "Water Treatment Plant 3",
      "Water Treatment Plant 4",
    ]
    const [wtp, setWtp] = useState([])
    const { colors } = useTheme()
    const navigation = useNavigation()
    const [showDate, setShowDate] = useState(false)
    const [date, setDate] = useState(new Date(Date.now()))
    const [selectedItem, setSelectedItem] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
      setWtp(data)
    }, [])

    const onSelectItem = (item) => {
      setSelectedItem(wtp.find((i) => i?.type === item))
    }

    const isSelectedPanel = (item) => item === selectedItem?.type

    const renderItem = ({ item, index }) => {
      return (
        <View style={[{ marginTop: 5 }, isSelectedPanel(item) && { backgroundColor: "#008DDA" }]}>
          <TouchableOpacity
            onPress={() => onSelectItem(item)}
            style={[
              $containerHorizon,
              { paddingHorizontal: 5, paddingVertical: 20, borderWidth: 0.5 },
            ]}
          >
            <Icon
              name="blood-drop"
              color={!isSelectedPanel(item) ? "#008DDA" : "white"}
              size={25}
            />
            <Text style={isSelectedPanel(item) ? { color: "white" } : { color: "black" }}>
              {item}
            </Text>
          </TouchableOpacity>
        </View>
      )
    }

    const onClickrow = () => {
      navigation.navigate("WaterTreatmentControlForm")
    }
    return (
      <View style={$root}>
        <View style={styles.container}>
          {/* <View style={$containerHorizon}>
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
                    Due Date មិនអាចក្រោយ Posting Date
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <>
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
          </> */}

          <View style={styles.leftPane}>
            <View style={{ marginBottom: 10, selectedItem }}>
              <View style={[$containerHorizon, { justifyContent: "space-between" }]}>
                <Text style={styles.textHeader}>Water Treatment</Text>
                <TouchableOpacity>
                  <Icon name="date" size={20} />
                </TouchableOpacity>
              </View>

              <Divider style={{ marginTop: 20 }} />
            </View>

            <FlatList
              data={watertreatment}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
          <View>
            <ScrollView style={styles.rightPane}>
              {loading ? (
                <View style={{ alignItems: "center", justifyContent: "center" }}>
                  <ActivityIndicator />
                </View>
              ) : selectedItem !== null ? (
                <View key={selectedItem?.id}>
                  <View style={{ flexDirection: "row", width: "88%" }} key={selectedItem?.id}>
                    <DataTable>
                      <DataTable.Row style={styles.row}>
                        <DataTable.Cell textStyle={styles.item}>
                          <Text style={styles.textTitle}>Review By: </Text>
                          <Text style={styles.textBody}>{selectedItem?.approved_by}</Text>
                        </DataTable.Cell>
                        <DataTable.Cell textStyle={styles.item}>
                          <Text style={styles.textTitle}>Checked By: </Text>
                          <Text style={styles.textBody}>{selectedItem?.approved_by}</Text>
                        </DataTable.Cell>
                        <DataTable.Cell textStyle={styles.item}>
                          <Text style={styles.textTitle}>Date: </Text>
                          <Text style={styles.textBody}>{selectedItem?.date}</Text>
                        </DataTable.Cell>
                      </DataTable.Row>
                      <DataTable.Row style={styles.row}>
                        <DataTable.Cell textStyle={styles.item}>
                          <Text style={styles.textTitle}>Created Date: </Text>
                          <Text style={styles.textBody}>
                            {moment(selectedItem?.date).format("YYYY-MM-DD")}
                          </Text>
                        </DataTable.Cell>
                        <DataTable.Cell textStyle={styles.item}>
                          <Text style={styles.textTitle}>Type: </Text>
                          <Text style={styles.textBody}>{selectedItem?.type}</Text>
                        </DataTable.Cell>
                        <DataTable.Cell textStyle={styles.item}>
                          <Text style={styles.textTitle}>Status: </Text>
                          <View
                            style={[
                              styles.dot,
                              // selectedItem.state === "completed"
                              //   ? { backgroundColor: "green" }
                              //   : selectedItem.state === "rejected"
                              //   ? { backgroundColor: "red" }
                              //   : selectedItem.state === "in-progress"
                              //   ? { backgroundColor: "#E69B00" }
                              //   : { backgroundColor: "#000" },
                            ]}
                          ></View>
                          <Text style={[styles.textBody, { textTransform: "capitalize" }]}>
                            {selectedItem?.schedules?.length >= 4 ? "Completed" : "On-Progress"}
                          </Text>
                        </DataTable.Cell>
                      </DataTable.Row>
                    </DataTable>
                  </View>
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

                    {selectedItem?.schedules?.map((item, index) => (
                      <TouchableOpacity onPress={onClickrow} key={index}>
                        <DataTable.Row style={{}} >
                          <DataTable.Cell style={{ flex: 0.3 }} textStyle={styles.textHeader}>
                            <Text>{index + 1}</Text>
                          </DataTable.Cell>
                          <DataTable.Cell style={{ flex: 0.9 }} textStyle={styles.textHeader}>
                            <Text>{item?.time}</Text>
                          </DataTable.Cell>

                          <DataTable.Cell style={{ flex: 0.8 }} textStyle={styles.textHeader}>
                            <Text style={{ textAlign: "center" }}>
                              N / A
                              {/* {selectedItem?.schedules?.length >= 4 ? "Completed" : "On-Progress"} */}
                            </Text>
                          </DataTable.Cell>
                          <DataTable.Cell style={{ flex: 0.96 }} textStyle={styles.textHeader}>
                            <Text textAlign={"center"}>{item?.remark ?? "N / A"}</Text>
                          </DataTable.Cell>
                        </DataTable.Row>
                      </TouchableOpacity>
                    ))}
                  </DataTable>
                </View>
              ) : (
                <View style={{}}>
                  <Text>No item seleted</Text>
                </View>
              )}
            </ScrollView>
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
