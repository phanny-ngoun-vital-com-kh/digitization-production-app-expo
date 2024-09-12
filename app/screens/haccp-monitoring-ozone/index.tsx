/* eslint-disable camelcase */
import React, { FC, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { useTheme } from "app/theme-v2"
import moment from "moment"
import {
    View,
    ViewStyle,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
    FlatList,
    TextStyle,
    ActivityIndicator,

} from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Divider, Provider } from "react-native-paper"
import HeaderBar from "../../components/v2/WaterTreatment/HeaderBar"
import TimePanel from "app/components/v2/WaterTreatment/TimePanel"
import Icon from "react-native-vector-icons/FontAwesome"
import MachinePanel from "app/components/v2/WaterTreatment/MachinePanel"
import CustomInput from "app/components/v2/DailyPreWater/CustomInput"
import { useNavigation } from "@react-navigation/native"
import { ALERT_TYPE, Dialog } from "react-native-alert-notification"
import EmptyFallback from "app/components/EmptyFallback"
import { PreWaterTreatment } from "app/models/pre-water-treatment/pre-water-treatment-model"
import { useStores } from "app/models"
import { cleanTimeCurrent, cleanTimePreWtp, getCurrentTime } from "app/utils-v2/getCurrTime"
import AlertDialog from "app/components/v2/AlertDialog"
import { prewaterTreatmentApi } from "app/services/api/pre-water-treatment-api"
import { translate } from "../../i18n"
import ActivityModal from "app/components/v2/ActivitylogModal"
import { isCancel } from "apisauce"
import { HACCPMonitoringOzone, HACCPMonitoringOzoneList, HACCPMonitoringOzoneListModel, HACCPMonitoringOzoneSystem } from "app/models/haccp-monitoring-ozone/haccp-monitoring-ozone-model"
import styles from "./styles"
import BadgeTriangle from "app/components/v2/BadgeV2"
import ProgressBar from "react-native-animated-progress";
import { Text } from "app/components/v2"
import BadgeWarning from "app/components/v2/Badgewarn"
import IconAntDesign from "react-native-vector-icons/AntDesign"
import IconFontAwesome5 from "react-native-vector-icons/FontAwesome5"
import BadgeOutofdate from "app/components/v2/BadgePanel"

interface HACCPMonitoringOzoneProps extends AppStackScreenProps<"HACCPMonitoringOzone"> { }

