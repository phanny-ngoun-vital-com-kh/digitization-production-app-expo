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
import { translate } from "../../../i18n"
import BadgeWarning from "app/components/v2/Badgewarn"
import IconAntDesign from "react-native-vector-icons/AntDesign"
import { cleanTimeCurrent, getCurrentTime } from "app/utils-v2/getCurrTime"

interface DailyHaccpLineDetailScreenProps extends AppStackScreenProps<"DailyHaccpLineDetail"> { }

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
    const lineStatus = ["normal", "warning"]
    const [roles, setRoles] = useState([""])
    const [isAssign, setAssign] = useState(false)
    const [selectedStatus, setSelectStatus] = useState("all")
    const [sorting, setSorting] = useState<"desc" | "asc">("desc")
    const getRouteLine = () => route?.title.split(" ")[1]
    const [visible, setVisible] = useState(false)
    const [showActivitylog, setShowActivitylog] = useState(false)
    const [isEdit, setIsEdit] = useState()
    const showModal = () => {
      setVisible(true)
    }
    const hideModal = () => setVisible(false)

    useEffect(() => {
      const role = async () => {
        try {
          const rs = await authStore.getUserInfo();
          const admin = rs.data.authorities.includes('ROLE_PROD_PRO_ADMIN')
          const adminWTP = rs.data.authorities.includes('ROLE_PROD_WTP_ADMIN')
          const edit = (route?.isvalidDate || route?.assign) || admin || adminWTP
          setIsEdit(edit)
          // Modify the list based on the user's role
          // setGetRole(rs)
        } catch (e) {
          console.log(e);
        }
      };
      role();
    }, []);

    useLayoutEffect(() => {
      navigation.setOptions({
        title: route?.title,
        // headerRight: () =>
        //   (isEdit) ? (
        //     <TouchableOpacity
        //       style={{ flexDirection: "row", alignItems: "center" }}
        //       onPress={() => {
        //         navigation.navigate("HaccpLineForm", {
        //           line: getRouteLine(),
        //           onRefresh: handleRefresh,
        //           haccp_id: route?.line?.haccp_id,
        //           assign: isAssign,
        //           isvalidDate: route?.isvalidDate,
        //           id: route?.id,
        //         })
        //       }}
        //     >
        //       <Icon name="plus" size={25} color={"#0081F8"} />
        //       <Text style={{ fontSize: 16, color: "#0081F8" }} semibold >


        //         {
        //           translate("haccpMonitoring.addNew")
        //         }

        //       </Text>
        //     </TouchableOpacity>

        //   ) : (
        //     <View style={[$containerHorizon, { gap: 5 }]}>
        //       {
        //         !route?.isvalidDate && <Icon name="close" size={20} color={"#FF0000"} />

        //       }

        //       <Text errorColor semibold>

        //         {
        //           !route?.isvalidDate && translate("haccpMonitoring.shiftEnded")




        //         }

        //       </Text>
        //     </View>
        //   ),
      })
    }, [navigation, route, isAssign, isEdit])

    const fetchLinesTable = async () => {
      try {
        setLoading(true)
        const result = await haccpLinesStore.getLinesById({
          assign_date: route?.line?.assign_date,
          haccp_id: route?.line?.haccp_id,
          line: route?.line?.line,
        })

        const [haccp] = result?.map((line) => line?.haccplist)
        // const data = haccp.sort((a, b) => b.id - a.id)
        setHaccpline(haccp)
        setFilterLines(haccp)
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
        setAssign(!isAssign)

        const userinfo = await authStore.getUserInfo()
        const { login } = userinfo.data
        setVisible(false)

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
        // Dialog.show({
        //   type: ALERT_TYPE.SUCCESS,
        //   title: "ជោគជ័យ",
        //   textBody: "រក្សាទុកបានជោគជ័យ",

        //   autoClose: 100,
        // })
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
    useEffect(() => {
      setAssign(route?.assign)
    }, [route])
    const getMachineStatus = (status: any) => (status === "normal" ? "#0081F8" : status === 'pending' ? colors.primary : "#FF0000")
    const getStatusInKhmer = (status: string) => {
      switch (status) {
        case "Normal":
          return translate("haccpMonitoring.normal")
        // case "Pending":
        //   return translate("haccpMonitoring.pending")
        case "Warning":
          return translate("haccpMonitoring.warning")
        default:
          return translate("haccpMonitoring.normal")
      }
    }

    const timeRanges = {
      "07:00": "09:00",
      "09:00": "11:00",
      "11:00": "13:00",
      "13:00": "15:00",
      "15:00": "17:00",
      "17:00": "19:00",
      "19:00": "21:00",
      "21:00": "23:00",
      "23:00": "01:00",
      "03:00": "05:00"
    };

    const isValidShift = (startTime: any) => {
      const cleanedStartTime = cleanTimeCurrent(startTime);
      const cleanedEndTime = timeRanges[cleanedStartTime];

      if (!cleanedEndTime) {
        throw new Error('Invalid start time provided.');
      }

      const currentTime = getCurrentTime();
      const isAfterStartTime = currentTime >= cleanedStartTime;
      const isBeforeEndTime = currentTime <= cleanedEndTime;

      // Handle time wrapping (e.g., 23:00 to 03:00)
      const isValid = cleanedStartTime > cleanedEndTime
        ? (currentTime >= cleanedStartTime || currentTime <= cleanedEndTime)
        : isAfterStartTime && isBeforeEndTime;

      return isValid;
    };

    const rendertableLine456 = ({ item, index }: { item: HaccpListType; index: number }) => (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("HaccpLineForm", {
            line: route?.line?.line?.split(" ")[1],
            haccp_id: item?.haccp_id,
            item: item,

            assign: isAssign,
            isvalidDate: moment(Date.now()).format("LL") === moment(item?.createdDate).format("LL"),
            isValidTime: isValidShift(item.time),
            onRefresh: handleRefresh,
          })
        }
      >
        <DataTable style={{ margin: 10, marginTop: 0 }}>
          <DataTable.Row key={1}>
            <DataTable.Cell style={{ flex: 0.25 }}>{index + 1}</DataTable.Cell>
            <DataTable.Cell style={{ flex: 0.7 }}>
              <Text primaryColor>{(item.time)}</Text>
            </DataTable.Cell>
            <DataTable.Cell style={{ flex: 0.8 }}>
              <Text>{item?.side_wall ? `${item?.side_wall} %` : '-'}</Text>
            </DataTable.Cell>
            <DataTable.Cell style={{ flex: 0.7 }}>
              <Text>{item?.air_pressure ? `${item?.air_pressure} bar` : '-'} </Text>
            </DataTable.Cell>
            <DataTable.Cell style={{ flex: 0.7 }}>
              <Text>{item?.temperature_preform ? `${item?.temperature_preform} ℃` : '-'}</Text>
            </DataTable.Cell>
            <DataTable.Cell style={{ flex: 0.7 }}>
              <Text>{item?.treated_water_pressure ? `${item?.treated_water_pressure} bar/flow` : '-'}</Text>
            </DataTable.Cell>
            <DataTable.Cell style={{ flex: 0.7 }}>
              <Text>{item?.fg ? `${item?.fg} ppm` : '-'}</Text>
            </DataTable.Cell>
            <DataTable.Cell style={{ flex: 0.7 }}>
              <Text>{item?.activity_control == 1 ? (
                <>
                  Under Control <IconAntDesign name="check" color={"green"} size={15} />
                </>
              ) : item?.activity_control == 0 ?
                (
                  <>
                    Over Control <IconAntDesign name="close" color={"red"} size={15} />
                  </>
                )
                : "-"}
              </Text>
            </DataTable.Cell>
            <DataTable.Cell style={{ flex: 0.7 }}>
              <Text> {item?.take_action !== '' ? item?.take_action : '-'} </Text>            </DataTable.Cell>
            <DataTable.Cell style={{ flex: 0.5 }}>
              <Text>{item?.done_by ?? "-"}</Text>
            </DataTable.Cell>
            <DataTable.Cell style={{ flex: 0.5 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <View
                  style={{
                    backgroundColor: getMachineStatus(item?.status),
                    width: 10,
                    height: 10,
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
                isValidTime: isValidShift(item.time),
                onRefresh: handleRefresh,
              })
            }
          >
            <View>
              <DataTable.Row key={1}>
                <DataTable.Cell style={{ flex: 0.25 }}>{index + 1}</DataTable.Cell>
                <DataTable.Cell style={{ flex: 0.5 }}>
                  <Text primaryColor>{(item.time)}</Text>
                </DataTable.Cell>

                <DataTable.Cell style={{ flex: 0.6 }}>
                  <Text>{item?.water_pressure ? `${item?.water_pressure} bar` : '-'}</Text>
                </DataTable.Cell>
                <DataTable.Cell style={{ flex: 0.5 }}>
                  <Text>{(item?.nozzles_rinser) == '1' ? <IconAntDesign name="check" color={"green"} size={15} /> : item?.nozzles_rinser == '0' ? <IconAntDesign name="close" color={"red"} size={15} /> : "-"}</Text>
                </DataTable.Cell>
                <DataTable.Cell style={{ flex: 0.5 }}>
                  <Text>{item?.fg ? `${item?.fg} ppm` : '-'}</Text>
                </DataTable.Cell>
                <DataTable.Cell style={{ flex: 0.5 }}>
                  <Text>{item?.smell == 1 ? <IconAntDesign name="check" color={"green"} size={15} /> : item?.smell == 0 ? <IconAntDesign name="close" color={"red"} size={15} /> : "-"}</Text>
                </DataTable.Cell>
                <DataTable.Cell style={{ flex: 0.9 }}>
                  <Text>{item?.activity_control == 1 ? (
                    <>
                      Under Control <IconAntDesign name="check" color={"green"} size={15} />
                    </>
                  ) : item?.activity_control == 0 ?
                    (
                      <>
                        Over Control <IconAntDesign name="close" color={"red"} size={15} />
                      </>
                    )
                    : "-"}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell style={{ flex: 0.6 }}>
                  <Text> {item?.take_action !== '' ? item?.take_action : '-'} </Text>                </DataTable.Cell>
                <DataTable.Cell style={{ flex: 0.5 }}>
                  <Text>{item?.done_by ?? "-"}</Text>
                </DataTable.Cell>
                {route?.title == 'Line 3' ?
                  <DataTable.Cell style={{ flex: 0.5 }}>
                    <Text>{item?.opo ?? "-"}</Text>
                  </DataTable.Cell>
                  : <></>}
                <DataTable.Cell style={{ flex: 0.5 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <View
                      style={{
                        backgroundColor: getMachineStatus(item?.status),
                        width: 10,
                        height: 10,
                        borderRadius: 100,
                      }}
                    >


                    </View>
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


              </DataTable.Row>
            </View>
          </TouchableOpacity>
        </DataTable>
      )
    }

    const rendertableLineBarrel = ({ item, index }: { item: HaccpListType; index: number }) => {
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
                isValidTime: isValidShift(item.time),
                onRefresh: handleRefresh,
              })
            }
          >
            <View>
              <DataTable.Row key={1}>
                <DataTable.Cell style={{ flex: 0.25 }}>{index + 1}</DataTable.Cell>
                <DataTable.Cell style={{ flex: 0.5 }}>
                  <Text primaryColor>{(item.time)}</Text>
                </DataTable.Cell>
                <DataTable.Cell style={{ flex: 0.5 }}>
                  <Text>{item?.uv_lamp ?? '-'}</Text>
                </DataTable.Cell>
                <DataTable.Cell style={{ flex: 0.5 }}>
                  <Text>{item?.temperature ? `${item?.temperature} °C` : '-'}</Text>
                </DataTable.Cell>
                <DataTable.Cell style={{ flex: 0.6 }}>
                  <Text>{item?.water_pressure ? `${item?.water_pressure} bar` : '-'}</Text>
                </DataTable.Cell>

                <DataTable.Cell style={{ flex: 0.5 }}>
                  <Text>{item?.fg ? `${item?.fg} ppm` : '-'}</Text>
                </DataTable.Cell>

                <DataTable.Cell style={{ flex: 0.9 }}>
                  <Text>{item?.activity_control == 1 ? (
                    <>
                      Under Control <IconAntDesign name="check" color={"green"} size={15} />
                    </>
                  ) : item?.activity_control == 0 ?
                    (
                      <>
                        Over Control <IconAntDesign name="close" color={"red"} size={15} />
                      </>
                    )
                    : "-"}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell style={{ flex: 0.6 }}>
                  <Text> {item?.take_action !== '' ? item?.take_action : '-'} </Text>                </DataTable.Cell>
                <DataTable.Cell style={{ flex: 0.5 }}>
                  <Text>{item?.done_by ?? "-"}</Text>
                </DataTable.Cell>
                {route?.title == 'Line 3' ?
                  <DataTable.Cell style={{ flex: 0.5 }}>
                    <Text>{item?.opo ?? "-"}</Text>
                  </DataTable.Cell>
                  : <></>}
                <DataTable.Cell style={{ flex: 0.5 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <View
                      style={{
                        backgroundColor: getMachineStatus(item?.status),
                        width: 10,
                        height: 10,
                        borderRadius: 100,
                      }}
                    >


                    </View>
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
                <View
                  style={[$containerHorizon, { marginBottom: 20, justifyContent: "space-between" }]}
                >
                  <View style={[$containerHorizon, { gap: 25, marginLeft: 20 }]}>
                    <TouchableOpacity onPress={handleSorting}>
                      <Icon name="up" size={15} color={"black"} />
                      <Icon name="down" size={15} color={"black"} />
                    </TouchableOpacity>
                    <StateButton
                      onPress={() => setSelectStatus("all")}
                      isSelected={selectedStatus?.toLowerCase() === "all"}
                      placeholder={translate("wtpcommon.all")}
                      color={"green"}
                    />
                    {lineStatus.map((item, index) => (
                      <View key={index.toString()}>
                        <StateButton
                          onPress={() => setSelectStatus(item)}
                          isSelected={item.toLowerCase() === selectedStatus.toLowerCase()}
                          // placeholder={item[0].toUpperCase() + item.slice(1)}
                          placeholder={getStatusInKhmer(item[0].toUpperCase() + item.slice(1))}
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
                  <View style={{ gap: 10 }}>
                    {!route?.isvalidDate ? (
                      <></>
                    ) : (
                      <StateButton
                        onPress={showModal}
                        isSelected={selectedStatus?.toLowerCase() === "all"}
                        placeholder={
                          isAssign
                            ? translate("wtpcommon.unassignMyTask")
                            : translate("wtpcommon.enrollMyTask")
                        }
                        color={isAssign ? "#D32600" : "#0081F8"}
                      >
                        <Icon color={"white"} size={20} name="close" />
                      </StateButton>
                    )}
                    <StateButton
                      onPress={() => {
                        setShowActivitylog(true)

                        setRoles(route?.line?.assign_to?.split(" "))
                      }}
                      isSelected={true}
                      placeholder={translate("wtpcommon.viewAssignment")}
                      color={"#0081F8"}
                    >
                      <Icon color={"white"} size={20} name="search1" />
                    </StateButton>
                  </View>
                </View>
                <DataTable style={{ margin: 10, marginTop: 0 }}>
                  <DataTable.Header>
                    <DataTable.Title style={{ flex: 0.25 }} textStyle={styles.textHeader}>
                      No
                    </DataTable.Title>
                    <DataTable.Title style={{ flex: 0.5 }} textStyle={styles.textHeader}>
                      Time
                    </DataTable.Title>
                    <DataTable.Title style={{ flex: 0.6 }} textStyle={styles.textHeader}>
                      Water Pressure
                    </DataTable.Title>
                    <DataTable.Title style={{ flex: 0.5 }} textStyle={styles.textHeader}>
                      Nozzie Rinser
                    </DataTable.Title>

                    <DataTable.Title style={{ flex: 0.5 }} textStyle={styles.textHeader}>
                      FG
                    </DataTable.Title>
                    <DataTable.Title style={{ flex: 0.5 }} textStyle={styles.textHeader}>
                      Smell
                    </DataTable.Title>
                    <DataTable.Title style={{ flex: 0.9 }} textStyle={styles.textHeader}>
                      Control
                    </DataTable.Title>
                    <DataTable.Title style={{ flex: 0.6 }} textStyle={styles.textHeader}>
                      Take Action
                    </DataTable.Title>
                    <DataTable.Title style={{ flex: 0.5 }} textStyle={styles.textHeader}>
                      Done by
                    </DataTable.Title>
                    {route?.title == 'Line 3' ?
                      <DataTable.Title style={{ flex: 0.5 }} textStyle={styles.textHeader}>
                        OPO
                      </DataTable.Title>
                      : <></>}
                    <DataTable.Title style={{ flex: 0.5 }} textStyle={styles.textHeader}>
                      Status
                    </DataTable.Title>

                  </DataTable.Header>
                </DataTable>

                <FlatList
                  data={filterLines || haccpLine}
                  refreshControl={
                    <RefreshControl
                      colors={["#0081F8"]}
                      refreshing={loading}
                      onRefresh={handleRefresh}
                    />
                  }
                  ListEmptyComponent={
                    <EmptyFallback placeholder={translate("wtpcommon.noRecordFound")} />
                  }
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={rendertableLine23}
                />
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
                  ? translate("haccpMonitoring.positive")
                  : translate("haccpMonitoring.negative")
              }
              hideDialog={hideModal}
              onPositive={onEnrollTask}
              onNegative={() => setVisible(false)}
            />
          </Portal>
        </PaperProvider>
      )
    }

    if (getRouteLine() == 'Barrel') {
      return (
        <PaperProvider>
          <Portal>
            <View style={$root}>
              <View style={$outerContainer}>
                <View
                  style={[$containerHorizon, { marginBottom: 20, justifyContent: "space-between" }]}
                >
                  <View style={[$containerHorizon, { gap: 25, marginLeft: 20 }]}>
                    <TouchableOpacity onPress={handleSorting}>
                      <Icon name="up" size={15} color={"black"} />
                      <Icon name="down" size={15} color={"black"} />
                    </TouchableOpacity>
                    <StateButton
                      onPress={() => setSelectStatus("all")}
                      isSelected={selectedStatus?.toLowerCase() === "all"}
                      placeholder={translate("wtpcommon.all")}
                      color={"green"}
                    />
                    {lineStatus.map((item, index) => (
                      <View key={index.toString()}>
                        <StateButton
                          onPress={() => setSelectStatus(item)}
                          isSelected={item.toLowerCase() === selectedStatus.toLowerCase()}
                          // placeholder={item[0].toUpperCase() + item.slice(1)}
                          placeholder={getStatusInKhmer(item[0].toUpperCase() + item.slice(1))}
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
                  <View style={{ gap: 10 }}>
                    {!route?.isvalidDate ? (
                      <></>
                    ) : (
                      <StateButton
                        onPress={showModal}
                        isSelected={selectedStatus?.toLowerCase() === "all"}
                        placeholder={
                          isAssign
                            ? translate("wtpcommon.unassignMyTask")
                            : translate("wtpcommon.enrollMyTask")
                        }
                        color={isAssign ? "#D32600" : "#0081F8"}
                      >
                        <Icon color={"white"} size={20} name="close" />
                      </StateButton>
                    )}
                    <StateButton
                      onPress={() => {
                        setShowActivitylog(true)

                        setRoles(route?.line?.assign_to?.split(" "))
                      }}
                      isSelected={true}
                      placeholder={translate("wtpcommon.viewAssignment")}
                      color={"#0081F8"}
                    >
                      <Icon color={"white"} size={20} name="search1" />
                    </StateButton>
                  </View>
                </View>
                <DataTable style={{ margin: 10, marginTop: 0 }}>
                  <DataTable.Header>
                    <DataTable.Title style={{ flex: 0.25 }} textStyle={styles.textHeader}>
                      No
                    </DataTable.Title>
                    <DataTable.Title style={{ flex: 0.5 }} textStyle={styles.textHeader}>
                      Time
                    </DataTable.Title>
                    <DataTable.Title style={{ flex: 0.5 }} textStyle={styles.textHeader}>
                      UV Lamp
                    </DataTable.Title>
                    <DataTable.Title style={{ flex: 0.5 }} textStyle={styles.textHeader}>
                      Temperature
                    </DataTable.Title>
                    <DataTable.Title style={{ flex: 0.6 }} textStyle={styles.textHeader}>
                      O₃ water pressure
                    </DataTable.Title>
                    <DataTable.Title style={{ flex: 0.5 }} textStyle={styles.textHeader}>
                      FG [O₃]
                    </DataTable.Title>

                    <DataTable.Title style={{ flex: 0.9 }} textStyle={styles.textHeader}>
                      Activities Control
                    </DataTable.Title>
                    <DataTable.Title style={{ flex: 0.6 }} textStyle={styles.textHeader}>
                      Take Action
                    </DataTable.Title>
                    <DataTable.Title style={{ flex: 0.5 }} textStyle={styles.textHeader}>
                      Done by
                    </DataTable.Title>
                    <DataTable.Title style={{ flex: 0.5 }} textStyle={styles.textHeader}>
                      Status
                    </DataTable.Title>

                  </DataTable.Header>
                </DataTable>

                <FlatList
                  data={filterLines || haccpLine}
                  refreshControl={
                    <RefreshControl
                      colors={["#0081F8"]}
                      refreshing={loading}
                      onRefresh={handleRefresh}
                    />
                  }
                  ListEmptyComponent={
                    <EmptyFallback placeholder={translate("wtpcommon.noRecordFound")} />
                  }
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={rendertableLineBarrel}
                />
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
                  ? translate("haccpMonitoring.positive")
                  : translate("haccpMonitoring.negative")
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
            <View style={[$outerContainer]}>
              <View
                style={[$containerHorizon, { marginBottom: 20, justifyContent: "space-between" }]}
              >
                <View style={[$containerHorizon, { marginBottom: 20, gap: 25 }]}>
                  <TouchableOpacity onPress={handleSorting}>
                    <Icon name="up" size={15} color={"black"} />
                    <Icon name="down" size={15} color={"black"} />
                  </TouchableOpacity>
                  <StateButton
                    onPress={() => setSelectStatus("all")}
                    isSelected={selectedStatus?.toLowerCase() === "all"}
                    placeholder={translate("wtpcommon.all")}
                    color={"green"}
                  />
                  {lineStatus.map((item, index) => (
                    <View key={index.toString()}>
                      <StateButton
                        onPress={() => setSelectStatus(item)}
                        isSelected={item.toLowerCase() === selectedStatus.toLowerCase()}
                        // placeholder={item[0].toUpperCase() + item.slice(1)}
                        placeholder={getStatusInKhmer(item[0].toUpperCase() + item.slice(1))}
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
                <View style={{ gap: 10 }}>
                  {!route?.isvalidDate ? (
                    <></>
                  ) : (
                    <StateButton
                      onPress={showModal}
                      isSelected={selectedStatus?.toLowerCase() === "all"}

                      placeholder={
                        isAssign
                          ? translate("wtpcommon.unassignMyTask")
                          : translate("wtpcommon.enrollMyTask")
                      }
                      color={isAssign ? "#D32600" : "#0081F8"}
                    >
                      <Icon color={"white"} size={20} name="close" />
                    </StateButton>
                  )}
                  <StateButton
                    onPress={() => {
                      setShowActivitylog(true)

                      setRoles(route?.line?.assign_to?.split(" "))
                    }}
                    isSelected={true}
                    placeholder={translate("wtpcommon.viewAssignment")}
                    color={"#0081F8"}
                  >
                    <Icon color={"white"} size={20} name="search1" />
                  </StateButton>
                </View>
              </View>

              <DataTable style={{ margin: 10, marginTop: 5 }}>
                <DataTable.Header>
                  <DataTable.Title style={{ flex: 0.25 }} textStyle={styles.textHeader}>
                    No
                  </DataTable.Title>
                  <DataTable.Title style={{ flex: 0.7 }} textStyle={styles.textHeader}>
                    Time
                  </DataTable.Title>
                  <DataTable.Title style={{ flex: 0.8 }} textStyle={styles.textHeader}>
                    Side Wall
                  </DataTable.Title>
                  <DataTable.Title style={{ flex: 0.7 }} textStyle={styles.textHeader}>
                    Air Pressure
                  </DataTable.Title>
                  <DataTable.Title style={{ flex: 0.7 }} textStyle={styles.textHeader}>
                    Temperature
                  </DataTable.Title>
                  <DataTable.Title style={{ flex: 0.7 }} textStyle={styles.textHeader}>
                    Treated Water
                  </DataTable.Title>

                  <DataTable.Title style={{ flex: 0.7 }} textStyle={styles.textHeader}>
                    FG
                  </DataTable.Title>
                  <DataTable.Title style={{ flex: 0.7 }} textStyle={styles.textHeader}>
                    Control
                  </DataTable.Title>
                  <DataTable.Title style={{ flex: 0.7 }} textStyle={styles.textHeader}>
                    Take Action
                  </DataTable.Title>
                  <DataTable.Title style={{ flex: 0.5 }} textStyle={styles.textHeader}>
                    Done by
                  </DataTable.Title>
                  <DataTable.Title style={{ flex: 0.5 }} textStyle={styles.textHeader}>
                    Status
                  </DataTable.Title>

                </DataTable.Header>
              </DataTable>

              <FlatList
                data={filterLines || haccpLine}
                refreshControl={
                  <RefreshControl
                    colors={["#0081F8"]}
                    refreshing={loading}
                    onRefresh={handleRefresh}
                  />
                }
                keyExtractor={(item, index) => index.toString()}
                renderItem={rendertableLine456}
                ListEmptyComponent={
                  <EmptyFallback placeholder={translate("wtpcommon.noRecordFound")} />
                }
              />
            </View>
            <AlertDialog
              visible={visible}
              content={
                isAssign
                  ? translate("haccpMonitoring.positive")
                  : translate("haccpMonitoring.negative")
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
