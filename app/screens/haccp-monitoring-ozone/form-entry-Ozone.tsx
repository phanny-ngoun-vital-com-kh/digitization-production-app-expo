/* eslint-disable camelcase */
import React, { FC, useEffect, useLayoutEffect, useRef, useState } from "react"
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
    KeyboardAvoidingView,
    TextInput,

} from "react-native"
import { AppStackScreenProps } from "app/navigators"
import Icon from "react-native-vector-icons/Ionicons"
import { useNavigation, useRoute } from "@react-navigation/native"
import { ALERT_TYPE, Dialog } from "react-native-alert-notification"
import { useStores } from "app/models"
import { translate } from "../../i18n"
import styles from "./styles"
import { Text } from "app/components/v2"
import IconAntDesign from "react-native-vector-icons/AntDesign"
import { Checkbox, Provider } from "react-native-paper"
import { RouteParams } from "./form-data"
import { HACCPMonitoringOzoneListModel } from "app/models/haccp-monitoring-ozone/haccp-monitoring-ozone-model"
import AlertDialog from "app/components/v2/AlertDialog"

interface HACCPMonitoringOzoneFormEntryProps extends AppStackScreenProps<"HACCPMonitoringOzoneFormEntry"> { }

export const HACCPMonitoringOzoneFormEntryScreen: FC<HACCPMonitoringOzoneFormEntryProps> = observer(
    function HACCPMonitoringOzoneFormEntryScreen() {
        const navigation = useNavigation()
        const { colors } = useTheme()
        const route = useRoute().params as RouteParams
        const { haccpMonitoringOzoneStore, authStore } = useStores()
        const [isloading, setLoading] = useState(false)
        const assignedUsers = route?.subItem?.assign_to_user.split(' ');
        const isUserAssigned = assignedUsers.includes(authStore?.userLogin ?? '');
        const [isEdit, setIsEdit] = useState()
        const [remark, setRemark] = useState(route?.subItem.remark || '')
        const [um022Filter, setUm022Filter] = useState(route?.subItem.um022_filter || '')
        const [mixedTank, setMixedTank] = useState(route?.subItem.mixed_tank || '')
        const [o3MixedTank, setO3MixedTank] = useState(route?.subItem.o3_mixed_tank || '')
        const [airSupplyPs002, setAirSupplyPs002] = useState(route?.subItem.air_supply_ps002 || '')
        const [mixedPipe, setmixedPipe] = useState(route?.subItem.mixed_pipe || '')
        const [chillerTt302, setChillerTt302] = useState(route?.subItem.chiller_tt302 || '')
        const [controller, setController] = useState(route?.subItem.controller || '')
        const [o3A143, seto3A143] = useState(route?.subItem.o3_a143 || '')
        const [uv5, setUv5] = useState(route?.subItem?.uv5 != null ? route?.subItem?.uv5 : null)
        const [uv6, setUv6] = useState(route?.subItem?.uv6 != null ? route?.subItem?.uv6 : null)
        const [visible, setVisible] = useState<{ visible: boolean }>({ visible: false })

        useEffect(() => {
            const role = async () => {
                try {
                    const rs = await authStore.getUserInfo();
                    const admin = rs.data.authorities.includes('ROLE_PROD_PRO_ADMIN')
                    const adminWTP = rs.data.authorities.includes('ROLE_PROD_WTP_ADMIN')
                    const edit = (route?.invalidDate && isUserAssigned && route?.isValidShift) || admin || adminWTP
                    setIsEdit(edit)
                    // Modify the list based on the user's role
                    // setGetRole(rs)
                } catch (e) {
                    console.log(e)
                }
            };
            role();
        }, []);

        useLayoutEffect(() => {
            navigation.setOptions({
                headerShown: true,
                title: route?.subItem.control,

                headerLeft: () => (
                    <TouchableOpacity
                        onPress={() => {
                            const change1 =
                                ((route?.subItem?.um022_filter == null ? "" : route?.subItem?.um022_filter) != um022Filter) ||
                                ((route?.subItem?.remark == null ? "" : route?.subItem?.remark) != remark)

                            const change2 =
                                ((route?.subItem?.mixed_tank == null ? "" : route?.subItem?.mixed_tank) != mixedTank) ||
                                ((route?.subItem?.remark == null ? "" : route?.subItem?.remark) != remark)

                            const change3 =
                                ((route?.subItem?.o3_mixed_tank == null ? "" : route?.subItem?.o3_mixed_tank) != o3MixedTank) ||
                                ((route?.subItem?.remark == null ? "" : route?.subItem?.remark) != remark)

                            const change4 =
                                ((route?.subItem?.air_supply_ps002 == null ? "" : route?.subItem?.air_supply_ps002) != airSupplyPs002) ||
                                ((route?.subItem?.remark == null ? "" : route?.subItem?.remark) != remark)

                            const change5 =
                                ((route?.subItem?.mixed_pipe == null ? "" : route?.subItem?.mixed_pipe) != mixedPipe) ||
                                ((route?.subItem?.remark == null ? "" : route?.subItem?.remark) != remark)

                            const change6 =
                                ((route?.subItem?.chiller_tt302 == null ? "" : route?.subItem?.chiller_tt302) != chillerTt302) ||
                                ((route?.subItem?.controller == null ? "" : route?.subItem?.controller) != controller) ||
                                ((route?.subItem?.remark == null ? "" : route?.subItem?.remark) != remark)

                            const change7 =
                                ((route?.subItem?.o3_a143 == null ? "" : route?.subItem?.o3_a143) != o3A143) ||
                                ((route?.subItem?.remark == null ? "" : route?.subItem?.remark) != remark)

                            const change8 =
                                ((route?.subItem?.uv5 == null ? "" : route?.subItem?.uv5) != uv5) ||
                                ((route?.subItem?.uv6 == null ? "" : route?.subItem?.uv6) != uv6) ||
                                ((route?.subItem?.remark == null ? "" : route?.subItem?.remark) != remark)


                            if (route?.item.haccp_ozone_type == 'Ozone System (RO3)') {
                                if (route?.subItem.control?.toLowerCase().includes("pressure")) {
                                    if (change1) {
                                        setVisible({ visible: true })
                                    } else {
                                        navigation.goBack()
                                    }

                                } else if ((route?.subItem.control?.toLowerCase().includes("ph")) || (route?.subItem.control?.toLowerCase().includes("tds"))) {
                                    if (change2) {
                                        setVisible({ visible: true })
                                    } else {
                                        navigation.goBack()
                                    }
                                } else if (route?.subItem.control?.toLowerCase().includes("ozone")) {
                                    if (change3) {
                                        setVisible({ visible: true })
                                    } else {
                                        navigation.goBack()
                                    }
                                }
                            } else if (route?.item.haccp_ozone_type == 'Ozone System (RO4)') {
                                if (route?.subItem.control?.toLowerCase().includes("pressure")) {
                                    if (change4) {
                                        setVisible({ visible: true })
                                    } else {
                                        navigation.goBack()
                                    }
                                } else if ((route?.subItem.control?.toLowerCase().includes("ph")) || (route?.subItem.control?.toLowerCase().includes("tds"))) {
                                    if (change5) {
                                        setVisible({ visible: true })
                                    } else {
                                        navigation.goBack()
                                    }
                                } else if (route?.subItem.control?.toLowerCase().includes("tem")) {
                                    if (change6) {
                                        setVisible({ visible: true })
                                    } else {
                                        navigation.goBack()
                                    }
                                } else if (route?.subItem.control?.toLowerCase().includes("ozone")) {
                                    if (change7) {
                                        setVisible({ visible: true })
                                    } else {
                                        navigation.goBack()
                                    }
                                } else if (route?.subItem.control?.toLowerCase().includes("uv")) {
                                    if (change8) {
                                        setVisible({ visible: true })
                                    } else {
                                        navigation.goBack()
                                    }
                                }
                            }
                        }}
                        style={{ flexDirection: "row", alignItems: "center", marginRight: 30 }}
                    >
                        <Icon name="arrow-back-sharp" size={24} />
                    </TouchableOpacity>
                ),

                headerRight: () => (
                    (isEdit) ? (
                        <TouchableOpacity
                            disabled={isloading == true}
                            style={{ flexDirection: "row", alignItems: "center" }}
                            onPress={() => (submit())}
                        >
                            <Icon name="checkmark-sharp" size={24} color={"#0081F8"} />
                            <Text primaryColor body1 semibold>
                                {translate("wtpcommon.save")}
                            </Text>
                        </TouchableOpacity>)
                        : <></>
                ),
            })
        }, [navigation, route, isEdit, um022Filter, mixedTank, o3MixedTank, airSupplyPs002, mixedPipe, chillerTt302, controller, o3A143, uv5, uv6, remark])

        const alert = (title: string, textBody: string) => {
            Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: title,
                textBody: textBody,
                button: 'បិទ',
            })
        }

        const submit = async () => {
            let entity
            let updatedWarningCount = 0;
            let status = 'normal'
            if (route?.item.haccp_ozone_type == 'Ozone System (RO3)') {
                if (route?.subItem.control?.toLowerCase().includes("pressure")) {
                    if (um022Filter == '') {
                        alert('បរាជ័យ', 'សូ​មបំពេញ 0.22 µm Filter')
                        return
                    }
                    if ((parseFloat(um022Filter) < 0.2 || parseFloat(um022Filter) > 3.0)) {
                        updatedWarningCount++;
                    }
                } else if ((route?.subItem.control?.toLowerCase().includes("ph")) || (route?.subItem.control?.toLowerCase().includes("tds"))) {
                    if (mixedTank == '') {
                        alert('បរាជ័យ', 'សូ​មបំពេញ Mixed Tank')
                        return
                    }
                    if ((route?.subItem.control?.toLowerCase().includes("ph"))) {
                        if (parseFloat(mixedTank) < 6.5 || parseFloat(mixedTank) > 8.5) {
                            updatedWarningCount++;
                        }
                    } else if (route?.subItem.control?.toLowerCase().includes("tds")) {
                        if (parseFloat(mixedTank) > 30) {
                            updatedWarningCount++;
                        }
                    }
                } else if (route?.subItem.control?.toLowerCase().includes("ozone")) {
                    if (o3MixedTank == '') {
                        alert('បរាជ័យ', 'សូ​មបំពេញ O3 Mixed Tank')
                        return
                    }
                    if (parseFloat(o3MixedTank) < 0.1 || parseFloat(o3MixedTank) > 0.4) {
                        updatedWarningCount++;
                    }
                }
            } else if (route?.item.haccp_ozone_type == 'Ozone System (RO4)') {
                if (route?.subItem.control?.toLowerCase().includes("pressure")) {
                    if (airSupplyPs002 == '') {
                        alert('បរាជ័យ', 'សូ​មបំពេញ Air supply PS002')
                        return
                    }
                    if (parseFloat(airSupplyPs002) < 6.5 || parseFloat(airSupplyPs002) > 8) {
                        updatedWarningCount++;
                    }
                } else if ((route?.subItem.control?.toLowerCase().includes("ph")) || (route?.subItem.control?.toLowerCase().includes("tds"))) {
                    if (mixedPipe == '') {
                        alert('បរាជ័យ', 'សូ​មបំពេញ Mixed Pipe')
                        return
                    }
                    if (route?.subItem.control?.toLowerCase().includes("ph")) {
                        if (parseFloat(mixedPipe) < 6.5 || parseFloat(mixedPipe) > 8.5) {
                            updatedWarningCount++;
                        }
                    } else if (route?.subItem.control?.toLowerCase().includes("tds")) {
                        if (parseFloat(mixedPipe) > 30) {
                            updatedWarningCount++;
                        }
                    }
                } else if (route?.subItem.control?.toLowerCase().includes("tem")) {
                    if (chillerTt302 == '') {
                        alert('បរាជ័យ', 'សូ​មបំពេញ Chiller TT302')
                        return
                    }
                    if (controller == '') {
                        alert('បរាជ័យ', 'សូ​មបំពេញ Controller')
                        return
                    }
                    if (parseFloat(chillerTt302) < 5 || parseFloat(chillerTt302) > 25) {
                        updatedWarningCount++;
                    }
                    if (parseFloat(controller) < 25 || parseFloat(controller) > 35) {
                        updatedWarningCount++;
                    }
                } else if (route?.subItem.control?.toLowerCase().includes("ozone")) {
                    if (o3A143 == '') {
                        alert('បរាជ័យ', 'សូ​មបំពេញ O₃ A143')
                        return
                    }
                    if ((parseFloat(o3A143) < 0.1 || parseFloat(o3A143) > 0.4)) {
                        updatedWarningCount++
                    }
                } else if (route?.subItem.control?.toLowerCase().includes("uv")) {
                    if (uv5 == null) {
                        alert('បរាជ័យ', 'សូ​មជ្រើសរើស UV5')
                        return
                    }
                    if (uv6 == null) {
                        alert('បរាជ័យ', 'សូ​មជ្រើសរើស UV6')
                        return
                    }
                    if (uv5 == 0) {
                        updatedWarningCount++;
                    }
                    if (uv6 == 0) {
                        updatedWarningCount++;
                    }
                }
            }
            if (updatedWarningCount > 0) {
                status = 'warning'
            }
            if (route?.subItem?.status == 'pending') {
                entity = HACCPMonitoringOzoneListModel.create({
                    id: route?.subItem?.id,
                    warning_count: updatedWarningCount,
                    status: status,
                    action: "Add HACCP Monitoring Ozone",
                    haccp_ozone_id: route?.subItem?.haccp_ozone_id,
                    um022_filter: um022Filter,
                    mixed_tank: mixedTank,
                    o3_mixed_tank: o3MixedTank,
                    air_supply_ps002: airSupplyPs002,
                    mixed_pipe: mixedPipe,
                    chiller_tt302: chillerTt302,
                    controller: controller,
                    o3_a143: o3A143,
                    uv5: uv5?.toString(),
                    uv6: uv6?.toString(),
                    remark: remark
                })
            } else {
                const changes = [
                    route?.subItem?.um022_filter != um022Filter ? `0.22 µm Filter from ${route?.subItem?.um022_filter} to ${um022Filter}` : '',
                    route?.subItem?.mixed_tank != mixedTank ? `Mixed Tank from ${route?.subItem?.mixed_tank} to ${mixedTank}` : '',
                    route?.subItem?.o3_mixed_tank != o3MixedTank ? `O3 Mixed Tank from ${route?.subItem?.o3_mixed_tank} to ${o3MixedTank}` : '',
                    route?.subItem?.air_supply_ps002 != airSupplyPs002 ? `Air supply PS002 from ${route?.subItem?.air_supply_ps002} to ${airSupplyPs002}` : '',
                    route?.subItem?.mixed_pipe != mixedPipe ? `Mixed Pipe from ${route?.subItem?.mixed_pipe} to ${mixedPipe}` : '',
                    route?.subItem?.chiller_tt302 != chillerTt302 ? `Chiller TT302 from ${route?.subItem?.chiller_tt302} to ${chillerTt302}` : '',
                    route?.subItem?.controller != controller ? `Controller from ${route?.subItem?.controller} to ${controller}` : '',
                    route?.subItem?.o3_a143 != o3A143 ? `O₃ A143 from ${route?.subItem?.o3_a143} to ${o3A143}` : '',
                    route?.subItem?.uv5 != uv5 ? `UV5 from ${route?.subItem?.uv5} to ${uv5}` : '',
                    route?.subItem?.uv6 != uv6 ? `UV6 from ${route?.subItem?.uv6} to ${uv6}` : '',
                    route?.subItem?.remark != remark ? `Remark from ${route?.subItem?.remark == null ? '' : route?.subItem?.remark} to ${remark}` : ''
                ];
                const actionString = changes.filter(change => change !== '').join(', ');
                entity = HACCPMonitoringOzoneListModel.create({
                    id: route?.subItem?.id,
                    warning_count: updatedWarningCount,
                    status: status,
                    action: `has modified ${actionString}`,
                    haccp_ozone_id: route?.subItem?.haccp_ozone_id,
                    um022_filter: um022Filter,
                    mixed_tank: mixedTank,
                    o3_mixed_tank: o3MixedTank,
                    air_supply_ps002: airSupplyPs002,
                    mixed_pipe: mixedPipe,
                    chiller_tt302: chillerTt302,
                    controller: controller,
                    o3_a143: o3A143,
                    uv5: uv5?.toString(),
                    uv6: uv6?.toString(),
                    remark: remark
                })
            }
            try {
                setLoading(true)
                const rs = await (haccpMonitoringOzoneStore
                    .addHACCPList(entity)
                    .saveHaccpList().then()
                    .catch((e) => console.log(e)))
                if (rs == 'Success') {
                    Dialog.show({
                        type: ALERT_TYPE.SUCCESS,
                        title: 'ជោគជ័យ',
                        textBody: 'រក្សាទុកបានជោគជ័យ',
                        // button: 'close',
                        autoClose: 100
                    })
                    navigation.goBack()
                } else {
                    Dialog.show({
                        type: ALERT_TYPE.DANGER,
                        title: "បរាជ័យ",
                        textBody: "សូមបំពេញទិន្នន័យអោយបានត្រឹមត្រូវ",
                        button: "បិទ",
                        // autoClose: 500,
                    })
                }
            } catch (error) {
                Dialog.show({
                    type: ALERT_TYPE.DANGER,
                    title: "បរាជ័យ",
                    textBody: "បរាជ័យ",
                    button: "បិទ",
                    // autoClose: 500,
                })
            } finally {
                route?.onReturn()
                setLoading(false)
            }
        }

        return (
            <Provider>
                <KeyboardAvoidingView behavior={"padding"} keyboardVerticalOffset={100} style={[$root]}>
                    {isloading && (
                        <View style={styles.overlay}>
                            <ActivityIndicator color="#8CC8FF" size={35} />
                            <View style={{ marginVertical: 15 }}></View>
                            <Text whiteColor textAlign={"center"}>
                                Saving record ...
                            </Text>
                        </View>
                    )}

                    <ScrollView>
                        <View style={$outerContainer}>
                            {route?.item.haccp_ozone_type == 'Ozone System (RO3)' ?
                                route?.subItem.control?.toLowerCase().includes("pressure") ?
                                    <View>
                                        <View style={main}>
                                            <View style={sub}>
                                                <View style={{ marginRight: 10 }}>
                                                    <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                        <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                                        <Text style={{ marginRight: 5, fontSize: 16 }}>0.22 µm Filter </Text>
                                                        <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}> {"(0.2 - 3.0 bar)"}</Text>
                                                        {(parseFloat(um022Filter) < 0.2 || parseFloat(um022Filter) > 3.0) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                                    </View>
                                                    <TextInput
                                                        keyboardType="decimal-pad"
                                                        value={um022Filter}
                                                        readOnly={!isEdit}
                                                        style={[styles.input, { width: '100%' }]}
                                                        placeholder="Please Enter"
                                                        onChangeText={(text) => setUm022Filter(text)}>
                                                    </TextInput>
                                                    {um022Filter == '' ?
                                                        <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ 0.22 µm Filter</Text>
                                                        : <></>}
                                                </View>
                                            </View >
                                            <View style={sub}>
                                                <View style={{ marginRight: 10 }}>
                                                    <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                        <Text style={{ marginRight: 5, fontSize: 16 }}>Remark</Text>
                                                    </View>
                                                    <TextInput
                                                        value={remark}
                                                        readOnly={!isEdit}
                                                        style={[styles.input, { width: '100%' }]}
                                                        placeholder="Please Enter"
                                                        onChangeText={(text) => setRemark(text)}>
                                                    </TextInput>
                                                </View>
                                            </View >
                                        </View>
                                    </View>


                                    : (route?.subItem.control?.toLowerCase().includes("ph")) || (route?.subItem.control?.toLowerCase().includes("tds")) ?
                                        <View>
                                            <View style={main}>
                                                <View style={sub}>
                                                    <View style={{ marginRight: 10 }}>
                                                        <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                            <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                                            <Text style={{ marginRight: 5, fontSize: 16 }}>Mixed Tank</Text>
                                                            <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}> {(route?.subItem.control?.toLowerCase().includes("ph")) ? "(6.5 - 8.5)" : (route?.subItem.control?.toLowerCase().includes("tds")) ? "(≤ 30 ppm)" : ""}</Text>
                                                            {(parseFloat(mixedTank) < 6.5 || parseFloat(mixedTank) > 8.5) && (route?.subItem.control?.toLowerCase().includes("ph")) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : (parseFloat(mixedTank) > 30) && (route?.subItem.control?.toLowerCase().includes("tds")) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                                        </View>
                                                        <TextInput
                                                            keyboardType="decimal-pad"
                                                            value={mixedTank}
                                                            readOnly={!isEdit}
                                                            style={[styles.input, { width: '100%' }]}
                                                            placeholder="Please Enter"
                                                            onChangeText={(text) => setMixedTank(text)}>
                                                        </TextInput>
                                                        {mixedTank == '' ?
                                                            <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Mixed Tank</Text>
                                                            : <></>}
                                                    </View>
                                                </View >
                                                <View style={sub}>
                                                    <View style={{ marginRight: 10 }}>
                                                        <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                            <Text style={{ marginRight: 5, fontSize: 16 }}>Remark</Text>
                                                        </View>
                                                        <TextInput
                                                            value={remark}
                                                            readOnly={!isEdit}
                                                            style={[styles.input, { width: '100%' }]}
                                                            placeholder="Please Enter"
                                                            onChangeText={(text) => setRemark(text)}>
                                                        </TextInput>
                                                    </View>
                                                </View >
                                            </View>

                                        </View>
                                        : route?.subItem.control?.toLowerCase().includes("ozone") ?
                                            <View>
                                                <View style={main}>
                                                    <View style={sub}>
                                                        <View style={{ marginRight: 10 }}>
                                                            <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                                <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                                                <Text style={{ marginRight: 5, fontSize: 16 }}>O3 Mixed Tank </Text>
                                                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}> {"(0.1 - 0.4 ppm)"}</Text>
                                                                {(parseFloat(o3MixedTank) < 0.1 || parseFloat(o3MixedTank) > 0.4) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                                            </View>
                                                            <TextInput
                                                                keyboardType="decimal-pad"
                                                                value={o3MixedTank}
                                                                readOnly={!isEdit}
                                                                style={[styles.input, { width: '100%' }]}
                                                                placeholder="Please Enter"
                                                                onChangeText={(text) => setO3MixedTank(text)}>
                                                            </TextInput>
                                                            {o3MixedTank == '' ?
                                                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ O3 Mixed Tank</Text>
                                                                : <></>}
                                                        </View>
                                                    </View >
                                                    <View style={sub}>
                                                        <View style={{ marginRight: 10 }}>
                                                            <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                                <Text style={{ marginRight: 5, fontSize: 16 }}>Remark</Text>
                                                            </View>
                                                            <TextInput
                                                                value={remark}
                                                                readOnly={!isEdit}
                                                                style={[styles.input, { width: '100%' }]}
                                                                placeholder="Please Enter"
                                                                onChangeText={(text) => setRemark(text)}>
                                                            </TextInput>
                                                        </View>
                                                    </View >
                                                </View>
                                            </View> : <></>
                                : route?.item.haccp_ozone_type == 'Ozone System (RO4)' ?
                                    route?.subItem.control?.toLowerCase().includes("pressure") ?
                                        <View>
                                            <View style={main}>
                                                <View style={sub}>
                                                    <View style={{ marginRight: 10 }}>
                                                        <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                            <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                                            <Text style={{ marginRight: 5, fontSize: 16 }}>Air supply PS002 </Text>
                                                            <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}> {"(6.5 - 8 bar)"}</Text>
                                                            {(parseFloat(airSupplyPs002) < 6.5 || parseFloat(airSupplyPs002) > 8) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                                        </View>
                                                        <TextInput
                                                            keyboardType="decimal-pad"
                                                            value={airSupplyPs002}
                                                            readOnly={!isEdit}
                                                            style={[styles.input, { width: '100%' }]}
                                                            placeholder="Please Enter"
                                                            onChangeText={(text) => setAirSupplyPs002(text)}>
                                                        </TextInput>
                                                        {airSupplyPs002 == '' ?
                                                            <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Air supply PS002</Text>
                                                            : <></>}
                                                    </View>
                                                </View >
                                                <View style={sub}>
                                                    <View style={{ marginRight: 10 }}>
                                                        <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                            <Text style={{ marginRight: 5, fontSize: 16 }}>Remark</Text>
                                                        </View>
                                                        <TextInput
                                                            value={remark}
                                                            readOnly={!isEdit}
                                                            style={[styles.input, { width: '100%' }]}
                                                            placeholder="Please Enter"
                                                            onChangeText={(text) => setRemark(text)}>
                                                        </TextInput>
                                                    </View>
                                                </View >
                                            </View>
                                        </View>


                                        : (route?.subItem.control?.toLowerCase().includes("ph")) || (route?.subItem.control?.toLowerCase().includes("tds")) ?
                                            <View>
                                                <View style={main}>
                                                    <View style={sub}>
                                                        <View style={{ marginRight: 10 }}>
                                                            <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                                <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                                                <Text style={{ marginRight: 5, fontSize: 16 }}>Mixed Pipe</Text>
                                                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}> {(route?.subItem.control?.toLowerCase().includes("ph")) ? "(6.5 - 8.5)" : (route?.subItem.control?.toLowerCase().includes("tds")) ? "(≤ 30 ppm)" : ""}</Text>
                                                                {(parseFloat(mixedPipe) < 6.5 || parseFloat(mixedPipe) > 8.5) && (route?.subItem.control?.toLowerCase().includes("ph")) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : (parseFloat(mixedPipe) > 30) && (route?.subItem.control?.toLowerCase().includes("tds")) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                                            </View>
                                                            <TextInput
                                                                keyboardType="decimal-pad"
                                                                value={mixedPipe}
                                                                readOnly={!isEdit}
                                                                style={[styles.input, { width: '100%' }]}
                                                                placeholder="Please Enter"
                                                                onChangeText={(text) => setmixedPipe(text)}>
                                                            </TextInput>
                                                            {mixedPipe == '' ?
                                                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Mixed Pipe</Text>
                                                                : <></>}
                                                        </View>
                                                    </View >
                                                    <View style={sub}>
                                                        <View style={{ marginRight: 10 }}>
                                                            <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                                <Text style={{ marginRight: 5, fontSize: 16 }}>Remark</Text>
                                                            </View>
                                                            <TextInput
                                                                value={remark}
                                                                readOnly={!isEdit}
                                                                style={[styles.input, { width: '100%' }]}
                                                                placeholder="Please Enter"
                                                                onChangeText={(text) => setRemark(text)}>
                                                            </TextInput>
                                                        </View>
                                                    </View >
                                                </View>

                                            </View>
                                            : route?.subItem.control?.toLowerCase().includes("tem") ?
                                                <View>
                                                    <View style={main}>
                                                        <View style={sub}>
                                                            <View style={{ marginRight: 10 }}>
                                                                <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                                    <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                                                    <Text style={{ marginRight: 5, fontSize: 16 }}>Chiller TT302 </Text>
                                                                    <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}> {"(5 - 25 bar)"}</Text>
                                                                    {(parseFloat(chillerTt302) < 5 || parseFloat(chillerTt302) > 25) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                                                </View>
                                                                <TextInput
                                                                    keyboardType="decimal-pad"
                                                                    value={chillerTt302}
                                                                    readOnly={!isEdit}
                                                                    style={[styles.input, { width: '100%' }]}
                                                                    placeholder="Please Enter"
                                                                    onChangeText={(text) => setChillerTt302(text)}>
                                                                </TextInput>
                                                                {chillerTt302 == '' ?
                                                                    <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Chiller TT302</Text>
                                                                    : <></>}
                                                            </View>
                                                        </View >
                                                        <View style={sub}>
                                                            <View style={{ marginRight: 10 }}>
                                                                <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                                    <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                                                    <Text style={{ marginRight: 5, fontSize: 16 }}>Controller </Text>
                                                                    <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}> {"(25 - 35 bar)"}</Text>
                                                                    {(parseFloat(controller) < 25 || parseFloat(controller) > 35) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                                                </View>
                                                                <TextInput
                                                                    keyboardType="decimal-pad"
                                                                    value={controller}
                                                                    readOnly={!isEdit}
                                                                    style={[styles.input, { width: '100%' }]}
                                                                    placeholder="Please Enter"
                                                                    onChangeText={(text) => setController(text)}>
                                                                </TextInput>
                                                                {controller == '' ?
                                                                    <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Controller</Text>
                                                                    : <></>}
                                                            </View>
                                                        </View>
                                                    </View>
                                                    <View >
                                                        <View style={{ flex: 1 }}>
                                                            <View style={{ marginRight: 10 }}>
                                                                <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                                    <Text style={{ marginRight: 5, fontSize: 16 }}>Remark</Text>
                                                                </View>
                                                                <TextInput
                                                                    value={remark}
                                                                    readOnly={!isEdit}
                                                                    style={[styles.input, { width: '100%' }]}
                                                                    placeholder="Please Enter"
                                                                    onChangeText={(text) => setRemark(text)}>
                                                                </TextInput>
                                                            </View>
                                                        </View >
                                                    </View>
                                                </View>
                                                : route?.subItem.control?.toLowerCase().includes("ozone") ?
                                                    <View>
                                                        <View style={main}>
                                                            <View style={sub}>
                                                                <View style={{ marginRight: 10 }}>
                                                                    <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                                        <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                                                        <Text style={{ marginRight: 5, fontSize: 16 }}>O₃ A143</Text>
                                                                        <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}> {"(0.1 - 0.4 ppm)"}</Text>
                                                                        {(parseFloat(o3A143) < 0.1 || parseFloat(o3A143) > 0.4) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                                                    </View>
                                                                    <TextInput
                                                                        keyboardType="decimal-pad"
                                                                        value={o3A143}
                                                                        readOnly={!isEdit}
                                                                        style={[styles.input, { width: '100%' }]}
                                                                        placeholder="Please Enter"
                                                                        onChangeText={(text) => seto3A143(text)}>
                                                                    </TextInput>
                                                                    {o3A143 == '' ?
                                                                        <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ O₃ A143</Text>
                                                                        : <></>}
                                                                </View>
                                                            </View >
                                                            <View style={sub}>
                                                                <View style={{ marginRight: 10 }}>
                                                                    <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                                        <Text style={{ marginRight: 5, fontSize: 16 }}>Remark</Text>
                                                                    </View>
                                                                    <TextInput
                                                                        value={remark}
                                                                        readOnly={!isEdit}
                                                                        style={[styles.input, { width: '100%' }]}
                                                                        placeholder="Please Enter"
                                                                        onChangeText={(text) => setRemark(text)}>
                                                                    </TextInput>
                                                                </View>
                                                            </View >
                                                        </View>
                                                    </View>
                                                    : route?.subItem.control?.toLowerCase().includes("uv") ?
                                                        <View>
                                                            <View style={main}>
                                                                <View style={sub}>
                                                                    <View style={{ flexDirection: 'row' }}>
                                                                        <View style={{ marginRight: 10 }}>
                                                                            <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                                                <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                                                                <Text style={{ marginRight: 5, fontSize: 16 }}>UV(5) &gt; 65%</Text>
                                                                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>(Y / N)</Text>
                                                                                {(uv5) == 0 ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                                                            </View>
                                                                            <View style={{ flexDirection: 'row' }}>
                                                                                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
                                                                                    <Checkbox
                                                                                        disabled={!isEdit}
                                                                                        status={
                                                                                            uv5 === null
                                                                                                ? "unchecked"
                                                                                                : uv5 == 1
                                                                                                    ? "checked"
                                                                                                    : "unchecked"
                                                                                        }
                                                                                        onPress={() => {
                                                                                            setUv5(1)
                                                                                        }}
                                                                                        color="#0081F8"
                                                                                    />
                                                                                    <Text>Yes </Text>
                                                                                </View>
                                                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                                    <Checkbox
                                                                                        disabled={!isEdit}
                                                                                        status={
                                                                                            uv5 === null
                                                                                                ? "unchecked"
                                                                                                : uv5 == 0
                                                                                                    ? "checked"
                                                                                                    : "unchecked"
                                                                                        }
                                                                                        onPress={() => {
                                                                                            setUv5(0)
                                                                                        }}
                                                                                        color="#0081F8"
                                                                                    />
                                                                                    <Text>No </Text>
                                                                                </View>

                                                                            </View>
                                                                            {uv5 == null ?
                                                                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមជ្រើសរើស UV(5) &gt; 65%</Text>
                                                                                : <></>}

                                                                        </View>
                                                                    </View>
                                                                </View>
                                                                <View style={sub}>
                                                                    <View style={{ flexDirection: 'row' }}>
                                                                        <View style={{ marginRight: 10 }}>
                                                                            <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                                                <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                                                                <Text style={{ marginRight: 5, fontSize: 16 }}>UV(6) &gt; 65%</Text>
                                                                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>(Y / N)</Text>
                                                                                {(uv6) == 0 ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                                                            </View>
                                                                            <View style={{ flexDirection: 'row' }}>
                                                                                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
                                                                                    <Checkbox
                                                                                        disabled={!isEdit}
                                                                                        status={
                                                                                            uv6 === null
                                                                                                ? "unchecked"
                                                                                                : uv6 == 1
                                                                                                    ? "checked"
                                                                                                    : "unchecked"
                                                                                        }
                                                                                        onPress={() => {
                                                                                            setUv6(1)
                                                                                        }}
                                                                                        color="#0081F8"
                                                                                    />
                                                                                    <Text>Yes </Text>
                                                                                </View>
                                                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                                    <Checkbox
                                                                                        disabled={!isEdit}
                                                                                        status={
                                                                                            uv6 === null
                                                                                                ? "unchecked"
                                                                                                : uv6 == 0
                                                                                                    ? "checked"
                                                                                                    : "unchecked"
                                                                                        }
                                                                                        onPress={() => {
                                                                                            setUv6(0)
                                                                                        }}
                                                                                        color="#0081F8"
                                                                                    />
                                                                                    <Text>No </Text>
                                                                                </View>
                                                                            </View>
                                                                            {uv6 == null ?
                                                                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមជ្រើសរើស UV(6) &gt; 65%</Text>
                                                                                : <></>}

                                                                        </View>
                                                                    </View>
                                                                </View>

                                                            </View>
                                                            <View >
                                                                <View style={{ flex: 1 }}>
                                                                    <View style={{ marginRight: 10 }}>
                                                                        <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                                            <Text style={{ marginRight: 5, fontSize: 16 }}>Remark</Text>
                                                                        </View>
                                                                        <TextInput
                                                                            value={remark}
                                                                            readOnly={!isEdit}
                                                                            style={[styles.input, { width: '100%' }]}
                                                                            placeholder="Please Enter"
                                                                            onChangeText={(text) => setRemark(text)}>
                                                                        </TextInput>
                                                                    </View>
                                                                </View >
                                                            </View>
                                                        </View> : <></>
                                    : <></>}

                        </View>
                    </ScrollView>
                    {/* <ActivityModal log={activities} onClose={() => setShowlog(false)} isVisible={showLog} /> */}
                    <AlertDialog
                        visible={visible.visible}
                        content="អ្នកមិនទាន់បានរក្សាទុកទេ, ច្បាស់ទេថានឹងចាក់ចេញ?"
                        hideDialog={() => setVisible({ visible: false })}
                        onPositive={() => navigation.goBack()}
                        onNegative={() => setVisible({ visible: false })} isLoading={false} />

                </KeyboardAvoidingView>
            </Provider>
        )
    },
)

const $root: ViewStyle = {
    flex: 1,
    backgroundColor: "white",
}
const $outerContainer: ViewStyle = {
    margin: 15,
    marginTop: 20,
    padding: 10,
    flex: 1,
}

const main: ViewStyle = {
    flexDirection: 'row',
    width: '97%',
    marginBottom: 40
}

const sub: ViewStyle = {
    width: '50%',
    margin: 10
}