export const HACCPMonitoringOzoneScreen: FC<HACCPMonitoringOzoneProps> = observer(
    function HACCPMonitoringOzoneScreen() {
        const navigation = useNavigation()
        const { colors } = useTheme()
        const { haccpMonitoringOzoneStore, authStore } = useStores()
        const [isRefreshing, setRefreshing] = useState(false)
        const [datePicker, setDatePicker] = useState({
            show: false,
            value: new Date(Date.now()),
        })
        const [refresh, setRefresh] = useState(false)
        const [selectProgess, setSelectProgess] = useState(0)
        const [cancelDate, setCancelDate] = useState(false)
        const [visible, setVisible] = useState<{ visible: boolean, data?: any }>({ visible: false })
        const [showActivitylog, setShowActivitylog] = useState<{ visible: boolean, data?: any }>({ visible: false })

        const [onSelect, setOnSelect] = useState(false)
        const [selectTime, setSelectTime] = useState<HACCPMonitoringOzone | null>()
        const [dailyData, setdailyData] = useState<HACCPMonitoringOzone[] | null>([])
        const [selectedWTP, setSelectedWTP] = useState("Reverses Osmosis System (RO1)")
        const [currentUser, setCurrentUser] = useState()
        const [selectedShift, setSelectedShift] = useState({
            item: "",
            index: 0,
            haccp_ozone_id: "",
        })
        const [ozone, setOzone] = useState<HACCPMonitoringOzoneSystem[]>([])
        // const { preWaterTreatmentStore, authStore } = useStores()
        const [schedules, setSchedules] = useState([
            { time: "7:00", isWarning: false },
            { time: "11:00", isWarning: false },
            { time: "15:00", isWarning: false },
            { time: "19:00", isWarning: false },
            { time: "23:00", isWarning: false },
            { time: "3:00", isWarning: false },
        ])

        const invalidDate = (created_date: any) =>
            // console.log('moment(Date.now()).format("LL")=======', moment(Date.now()).format("YYYY-MM-DD"))
            // console.log(created_date)
            // console.log('moment(created_date).format("LL")=======', moment.utc(created_date).format("YYYY-MM-DD"))

            moment(Date.now()).format("YYYY-MM-DD") === moment.utc(created_date).format("YYYY-MM-DD")


        // const isValidShift = (time: any) =>
        //     getCurrentTime() > cleanTimeCurrent(!time.includes("(") ? time : time?.split(" ")[1]) &&
        //     getCurrentTime().localeCompare(
        //         cleanTimePreWtp(!time.includes("(") ? time : time?.split(" ")[1]),
        //     )

        // const isValidShift = (time: string) => {
        //     // Extract and clean the time from the input
        //     const cleanedInputTime = !time.includes("(") ? time : time.split(" ")[1];
        //     const cleanedCurrentTime = cleanTimeCurrent(cleanedInputTime);
        //     const cleanedPreWtpTime = cleanTimePreWtp(cleanedInputTime);
        //   console.log(cleanedInputTime)
        //     // Get the current time
        //     const currentTime = getCurrentTime();

        //     console.log('Current Time:', currentTime);
        //     console.log('Cleaned Current Time:', cleanedCurrentTime);
        //     console.log('Cleaned PreWtp Time:', cleanedPreWtpTime);

        //     // Compare the current time with cleaned times
        //     const isAfterCurrent = currentTime > cleanedCurrentTime;
        //     const isBeforePreWtp = currentTime.localeCompare(cleanedPreWtpTime) < 0;

        //     console.log('Is After Current Time:', isAfterCurrent);
        //     console.log('Is Before PreWtp Time:', isBeforePreWtp);

        //     return isAfterCurrent && isBeforePreWtp;
        //   };

        const timeRanges = {
            "07:00": "11:00",
            "11:00": "15:00",
            "15:00": "19:00",
            "19:00": "23:00",
            "23:00": "03:00" // Handle crossing midnight
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

        const sendBack = () => {
            setRefresh(true)
        }

        const assign_self = async (data: HACCPMonitoringOzoneList) => {
            const rs = HACCPMonitoringOzoneListModel.create({
                id: data.id,
                haccp_ozone_id: data.haccp_ozone_id,
                action: "Assign self"
            })
            try {
                setRefresh(true)
                await (haccpMonitoringOzoneStore
                    .addHACCPList(rs)
                    .assignself()
                    .then()
                    .catch((e) => console.log(e)))
                {
                    setVisible({ visible: false, data: undefined })
                    Dialog.show({
                        type: ALERT_TYPE.SUCCESS,
                        title: 'ជោគជ័យ',
                        textBody: 'រក្សាទុកបានជោគជ័យ',
                        // button: 'close',
                        autoClose: 100
                    })
                }
            } catch (error) {
                Dialog.show({
                    type: ALERT_TYPE.DANGER,
                    title: "បរាជ័យ",
                    textBody: "សូមបំពេញទិន្នន័យអោយបានត្រឹមត្រូវ",
                    button: "បិទ",
                    // autoClose: 500,
                })
            } finally {
                setRefresh(false)
            }
        }

        useEffect(() => {
            try {
                setRefresh(true)
                const get = async () => {
                    const rs = await haccpMonitoringOzoneStore.getOzoneSystemList()
                    const daily = await haccpMonitoringOzoneStore.getOzoneDailyList(datePicker.value.toLocaleDateString('en-CA'), selectedWTP)
                    const userinfo = await authStore.getUserInfo()
                    setCurrentUser(userinfo.data)
                    setOzone(rs)
                    setdailyData(daily)
                }
                get()
            } catch {
                Dialog.show({
                    type: ALERT_TYPE.DANGER,
                    title: "បរាជ័យ",
                    textBody: "បញ្ហាបច្ចេកទេសនៅលើ server",
                    button: "បិទ",
                })
            } finally {
                setRefresh(false)
            }


        }, [datePicker, selectedWTP, refresh])

        useEffect(() => {
            const autoSelectTime = () => {
                const currentTime = getCurrentTime(); // Ensure this function returns the current time in the same format as your time ranges

                // Find the schedule that matches the current time shift
                const selectedTime = schedules.find((schedule) => isValidShift(schedule.time));
                if (selectedTime) {
                    const assignItem = dailyData?.find(v => v.time === selectedTime.time);
                    setSelectTime(assignItem ?? selectedTime); // Automatically select the matching schedule
                    setOnSelect(true);
                }
            };

            // Automatically select time when component mounts or schedules update
            autoSelectTime();

            // Optionally recheck every minute
            // const interval = setInterval(autoSelectTime, 60000); // Check every minute

            // return () => clearInterval(interval); // Cleanup interval on unmount
        }, [ dailyData]);

        return (
            <Provider>
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
                                haccpOzoneData={ozone}
                                isLoading={isRefreshing}
                                enableHaccpOzone={true}
                                showLine={false}
                                onChangeDate={(e, v) => {
                                    setDatePicker((pre) => ({ show: false, value: v }))
                                    setRefresh(true)
                                    setdailyData([])
                                    setSelectTime(null)
                                    if (e.type === "set") {
                                        setSelectProgess(0)
                                        setCancelDate(false)

                                    } else {
                                        setCancelDate(true)
                                    }
                                }}
                                selectedWtp={selectedWTP}
                                onSelectWtp={(item: any) => {
                                    // setSelectTime([])
                                    setSelectedWTP(item.ozone)
                                    setRefresh(true)
                                    setdailyData([])
                                    setSelectTime(null)
                                }}
                                onPressdate={() => {
                                    setDatePicker((pre) => ({ ...pre, show: true }))
                                    setCancelDate(true)
                                }}
                                dateValue={datePicker.value}
                                showDate={datePicker.show}
                                currDate={new Date(Date.now())}
                            />
                        </View>
                        <Divider style={styles.divider_space} />
                        <View
                            style={[
                                $containerHorizon,
                                {
                                    gap: 10,
                                    marginTop: 0,
                                    marginBottom: 15,
                                    flex: 1,
                                    backgroundColor: "#F5F5F5",
                                },
                            ]}
                        >
                            <View style={styles.leftPane}>
                                <FlatList
                                    data={schedules}
                                    renderItem={({ item }) => {
                                        const assignItem = dailyData?.find(v => v.time === item.time);
                                        const nonPendingCount = assignItem?.ozonelist.filter(
                                            item => item.status !== 'pending'
                                        ).length;
                                        const totalCount = assignItem?.ozonelist.length;
                                        const percentage = totalCount > 0 ? ((nonPendingCount / totalCount) * 100).toFixed(2) : '0.00';
                                        const isSelected = selectTime && selectTime.time === item.time;
                                        return (
                                            <TouchableOpacity onPress={() => { setSelectTime(assignItem ?? item), setOnSelect(true) }}>
                                                <View
                                                    style={{
                                                        padding: 40,
                                                        backgroundColor: isSelected ? "#0081F8" : "white",
                                                        shadowOffset: {
                                                            width: 0,
                                                            height: 3,
                                                        },
                                                        overflow: "hidden",
                                                        shadowOpacity: 0.27,
                                                        shadowRadius: 4.65,
                                                        elevation: 1,
                                                        marginBottom: 5,
                                                    }}
                                                >
                                                    <View>
                                                        {assignItem?.ozonelist?.some(item => item.warning_count > 0) && (

                                                            <BadgeTriangle label={translate("wtpcommon.warning")} />
                                                        )}
                                                    </View>

                                                    <Text
                                                        style={{ textAlign: 'center', fontSize: 17, fontWeight: 'bold' }}
                                                        whiteColor={selectTime?.time == item.time}
                                                        semibold
                                                        headline
                                                        textAlign={"center"}
                                                    >
                                                        {item.time}
                                                    </Text>
                                                    <View style={{ width: '90%', marginTop: 15, }}>
                                                        <ProgressBar
                                                            progress={parseFloat(percentage)}
                                                            height={6}
                                                            backgroundColor={"#2292EE"}
                                                            animated={false}
                                                        />

                                                        <Text style={{ color: selectTime?.time == item.time ? "white" : "black", fontWeight: 'bold', fontSize: 14, textAlign: 'center' }}>
                                                            {parseFloat(percentage)}%
                                                        </Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }} />
                            </View>
                            <View style={styles.rightPane}>
                                {isRefreshing && (
                                    <View style={styles.overlay}>
                                        <ActivityIndicator color="#8CC8FF" size={35} />
                                        <View style={{ marginVertical: 15 }}></View>
                                        <Text whiteColor textAlign={"center"}>
                                            Loading ...
                                        </Text>
                                    </View>
                                )}
                                <View
                                    style={[
                                        $containerHorizon,
                                        { justifyContent: "space-between", alignItems: "center" },
                                    ]}
                                >

                                    <View style={{ width: 550, marginBottom: 10 }}>
                                        <CustomInput
                                            placeholder={translate("preWaterTreatment.search")}
                                            // onChangeText={(text) => setQuery(text)}
                                            label=""
                                            errormessage={""}
                                            type="search"
                                        />
                                    </View>
                                    <View style={styles.sortIcon}>
                                        <TouchableOpacity style={{ padding: 10 }} onPress={() => { }}>
                                            <Icon name="sort" size={20} color={"black"} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <FlatList
                                    ListEmptyComponent={
                                        !selectTime?.ozonelist && (
                                            <EmptyFallback placeholder={translate("wtpcommon.noScheduleYet")} />
                                        )
                                    }
                                    data={selectTime?.ozonelist}
                                    refreshControl={
                                        <RefreshControl
                                            colors={[colors.primary]}
                                            tintColor={colors.primary}
                                            refreshing={isRefreshing}
                                            onRefresh={() => setRefresh(true)}
                                        />
                                    }
                                    renderItem={({ item }) => {
                                        const isAssign = item.assign_to_user?.split(" ").includes(currentUser?.login ?? "")
                                        return (
                                            <View
                                                style={{
                                                    backgroundColor: invalidDate(selectTime?.assign_date) && isValidShift(selectTime?.time) ? "white" : "#EEEEEE",
                                                    marginBottom: 10,
                                                    elevation: 6,
                                                    borderRadius: 0,
                                                    overflow: "hidden",
                                                    position: "relative",
                                                }}
                                            >
                                                <TouchableOpacity
                                                    style={{ paddingHorizontal: 10, paddingVertical: 5 }}
                                                    onPress={() => {
                                                        // onPress(validShift)
                                                        navigation.navigate(
                                                            selectTime?.haccp_ozone_type == "Reverses Osmosis System (RO1)" ? "HACCPMonitoringOzoneFormEntryRO1" :
                                                                selectTime?.haccp_ozone_type == "Reverses Osmosis System (RO2)" || selectTime?.haccp_ozone_type == "Reverses Osmosis System (RO3)" ? "HACCPMonitoringOzoneFormEntryRO2" :
                                                                    selectTime?.haccp_ozone_type == "Reverses Osmosis System (RO4)" ? "HACCPMonitoringOzoneFormEntryRO4" :
                                                                        selectTime?.haccp_ozone_type?.includes("Ozone") ? "HACCPMonitoringOzoneFormEntry" : "",
                                                            { item: selectTime, subItem: item, invalidDate: invalidDate(selectTime?.assign_date), isValidShift: isValidShift(selectTime?.time), onReturn: sendBack })
                                                    }}
                                                >
                                                    <View style={{ width: 180, position: "relative" }}>
                                                        <View style={[$containerHorizon, { justifyContent: "space-between" }]}>
                                                            <Text semibold headline>
                                                                {item.control}
                                                            </Text>
                                                        </View>

                                                        {!!item.warning_count && (
                                                            <View style={{ left: 110, top: 1 }}>
                                                                <BadgeWarning value={item.warning_count} status="warning" />
                                                            </View>
                                                        )}
                                                    </View>
                                                    <View style={$containerHorizon}>
                                                        <View style={[{ backgroundColor: item.status === "normal" ? "#0081F8" : item.status === "pending" ? "#8CC8FF" : "red" }, styles.machinePanel]}></View>
                                                        <Text caption1>{item.status}</Text>
                                                    </View>

                                                    <Divider
                                                        style={{
                                                            height: 5,
                                                            marginVertical: 18,
                                                            backgroundColor: item.status === "normal" ? "#0081F8" : item.status === "pending" ? "#8CC8FF" : "red",
                                                        }}
                                                    />
                                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                                                        <View style={[$containerHorizon, { gap: 20 }]}>
                                                            {isAssign && (
                                                                <View style={$containerHorizon}>
                                                                    <IconAntDesign name="checkcircle" size={18} color="green" />
                                                                    <Text semibold caption1 style={{ marginLeft: 5, color: "green" }}>
                                                                        {/* You are assigned */}
                                                                        {translate("wtpcommon.youareApproved")}
                                                                    </Text>
                                                                </View>
                                                            )}

                                                            <View style={$containerHorizon}>
                                                                <IconAntDesign name="clockcircleo" style={{ marginRight: 5 }} size={18} color="black" />
                                                                <Text semibold caption1>
                                                                    {selectTime?.time}
                                                                </Text>
                                                            </View>
                                                            <View style={$containerHorizon}>
                                                                <Icon name="calendar" size={20} color="black" />
                                                                <Text semibold caption1 style={{ marginLeft: 5 }}>
                                                                    {moment(selectTime?.createdDate).format("LL")}
                                                                </Text>
                                                            </View>
                                                            {item.assign_to_user ? (
                                                                <View style={$containerHorizon}>
                                                                    <IconFontAwesome5
                                                                        name="user-friends"
                                                                        style={{ marginRight: 5 }}
                                                                        size={16}
                                                                        color="black"
                                                                    />
                                                                    <Text semibold caption1>
                                                                        {item.assign_to_user?.split(" ")?.length}
                                                                    </Text>
                                                                </View>
                                                            ) : (
                                                                <View style={$containerHorizon}>
                                                                    <IconFontAwesome5
                                                                        name="user-friends"
                                                                        style={{ marginRight: 5 }}
                                                                        size={16}
                                                                        color="black"
                                                                    />
                                                                    <Text semibold caption1>
                                                                        0
                                                                    </Text>
                                                                </View>
                                                            )}
                                                        </View>
                                                        <View>
                                                            <TouchableOpacity>
                                                                <IconAntDesign name="right" size={20} color="black" />
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>

                                                {/* {item.status === "pending" && isAssign === false ? (
<></>
                                                ): (<></>)} */}

                                                {
                                                    item.status === "pending" && isAssign === false ? (
                                                        invalidDate(selectTime?.assign_date) && isValidShift(selectTime?.time) ? (
                                                            <View
                                                                style={[
                                                                    $containerHorizon,
                                                                    { justifyContent: "center", alignItems: "center", marginBottom: 20, marginTop: 15, gap: 25 },
                                                                ]}
                                                            >
                                                                <TouchableOpacity
                                                                    onPress={() => setVisible({ visible: true, data: item })}
                                                                    style={$containerHorizon}
                                                                >
                                                                    <IconAntDesign name="edit" size={18} color="#0081F8" />
                                                                    <Text semibold caption1 style={{ marginLeft: 5, color: "#0081F8" }}>
                                                                        {/* Enroll this task */}

                                                                        {translate("wtpcommon.enrollMyTask")}
                                                                    </Text>
                                                                </TouchableOpacity>
                                                                <TouchableOpacity
                                                                    onPress={() => setShowActivitylog({ visible: true, data: item.assign_to_user?.split(" ") })}
                                                                    style={$containerHorizon}
                                                                >
                                                                    <Icon name="eye" size={18} color="#0081F8" />
                                                                    <Text semibold caption1 style={{ marginLeft: 5 }} primaryColor>
                                                                        {translate("wtpcommon.viewAssignment")}
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                        ) : (
                                                            <BadgeOutofdate placeholder={


                                                                translate("wtpcommon.outDate")


                                                            } />
                                                        )
                                                    ) : invalidDate(selectTime?.assign_date) && isValidShift(selectTime?.time) ? (
                                                        <View
                                                            style={[
                                                                $containerHorizon,
                                                                { justifyContent: "center", alignItems: "center", marginVertical: 25, gap: 25 },
                                                            ]}
                                                        >
                                                            {isAssign ? (
                                                                <TouchableOpacity
                                                                    onPress={() => setVisible({ visible: true, data: item })}
                                                                    style={$containerHorizon}
                                                                >
                                                                    <IconAntDesign name="closecircle" size={18} color="#D32600" />
                                                                    <Text semibold caption1 style={{ marginLeft: 5, color: "#D32600" }}>
                                                                        {translate("wtpcommon.unassignMyTask")}
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            ) : (
                                                                <TouchableOpacity
                                                                    onPress={() => setVisible({ visible: true, data: item })}
                                                                    style={$containerHorizon}
                                                                >
                                                                    <Icon name="edit" size={18} color="#0081F8" />
                                                                    <Text semibold caption1 style={{ marginLeft: 5, color: "#0081F8" }}>
                                                                        {/* Enroll this task */}

                                                                        {translate("wtpcommon.enrollMyTask")}
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            )}

                                                            <View style={[$containerHorizon, { justifyContent: "center", alignItems: "center" }]}>
                                                                <TouchableOpacity
                                                                    onPress={() => setShowActivitylog({ visible: true, data: item.assign_to_user?.split(" ") })}
                                                                    style={$containerHorizon}
                                                                >
                                                                    <Icon name="eye" size={18} color="#0081F8" />
                                                                    <Text semibold caption1 style={{ marginLeft: 5 }} primaryColor>
                                                                        {translate("wtpcommon.viewAssignment")}
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                    ) : (
                                                        <>
                                                            <BadgeOutofdate placeholder={translate("wtpcommon.outDate")} />
                                                        </>
                                                    )
                                                }
                                                {!(invalidDate(selectTime?.assign_date) && isValidShift(selectTime?.time)) && (
                                                    <View
                                                        style={[
                                                            $containerHorizon,
                                                            { justifyContent: "center", alignItems: "center", marginBottom: 20 },
                                                        ]}
                                                    >
                                                        <TouchableOpacity
                                                            onPress={() => setShowActivitylog({ visible: true, data: item.assign_to_user?.split(" ") })}
                                                            style={$containerHorizon}
                                                        >
                                                            <Icon name="eye" size={18} color="#0081F8" />
                                                            <Text semibold caption1 style={{ marginLeft: 5 }} primaryColor>
                                                                {translate("wtpcommon.viewAssignment")}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                )}
                                            </View>
                                        )

                                    }}
                                />
                                {/* </View> */}
                                <AlertDialog
                                    visible={visible.visible}
                                    content="Are you sure about that?"
                                    hideDialog={() => setVisible({ visible: false, data: undefined })}
                                    onPositive={() => { assign_self(visible.data) }}
                                    onNegative={() => setVisible({ visible: false, data: undefined })}
                                />
                            </View>

                        </View>
                    </View>
                </View>
                <ActivityModal
                    title="Users"
                    type="roles"
                    log={showActivitylog.data}
                    isVisible={showActivitylog.visible}
                    onClose={() => {
                        setShowActivitylog({ visible: false, data: undefined })
                    }}
                />
            </Provider>
        )
    },
)

const $root: ViewStyle = {
    flex: 1,
    backgroundColor: "white",
}
const $fontSelected: TextStyle = {
    fontSize: 14,
}
const $outerContainer: ViewStyle = {
    margin: 15,
    marginTop: 20,
    padding: 10,
    flex: 1,
}

const $containerHorizon: ViewStyle = {
    flexDirection: "row",
    // height:"100%",
    alignItems: "center",
    gap: 5,
    // ,paddingBottom:25
}

const $useflex: ViewStyle = {
    flex: 1,
}
