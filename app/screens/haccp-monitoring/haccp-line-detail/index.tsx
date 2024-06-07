import React, { FC, useEffect, useLayoutEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import Icon from "react-native-vector-icons/AntDesign"
import { DataTable, PaperProvider, Portal } from "react-native-paper"
import { FlatList, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Button, Text } from "app/components/v2"
import styles from "./styles"
import { TouchableOpacity } from "react-native-gesture-handler"
import { useNavigation, useRoute } from "@react-navigation/native"
import { $containerHorizon } from "app/screens/wtp-control-screen/water-treatment-plan"
import { useTheme } from "app/theme-v2"
import StateButton from "app/components/v2/HACCP/StateButton"
import EmptyFallback from "app/components/EmptyFallback"
import linesDummy from "../../../utils/dummy/haccp/index.json"
import AlertDialog from "app/components/v2/AlertDialog"
import { useStores } from "app/models"

interface DailyHaccpLineDetailScreenProps extends AppStackScreenProps<"DailyHaccpLineDetail"> {}

export const DailyHaccpLineDetailScreen: FC<DailyHaccpLineDetailScreenProps> = observer(
  function DailyHaccpLineDetailScreen({
    type = "2",
    onClick,
  }: {
    type: "1" | "2"
    onClick: (item: any) => void
  }) {
    const navigation = useNavigation()
    const route = useRoute().params
    const { haccpMonitoringStore } = useStores()
    const { colors } = useTheme()
    const [waterLines, setWaterLines] = useState<WaterTreatmentLine[] | []>([])
    const lineStatus = ["normal", "pending", "warning"]
    const [selectedStatus, setSelectStatus] = useState("")
    const getRouteLine = () => route?.title.split(" ")[1]
    const [visible, setVisible] = useState(false)

    const showModal = () => {
      setVisible(true)
    }
    const hideModal = () => setVisible(false)
    useLayoutEffect(() => {
      navigation.setOptions({
        title: route?.title,
        headerRight: () => (
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => {
              navigation.navigate("HaccpLineForm", { line: getRouteLine() })
            }}
          >
            <Icon name="plus" size={22} color={"#0081F8"} />
            <Text style={{ fontSize: 14 }} primaryColor semibold>
              Add New
            </Text>
          </TouchableOpacity>
        ),
      })
    }, [navigation])

    useEffect(() => {
      const all = haccpMonitoringStore.haccpMonitoringList

      const records = all.filter((line) => +line.id === +route?.id ?? 0)

      console.log(records)

      setWaterLines(records.map((record) => record.lines)[0])
    }, [navigation, route])

    const getMachineStatus = (status: any) => (status === "normal" ? "#0081F8" : "#FF0000")

    const rendertableLine1 = ({ item, index }: { item: WaterTreatmentLine; index: number }) => (
      <TouchableOpacity onPress={() => navigation.navigate("HaccpLineForm", { line: 4 })}>
        <DataTable style={{ margin: 10, marginTop: 0 }}>
          <DataTable.Row key={1}>
            <DataTable.Cell style={{ flex: 0.4 }}>{index + 1}</DataTable.Cell>
            <DataTable.Cell style={{ flex: 0.7 }}>{item.time}</DataTable.Cell>
            <DataTable.Cell style={{ flex: 0.9 }}>
              <Text style={{ marginLeft: 18 }}>{item?.side_wall}</Text>
            </DataTable.Cell>
            <DataTable.Cell style={{ flex: 1 }}>
              <Text style={{ marginLeft: 28 }}>{item?.air_pressure}</Text>
            </DataTable.Cell>

            <DataTable.Cell style={{ flex: 0.9 }}>
              <Text style={{ marginLeft: 44 }}>{item?.temp_preform}</Text>
            </DataTable.Cell>
            <DataTable.Cell style={{ flex: 0.55 }}>
              <Text style={{ marginLeft: 4 }}>{item?.FG}</Text>
            </DataTable.Cell>
            <DataTable.Cell style={{ flex: 0.9 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <View
                  style={{
                    backgroundColor: getMachineStatus(item?.status),
                    width: 15,
                    height: 15,
                    borderRadius: 100,
                  }}
                ></View>
                <Text>normal</Text>
              </View>
            </DataTable.Cell>
            <DataTable.Cell style={{ flex: 0.9 }}>{item?.assign_to ?? "N / A"}</DataTable.Cell>
          </DataTable.Row>
        </DataTable>
      </TouchableOpacity>
    )

    const rendertableLine4 = ({ item, index }: { item: WaterTreatmentLine; index: number }) => {
      return (
        <DataTable style={{ margin: 10, marginTop: 0 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("HaccpLineForm", { line: 2 })}
            activeOpacity={1} // Ensures the touchable area does not extend into the button
          >
            <View>
              <DataTable.Row key={1}>
                <DataTable.Cell style={{ flex: 0.25 }}>{index + 1}</DataTable.Cell>
                <DataTable.Cell style={{ flex: 0.5 }}>
                  <Text style={{ marginLeft: 15 }}>{item?.time}</Text>
                </DataTable.Cell>

                <DataTable.Cell style={{ flex: 0.8 }}>
                  <Text style={{ marginLeft: 70 }}>{item?.bottle_cap_rinsing?.water_pressure}</Text>
                </DataTable.Cell>
                <DataTable.Cell style={{ flex: 0.5 }}>
                  <Text style={{ marginLeft: 30 }}>{item?.bottle_cap_rinsing?.nozzies_rinser}</Text>
                </DataTable.Cell>
                <DataTable.Cell style={{ flex: 0.5 }}>
                  <Text style={{ marginLeft: 40 }}>{item?.filling_cap?.FG}</Text>
                </DataTable.Cell>
                <DataTable.Cell style={{ flex: 0.5 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <View
                      style={{
                        backgroundColor: getMachineStatus(item?.status),
                        width: 15,
                        height: 15,
                        borderRadius: 100,
                      }}
                    ></View>
                    <Text style={{ marginLeft: 5 }}>{item?.status}</Text>
                  </View>
                </DataTable.Cell>
                <DataTable.Cell style={{ flex: 0.5 }}>
                  <Text style={{ marginLeft: 8 }}>{item?.assign_to ?? "N/A"}</Text>
                </DataTable.Cell>

                <DataTable.Cell style={{ flex: 0.6 }}>
                  <Text style={{ marginRight: 0 }}> {item?.instruction} </Text>
                </DataTable.Cell>
              </DataTable.Row>
            </View>
          </TouchableOpacity>
        </DataTable>
      )
    }

    if (getRouteLine() <= 3) {
      return (
        <PaperProvider>
          <Portal>
            <View style={$root}>
              <View style={$outerContainer}>
                <View style={[$containerHorizon, { marginBottom: 20 }]}>
                  <TouchableOpacity style={{}} onPress={() => null}>
                    <Icon name="up" size={15} color={"black"} />
                    <Icon name="down" size={15} color={"black"} />
                  </TouchableOpacity>

                  <View style={[$containerHorizon, { gap: 15, marginLeft: 20 }]}>
                    {lineStatus.map((item, index) => (
                      <View key={index.toString()}>
                        <StateButton
                          onPress={() => setSelectStatus(item)}
                          isSelected={item.toLowerCase() === selectedStatus.toLowerCase()}
                          placeholder={item[0].toUpperCase() + item.slice(1)}
                          color={
                            item === "pending"
                              ? "#777777"
                              : item === "warning"
                              ? "#FF0000"
                              : colors.primary
                          }
                        />
                      </View>
                    ))}
                  </View>
                </View>
                <DataTable style={{ margin: 10, marginTop: 0 }}>
                  <DataTable.Header>
                    <DataTable.Title style={{ flex: 0.4 }} textStyle={styles.textHeader}>
                      No
                    </DataTable.Title>
                    <DataTable.Title style={{ flex: 0.7 }} textStyle={styles.textHeader}>
                      Time
                    </DataTable.Title>
                    <DataTable.Title style={{ flex: 1 }} textStyle={styles.textHeader}>
                      Water Pressure
                    </DataTable.Title>
                    <DataTable.Title style={{ flex: 0.9 }} textStyle={styles.textHeader}>
                      Nozzie Rinser
                    </DataTable.Title>

                    <DataTable.Title style={{ flex: 0.6 }} textStyle={styles.textHeader}>
                      FG
                    </DataTable.Title>
                    <DataTable.Title style={{ flex: 0.6 }} textStyle={styles.textHeader}>
                      Status
                    </DataTable.Title>
                    <DataTable.Title style={{ flex: 0.7 }} textStyle={styles.textHeader}>
                      Done by
                    </DataTable.Title>
                    <DataTable.Title style={{ flex: 0.8 }} textStyle={styles.textHeader}>
                      Instruction
                    </DataTable.Title>
                  </DataTable.Header>
                </DataTable>

                <FlatList
                  data={waterLines || []}
                  ListEmptyComponent={<EmptyFallback placeholder="No record found !!!" />}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={rendertableLine4}
                />

                {waterLines?.length ? (
                  <Button
                    style={{ position: "absolute", bottom: 50, width: "100%" }}
                    onPress={showModal}
                  >
                    <Text whiteColor body2 style={{ marginLeft: 12 }}>
                      Enroll
                    </Text>
                  </Button>
                ) : (
                  <></>
                )}
              </View>
            </View>
            <AlertDialog
              visible={visible}
              content="You're about to entroll this Line , Click confirm to accept it"
              hideDialog={hideModal}
              onPositive={hideModal}
              onNegative={() => setVisible(false)}
            />
          </Portal>
        </PaperProvider>
      )
    }
    return (
      <PaperProvider>
        <Portal>
          <View style={$root}>
            <View style={$outerContainer}>
              <View style={[$containerHorizon, { gap: 15, marginLeft: 20 }]}>
                {lineStatus.map((item, index) => (
                  <View key={index.toString()}>
                    <StateButton
                      onPress={() => setSelectStatus(item)}
                      isSelected={item.toLowerCase() === selectedStatus.toLowerCase()}
                      placeholder={item[0].toUpperCase() + item.slice(1)}
                      color={
                        item === "pending"
                          ? "#777777"
                          : item === "warning"
                          ? "#FF0000"
                          : colors.primary
                      }
                    />
                  </View>
                ))}
              </View>
              <DataTable style={{ margin: 10, marginTop: 5 }}>
                <DataTable.Header>
                  <DataTable.Title style={{ flex: 0.4 }} textStyle={styles.textHeader}>
                    No
                  </DataTable.Title>
                  <DataTable.Title style={{ flex: 0.7 }} textStyle={styles.textHeader}>
                    Time
                  </DataTable.Title>
                  <DataTable.Title style={{ flex: 0.9 }} textStyle={styles.textHeader}>
                    Side Wall
                  </DataTable.Title>
                  <DataTable.Title style={{ flex: 1 }} textStyle={styles.textHeader}>
                    Air Pressure
                  </DataTable.Title>

                  <DataTable.Title style={{ flex: 0.9 }} textStyle={styles.textHeader}>
                    Temperature
                  </DataTable.Title>
                  <DataTable.Title style={{ flex: 0.55 }} textStyle={styles.textHeader}>
                    FG
                  </DataTable.Title>
                  <DataTable.Title style={{ flex: 0.9 }} textStyle={styles.textHeader}>
                    Status
                  </DataTable.Title>
                  <DataTable.Title style={{ flex: 0.9 }} textStyle={styles.textHeader}>
                    Done by
                  </DataTable.Title>
                </DataTable.Header>
              </DataTable>

              <View>
                <FlatList
                  data={waterLines || []}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={rendertableLine1}
                  ListEmptyComponent={<EmptyFallback placeholder="No record found !!!" />}
                />
              </View>
              {waterLines?.length ? (
                <Button
                  style={{ position: "absolute", bottom: 50, width: "100%" }}
                  onPress={showModal}
                >
                  <Text whiteColor body2 style={{ marginLeft: 12 }}>
                    Enroll
                  </Text>
                </Button>
              ) : (
                <></>
              )}
            </View>
            <AlertDialog
                  content="Are you sure about that?"
                  visible={visible}
              hideDialog={hideModal}
              onPositive={hideModal}
              onNegative={() => setVisible(false)}
            />
          </View>
        </Portal>
      </PaperProvider>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
  backgroundColor: "white",
}
const $outerContainer: ViewStyle = {
  margin: 15,
  marginTop: 10,
  flex: 1,
  padding: 10,
}
