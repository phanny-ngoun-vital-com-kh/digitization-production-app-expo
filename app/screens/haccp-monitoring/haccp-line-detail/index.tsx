import React, { FC, useEffect, useLayoutEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import Icon from "react-native-vector-icons/AntDesign"
import { DataTable, PaperProvider, Portal } from "react-native-paper"
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
  ViewStyle,
  TouchableOpacity,
} from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Text } from "app/components/v2"
import styles from "./styles"
import { useNavigation, useRoute } from "@react-navigation/native"
import { $containerHorizon } from "app/screens/wtp-control-screen/water-treatment-plan"
import { useTheme } from "app/theme-v2"
import StateButton from "app/components/v2/HACCP/StateButton"
import EmptyFallback from "app/components/EmptyFallback"
import AlertDialog from "app/components/v2/AlertDialog"
import { useStores } from "app/models"
import { ALERT_TYPE, Dialog } from "react-native-alert-notification"
import { HaccpListType } from "app/models/haccp-monitoring/haccp-lines-model"
import moment from "moment"
import ActivityModal from "app/components/v2/ActivitylogModal"

interface DailyHaccpLineDetailScreenProps extends AppStackScreenProps<"DailyHaccpLineDetail"> {}

export const DailyHaccpLineDetailScreen: FC<DailyHaccpLineDetailScreenProps> = observer(
  function DailyHaccpLineDetailScreen() {
    const navigation = useNavigation()
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const { haccpLinesStore, authStore } = useStores()
    const route = useRoute().params
    const { colors } = useTheme()
    const [haccpLine, setHaccpline] = useState<HaccpListType[]>([])
    const [filterLines, setFilterLines] = useState<HaccpListType[]>([])
    const lineStatus = ["normal", "pending", "warning"]
    const [roles, setRoles] = useState([""])
    const [isAssign, setAssign] = useState(false)
    const [selectedStatus, setSelectStatus] = useState("all")
    const [sorting, setSorting] = useState<"desc" | "asc">("desc")
    const getRouteLine = () => route?.title.split(" ")[1]
    const [visible, setVisible] = useState(false)
    const [showActivitylog, setShowActivitylog] = useState(false)
    const showModal = () => {
      setVisible(true)
    }
    const hideModal = () => setVisible(false)

    useLayoutEffect(() => {
      setAssign(route?.assign)
      navigation.setOptions({
        title: route?.title,
        headerRight: () => (
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => {
              navigation.navigate("HaccpLineForm", {
                line: getRouteLine(),
                onRefresh: handleRefresh,
                haccp_id: route?.line?.haccp_id,
                assign: isAssign,
                isvalidDate: route?.isvalidDate,
                id: route?.id,
              })
            }}
          >
            <Icon name="plus" size={22} color={"#0081F8"} />
            <Text style={{ fontSize: 14 }} primaryColor semibold>
              Add New
            </Text>
          </TouchableOpacity>
        ),
      })
    }, [navigation, route, isAssign])

    const fetchLinesTable = async () => {
      try {
        setLoading(true)
        const result = await haccpLinesStore.getLinesById({
          assign_date: route?.line?.assign_date,
          haccp_id: route?.line?.haccp_id,
          line: route?.line?.line,
        })

        const [haccp] = result?.map((line) => line?.haccplist)
        const data = haccp.sort((a, b) => b.id - a.id)
        setHaccpline(data)
        setFilterLines(data)
      } catch (error) {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "បរាជ័យ",
          textBody: "បរាជ័យ",
          button: "បិទ",
        })
        setHaccpline([])
      } finally {
        setLoading(false)
      }
    }
    const handleRefresh = async () => {
      setSorting("desc")
      setSelectStatus("all")
      fetchLinesTable()
      route?.onRefresh()
    }

    const onEnrollTask = async () => {
      try {
        setLoading(true)
        const userinfo = await authStore.getUserInfo()
        const { login } = userinfo.data
        setVisible(false)
        setAssign((pre) => !pre)
        await haccpLinesStore.saveSelfEnroll(
          route?.id ?? "",
          route?.line?.haccp_id ?? "",
          route?.line?.line ?? "",
          [
            {
              action: login + "" + " has self assign to this line",
            },
          ],
        )
        setVisible(false)
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: "ជោគជ័យ",
          textBody: "រក្សាទុកបានជោគជ័យ",
          // button: 'close',
          autoClose: 100,
        })
        route?.onRefresh()
      } catch (error) {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "បរាជ័យ",
          textBody: "បរាជ័យ",
          button: "បិទ",
        })
        setHaccpline([])
      } finally {
        setLoading(false)
      }
    }
    const handleSorting = async () => {
      sorting === "asc" ? setSorting("desc") : setSorting("asc")
    }
    useEffect(() => {
      fetchLinesTable()
    }, [navigation, route])

    useEffect(() => {
      if (selectedStatus.toLowerCase() === "all") {
        setFilterLines(haccpLine)

        return
      }
      const filtered = haccpLine.filter(
        (line) => selectedStatus.toLowerCase() === line?.status?.toLowerCase() ?? "",
      )

      setFilterLines(filtered)

      return () => {
        setFilterLines(haccpLine)
      }
    }, [selectedStatus])
    useEffect(() => {
      if (filterLines.length) {
        sorting === "asc"
          ? setFilterLines((pre) => pre.sort((a, b) => a.id - b.id))
          : setFilterLines((pre) => pre.sort((a, b) => b.id - a.id))
      } else {
        sorting === "asc"
          ? setHaccpline((pre) => pre.sort((a, b) => a.id - b.id))
          : setHaccpline((pre) => pre.sort((a, b) => b.id - a.id))
      }
    }, [sorting])
    const getMachineStatus = (status: any) => (status === "normal" ? "#0081F8" : "#FF0000")

    const rendertableLine456 = ({ item, index }: { item: HaccpListType; index: number }) => (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("HaccpLineForm", {
            line: route?.line?.line?.split(" ")[1],
            haccp_id: item?.haccp_id,
            item: item,
            assign: isAssign,
            isvalidDate: moment(Date.now()).format("LL") === moment(item?.createdDate).format("LL"),
            onRefresh: handleRefresh,
          })
        }
      >
        <DataTable style={{ margin: 10, marginTop: 0 }}>
          <DataTable.Row key={1}>
            <DataTable.Cell style={{ flex: 0.4 }}>{index + 1}</DataTable.Cell>
            <DataTable.Cell style={{ flex: 0.7 }}>
              <Text style={{ marginRight: 15 }}>{moment(item.time).format("LTS")}</Text>
            </DataTable.Cell>
            <DataTable.Cell style={{ flex: 0.9 }}>
              <Text style={{ marginLeft: 18 }}>{item?.side_wall ?? "N/A"} % </Text>
            </DataTable.Cell>
            <DataTable.Cell style={{ flex: 1 }}>
              <Text style={{ marginLeft: 20 }}>{item?.air_pressure ?? "N/A"} bar </Text>
            </DataTable.Cell>
            <DataTable.Cell style={{ flex: 0.55 }}>
              <Text style={{ marginRight: 10 }}>
                {item?.treated_water_pressure ?? "N/A"} bar/flow
              </Text>
            </DataTable.Cell>

            <DataTable.Cell style={{ flex: 0.9 }}>
              <Text style={{ marginLeft: 44 }}>{item?.temperature_preform ?? "N/A"} ℃</Text>
            </DataTable.Cell>
            <DataTable.Cell style={{ flex: 0.55 }}>
              <Text style={{ marginRight: 20 }}>{item?.fg ?? "N/A"} ppm</Text>
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
                <Text semibold errorColor={item?.status === "warning"} primaryColor caption1>
                  {item?.status === "normal"
                    ? "Normal"
                    : item?.status === "warning"
                    ? item?.warning_count + " warnings"
                    : "Pending"}
                </Text>
              </View>
            </DataTable.Cell>
            <DataTable.Cell style={{ flex: 0.9 }}>
              <Text style={{ marginLeft: 20 }}>{item?.done_by ?? "N / A"}</Text>
            </DataTable.Cell>
          </DataTable.Row>
        </DataTable>
      </TouchableOpacity>
    )

    const rendertableLine23 = ({ item, index }: { item: HaccpListType; index: number }) => {
      return (
        <DataTable style={{ margin: 10, marginTop: 0 }}>
          <TouchableOpacity
            activeOpacity={0.25}
            onPress={() =>
              navigation.navigate("HaccpLineForm", {
                line: route?.line?.line?.split(" ")[1],
                haccp_id: item?.haccp_id,
                item: item,
                assign: isAssign,
                isvalidDate:
                  moment(Date.now()).format("LL") === moment(item?.createdDate).format("LL"),
                onRefresh: handleRefresh,
              })
            }
          >
            <View>
              <DataTable.Row key={1}>
                <DataTable.Cell style={{ flex: 0.25 }}>{index + 1}</DataTable.Cell>
                <DataTable.Cell style={{ flex: 0.5 }}>
                  <Text style={{ marginLeft: 15 }}>{moment(item?.time).format("LTS")}</Text>
                </DataTable.Cell>

                <DataTable.Cell style={{ flex: 0.8 }}>
                  <Text style={{ marginLeft: 70 }}>{item?.water_pressure ?? "N/A"}</Text>
                </DataTable.Cell>
                <DataTable.Cell style={{ flex: 0.5 }}>
                  <Text style={{ marginLeft: 30 }}>{item?.nozzles_rinser ?? "N/A"}</Text>
                </DataTable.Cell>
                <DataTable.Cell style={{ flex: 0.5 }}>
                  <Text style={{ marginLeft: 40 }}>{item?.fg ?? "N/A"}</Text>
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
                    <Text
                      style={{ marginLeft: 5 }}
                      errorColor={item?.status === "warning"}
                      primaryColor
                      semibold
                      caption1
                    >
                      {item?.status === "normal"
                        ? "Normal"
                        : item?.status === "warning"
                        ? item?.warning_count + " warnings"
                        : "Pending"}
                    </Text>
                  </View>
                </DataTable.Cell>
                <DataTable.Cell style={{ flex: 0.5 }}>
                  <Text style={{ marginLeft: 8 }}>{item?.done_by ?? "N/A"}</Text>
                </DataTable.Cell>

                <DataTable.Cell style={{ flex: 0.6 }}>
                  <Text style={{ marginRight: 0 }}> {item?.take_action ?? "N/A"} </Text>
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
                  <TouchableOpacity style={{}} onPress={handleSorting}>
                    <Icon name="up" size={15} color={"black"} />
                    <Icon name="down" size={15} color={"black"} />
                  </TouchableOpacity>

                  <View style={[$containerHorizon, { gap: 15, marginLeft: 20 }]}>
                    <StateButton
                      onPress={() => setSelectStatus("all")}
                      isSelected={selectedStatus?.toLowerCase() === "all"}
                      placeholder={"All"}
                      color={"green"}
                    />
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

                    {!route?.isvalidDate ? (
                      <StateButton
                        disabled
                        isSelected={true}
                        placeholder={"Shift has Ended"}
                        color={"#D32600"}
                      />
                    ) : (
                      <StateButton
                        onPress={showModal}
                        isSelected={selectedStatus?.toLowerCase() === "all"}
                        placeholder={isAssign ? "Unassign my task" : "Enroll this task"}
                        color={isAssign ? "#D32600" : "#0081F8"}
                      />
                    )}
                    <StateButton
                      onPress={() => {
                        setShowActivitylog(true)
                        console.log('true')
                        setRoles(route?.line?.assign_to?.split(" "))
                      }}
                      isSelected={true}
                      placeholder={"View Assignment"}
                      color={"#0081F8"}
                    />
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
                {loading ? (
                  <ActivityIndicator color={colors.primary} size={40} />
                ) : (
                  <FlatList
                    data={filterLines || haccpLine}
                    refreshControl={
                      <RefreshControl
                        colors={["#0081F8"]}
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                      />
                    }
                    ListEmptyComponent={<EmptyFallback placeholder="No record found !!!" />}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={rendertableLine23}
                  />
                )}
              </View>
            </View>
            <ActivityModal
            title="Users"
            type="roles"
            log={roles}
            isVisible={showActivitylog}
            onClose={() => {
              setShowActivitylog(false)
            }}
          />
            <AlertDialog
              visible={visible}
              content={
                isAssign
                  ? "You're about to unassign your task , Click confirm to accept it"
                  : "You're about to entroll this Line , Click confirm to accept it"
              }
              hideDialog={hideModal}
              onPositive={onEnrollTask}
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
                <TouchableOpacity style={{}} onPress={handleSorting}>
                  <Icon name="up" size={15} color={"black"} />
                  <Icon name="down" size={15} color={"black"} />
                </TouchableOpacity>
                <StateButton
                  onPress={() => setSelectStatus("all")}
                  isSelected={selectedStatus?.toLowerCase() === "all"}
                  placeholder={"All"}
                  color={"green"}
                />
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
                {!route?.isvalidDate ? (
                  <StateButton
                    disabled
                    isSelected={true}
                    placeholder={"Shift has Ended"}
                    color={"#D32600"}
                  />
                ) : (
                  <StateButton
                    onPress={showModal}
                    isSelected={selectedStatus?.toLowerCase() === "all"}
                    placeholder={isAssign ? "Unassign my task" : "Enroll this task"}
                    color={isAssign ? "#D32600" : "#0081F8"}
                  />
                )}

                <StateButton
                  onPress={() => {
                    setShowActivitylog(true)
                    setRoles(route?.line?.assign_to?.split(" "))
                  }}
                  isSelected={selectedStatus?.toLowerCase() === "all"}
                  placeholder={"View Assignment"}
                  color={"#0081F8"}
                />
              </View>
              <DataTable style={{ margin: 10, marginTop: 5 }}>
                <DataTable.Header>
                  <DataTable.Title style={{ flex: 0.5 }} textStyle={styles.textHeader}>
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
                    Treated Water
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
                {loading ? (
                  <ActivityIndicator color={colors.primary} size={40} />
                ) : (
                  <FlatList
                    data={filterLines || haccpLine}
                    refreshControl={
                      <RefreshControl
                        colors={["#0081F8"]}
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                      />
                    }
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={rendertableLine456}
                    ListEmptyComponent={<EmptyFallback placeholder="No record found !!!" />}
                  />
                )}
              </View>
            </View>
            <AlertDialog
              visible={visible}
              content={
                isAssign
                  ? "You're about to unassign your task , Click confirm to accept it"
                  : "You're about to entroll this Line , Click confirm to accept it"
              }
              hideDialog={hideModal}
              onPositive={onEnrollTask}
              onNegative={() => setVisible(false)}
            />
          </View>
          <ActivityModal
            title="Users"
            type="roles"
            log={roles}
            isVisible={showActivitylog}
            onClose={() => {
              setShowActivitylog(false)
            }}
          />
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
