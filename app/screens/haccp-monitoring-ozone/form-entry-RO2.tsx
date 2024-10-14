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
import { useStores } from "app/models"
import { translate } from "../../i18n"
import styles from "./styles"
import { Text } from "app/components/v2"
import IconAntDesign from "react-native-vector-icons/AntDesign"
import { ALERT_TYPE, Dialog } from "react-native-alert-notification"
import { Checkbox, Provider } from "react-native-paper"
import { RouteParams } from "./form-data"
import { HACCPMonitoringOzoneListModel } from "app/models/haccp-monitoring-ozone/haccp-monitoring-ozone-model"
import AlertDialog from "app/components/v2/AlertDialog"

interface HACCPMonitoringOzoneFormEntryRO2Props extends AppStackScreenProps<"HACCPMonitoringOzoneFormEntryRO2"> { }
export const HACCPMonitoringOzoneFormEntryRO2Screen: FC<HACCPMonitoringOzoneFormEntryRO2Props> = observer(
    function HACCPMonitoringOzoneFormEntryRO2Screen() {
        const navigation = useNavigation()
        const { colors } = useTheme()
        const route = useRoute().params as RouteParams
        const { haccpMonitoringOzoneStore, authStore } = useStores()
        const [isloading, setLoading] = useState(false)
        const assignedUsers = route?.subItem?.assign_to_user.split(' ');
        const isUserAssigned = assignedUsers.includes(authStore?.userLogin ?? '');
        const [isEdit, setIsEdit] = useState()
        const [feedArray1, setFeedArray1] = useState(route?.subItem.feed_array1 || '')
        const [feedArray2, setFeedArray2] = useState(route?.subItem.feed_array2 || '')
        const [concentrate, setConcentrate] = useState(route?.subItem.concentrate || '')
        const [um1Filter, setUm1Filter] = useState(route?.subItem.um1_filter || '')
        const [remark, setRemark] = useState(route?.subItem.remark || '')
        const [array1, setArray1] = useState(route?.subItem.array1 || '')
        const [array2, setArray2] = useState(route?.subItem.array2 || '')
        const [um022Filter, setUm022Filter] = useState(route?.subItem.um022_filter || '')
        const [permeate, setPermeate] = useState(route?.subItem.permeate || '')
        const [roBufferTank, setRoBufferTank] = useState(route?.subItem.ro_buffer_tank || '')
        const [feedRO, setFeedRO] = useState(route?.subItem.feed_ro || '')
        const [feed, setFeed] = useState(route?.subItem.feed || '')
        const [uv1, setUv1] = useState(route?.subItem?.uv1 != null ? (route?.subItem?.uv1) : null)
        const [uv2, setUv2] = useState(route?.subItem?.uv2 != null ? (route?.subItem?.uv2) : null)
        const [uv3, setUv3] = useState(route?.subItem?.uv3 != null ? (route?.subItem?.uv3) : null)
        const [uv4, setUv4] = useState(route?.subItem?.uv4 != null ? (route?.subItem?.uv4) : null)
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
                                ((route?.subItem?.um1_filter == null ? "" : route?.subItem?.um1_filter) != um1Filter) ||
                                ((route?.subItem?.feed_array1 == null ? "" : route?.subItem?.feed_array1) != feedArray1) ||
                                ((route?.subItem?.feed_array2 == null ? "" : route?.subItem?.feed_array2) != feedArray2) ||
                                ((route?.subItem?.concentrate == null ? "" : route?.subItem?.concentrate) != concentrate) ||
                                ((route?.subItem?.remark == null ? "" : route?.subItem?.remark) != remark)

                            const change2 =
                                ((route?.subItem?.array1 == null ? "" : route?.subItem?.array1) != array1) ||
                                ((route?.subItem?.array2 == null ? "" : route?.subItem?.array2) != array2) ||
                                ((route?.subItem?.remark == null ? "" : route?.subItem?.remark) != remark)

                            const change3 =
                                ((route?.subItem?.feed_ro == null ? "" : route?.subItem?.feed_ro) != feedRO) ||
                                ((route?.subItem?.concentrate == null ? "" : route?.subItem?.concentrate) != concentrate) ||
                                ((route?.subItem?.permeate == null ? "" : route?.subItem?.permeate) != permeate) ||
                                ((route?.subItem?.remark == null ? "" : route?.subItem?.remark) != remark)

                            const change4 =
                                ((route?.subItem?.feed == null ? "" : route?.subItem?.feed) != feed) ||
                                ((route?.subItem?.ro_buffer_tank == null ? "" : route?.subItem?.ro_buffer_tank) != roBufferTank) ||
                                ((route?.subItem?.concentrate == null ? "" : route?.subItem?.concentrate) != concentrate) ||
                                ((route?.subItem?.remark == null ? "" : route?.subItem?.remark) != remark)
                            const change5 =
                                ((route?.subItem?.uv1 == null ? "" : route?.subItem?.uv1) != uv1) ||
                                ((route?.subItem?.uv2 == null ? "" : route?.subItem?.uv2) != uv2) ||
                                ((route?.subItem?.remark == null ? "" : route?.subItem?.remark) != remark)
                            const change6 =
                                ((route?.subItem?.uv3 == null ? "" : route?.subItem?.uv3) != uv3) ||
                                ((route?.subItem?.uv4 == null ? "" : route?.subItem?.uv4) != uv4) ||
                                ((route?.subItem?.remark == null ? "" : route?.subItem?.remark) != remark)

                            if (route?.subItem.control?.toLowerCase().includes("pressure")) {
                                if (route?.item.haccp_ozone_type == 'Reverses Osmosis System (RO2)') {
                                    if (change1) {
                                        setVisible({ visible: true })
                                    } else {
                                        navigation.goBack()
                                    }
                                } else if (route?.item.haccp_ozone_type == 'Reverses Osmosis System (RO3)') {
                                    if (change1 || ((route?.subItem?.um022_filter == null ? "" : route?.subItem?.um022_filter) != um022Filter)) {
                                        setVisible({ visible: true })
                                    } else {
                                        navigation.goBack()
                                    }
                                }

                            }
                            else if (route?.subItem.control?.toLowerCase().includes("δp")) {
                                if (change2) {
                                    setVisible({ visible: true })
                                } else {
                                    navigation.goBack()
                                }
                            }
                            else if (route?.subItem.control?.toLowerCase().includes("flow rate")) {
                                if (change3) {
                                    setVisible({ visible: true })
                                } else {
                                    navigation.goBack()
                                }
                            }
                            else if (route?.subItem.control?.toLowerCase().includes("ph") || route?.subItem.control?.toLowerCase().includes("tds")) {
                                if (change4) {
                                    setVisible({ visible: true })
                                } else {
                                    navigation.goBack()
                                }
                            } else if ((route?.subItem.control?.toLowerCase().includes("ultraviolet")) && route?.item.haccp_ozone_type == 'Reverses Osmosis System (RO2)') {
                                if (change5) {
                                    setVisible({ visible: true })
                                } else {
                                    navigation.goBack()
                                }
                            } else if ((route?.subItem.control?.toLowerCase().includes("ultraviolet")) && route?.item.haccp_ozone_type == 'Reverses Osmosis System (RO3)') {
                                if (change6) {
                                    setVisible({ visible: true })
                                } else {
                                    navigation.goBack()
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
                            onPress={() => submit()}
                        >
                            <Icon name="checkmark-sharp" size={24} color={"#0081F8"} />
                            <Text primaryColor body1 semibold>
                                {translate("wtpcommon.save")}
                            </Text>
                        </TouchableOpacity>)
                        : <></>
                ),
            })
        }, [navigation, route, isEdit, um1Filter, feedArray1, feedArray2, concentrate, remark, array1, array2, feed, roBufferTank, uv1, uv2, uv3, uv4, um022Filter])

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
            if (route?.subItem.control?.toLowerCase().includes("pressure")) {
                if (um1Filter == '') {
                    alert('បរាជ័យ', 'សូ​មបំពេញ 1µm Filter')
                    return
                }
                if (feedArray1 == '') {
                    alert('បរាជ័យ', 'សូ​មបំពេញ Feed array 1')
                    return
                }
                if (feedArray2 == '') {
                    alert('បរាជ័យ', 'សូ​មបំពេញ Feed array 2')
                    return
                }
                if (concentrate == '') {
                    alert('បរាជ័យ', 'សូ​មបំពេញ Concentrate')
                    return
                }
                let updatedWarningCount = 0;
                let status = 'normal'
                if ((parseFloat(um1Filter) < 0.2 || parseFloat(um1Filter) > 3.0)) {
                    updatedWarningCount++;
                }
                if (parseFloat(feedArray1) > 15.0) {
                    updatedWarningCount++;
                }
                if (parseFloat(feedArray2) > 15.0) {
                    updatedWarningCount++;
                }
                if (parseFloat(concentrate) > 15.0) {
                    updatedWarningCount++;
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
                        um1_filter: um1Filter,
                        feed_array1: feedArray1,
                        feed_array2: feedArray2,
                        concentrate: concentrate,
                        remark: remark
                    })
                } else {
                    const changes = [
                        route?.subItem?.um1_filter != um1Filter ? `1µm Filter from ${route?.subItem?.um1_filter} to ${um1Filter}` : '',
                        route?.subItem?.feed_array1 != feedArray1 ? `Feed array 1 from ${route?.subItem?.feed_array1} to ${feedArray1}` : '',
                        route?.subItem?.feed_array2 != feedArray2 ? `Feed array 2 from ${route?.subItem?.feed_array2} to ${feedArray2}` : '',
                        route?.subItem?.concentrate != concentrate ? `Concentrate from ${route?.subItem?.concentrate} to ${concentrate}` : '',
                        route?.subItem?.remark != remark ? `Remark from ${route?.subItem?.remark == null ? '' : route?.subItem?.remark} to ${remark}` : ''
                    ];
                    const actionString = changes.filter(change => change !== '').join(', ');
                    entity = HACCPMonitoringOzoneListModel.create({
                        id: route?.subItem?.id,
                        warning_count: updatedWarningCount,
                        status: status,
                        action: `has modified ${actionString}`,
                        haccp_ozone_id: route?.subItem?.haccp_ozone_id,
                        um1_filter: um1Filter,
                        feed_array1: feedArray1,
                        feed_array2: feedArray2,
                        concentrate: concentrate,
                        remark: remark
                    })
                }
            } else if (route?.subItem.control?.toLowerCase().includes("δp")) {
                if (array1 == '') {
                    alert('បរាជ័យ', 'សូ​មបំពេញ Array 1')
                    return
                }
                if (array1 == '') {
                    alert('បរាជ័យ', 'សូ​មបំពេញ Array 2')
                    return
                }
                let updatedWarningCount = 0;
                let status = 'normal'
                if (parseFloat(array1) > 3.5) {
                    updatedWarningCount++;
                }
                if (parseFloat(array2) > 3.5) {
                    updatedWarningCount++;
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
                        array1: array1,
                        array2: array2,
                        remark: remark
                    })
                } else {
                    const changes = [
                        route?.subItem?.array1 != array1 ? `Array 1 from ${route?.subItem?.array1} to ${array1}` : '',
                        route?.subItem?.array2 != array2 ? `Array 2 from ${route?.subItem?.array2} to ${array2}` : '',
                        route?.subItem?.remark != remark ? `Remark from ${route?.subItem?.remark == null ? '' : route?.subItem?.remark} to ${remark}` : ''
                    ];
                    const actionString = changes.filter(change => change !== '').join(', ');
                    entity = HACCPMonitoringOzoneListModel.create({
                        id: route?.subItem?.id,
                        warning_count: updatedWarningCount,
                        status: status,
                        action: `has modified ${actionString}`,
                        haccp_ozone_id: route?.subItem?.haccp_ozone_id,
                        array1: array1,
                        array2: array2,
                        remark: remark
                    })
                }
            } else if (route?.subItem.control?.toLowerCase().includes("flow rate")) {
                if (feedRO == '') {
                    alert('បរាជ័យ', 'សូ​មបំពេញ Feed RO')
                    return
                }
                if (concentrate == '') {
                    alert('បរាជ័យ', 'សូ​មបំពេញ Concentrate')
                    return
                }
                if (permeate == '') {
                    alert('បរាជ័យ', 'សូ​មបំពេញ Permeate')
                    return
                }
                let updatedWarningCount = 0;
                let status = 'normal'
                if (route?.item.haccp_ozone_type == 'Reverses Osmosis System (RO2)') {
                    if (parseFloat(feedRO) > 18) {
                        updatedWarningCount++;
                    }
                    if (parseFloat(concentrate) > 4) {
                        updatedWarningCount++;
                    }
                    if (parseFloat(permeate) < 12 || parseFloat(permeate) > 14) {
                        updatedWarningCount++;
                    }
                } else if (route?.item.haccp_ozone_type == 'Reverses Osmosis System (RO3)') {
                    if (parseFloat(feedRO) > 45) {
                        updatedWarningCount++;
                    }
                    if (parseFloat(concentrate) > 10) {
                        updatedWarningCount++;
                    }
                    if (parseFloat(permeate) < 28 || parseFloat(permeate) > 35) {
                        updatedWarningCount++;
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
                        feed_ro: feedRO,
                        concentrate: concentrate,
                        permeate: permeate,
                        remark: remark
                    })
                } else {
                    const changes = [
                        route?.subItem?.feed_ro != feedRO ? `Feed RO from ${route?.subItem?.feed_ro} to ${feedRO}` : '',
                        route?.subItem?.concentrate != concentrate ? `Concentrate from ${route?.subItem?.concentrate} to ${concentrate}` : '',
                        route?.subItem?.permeate != permeate ? `Permeate from ${route?.subItem?.permeate} to ${permeate}` : '',
                        route?.subItem?.remark != remark ? `Remark from ${route?.subItem?.remark == null ? '' : route?.subItem?.remark} to ${remark}` : ''
                    ];
                    const actionString = changes.filter(change => change !== '').join(', ');
                    entity = HACCPMonitoringOzoneListModel.create({
                        id: route?.subItem?.id,
                        warning_count: updatedWarningCount,
                        status: status,
                        action: `has modified ${actionString}`,
                        haccp_ozone_id: route?.subItem?.haccp_ozone_id,
                        feed_ro: feedRO,
                        concentrate: concentrate,
                        permeate: permeate,
                        remark: remark
                    })
                }
            } else if (route?.subItem.control?.toLowerCase().includes("ph") || route?.subItem.control?.toLowerCase().includes("tds")) {
                if (feed == '') {
                    alert('បរាជ័យ', 'សូ​មបំពេញ Feed')
                    return
                }
                if (roBufferTank == '') {
                    alert('បរាជ័យ', 'សូ​មបំពេញ RO Buffer Tank')
                    return
                }
                if (concentrate == '') {
                    alert('បរាជ័យ', 'សូ​មបំពេញ Concentrate')
                    return
                }
                let updatedWarningCount = 0;
                let status = 'normal'
                if (route?.subItem.control?.toLowerCase().includes("ph")) {
                    if (parseFloat(feed) < 6.5 || parseFloat(feed) > 8.5) {
                        updatedWarningCount++;
                    }
                    if (parseFloat(roBufferTank) < 6.2) {
                        updatedWarningCount++;
                    }
                    if (parseFloat(concentrate) < 5.0 || parseFloat(concentrate) > 9.0) {
                        updatedWarningCount++;
                    }
                    if (updatedWarningCount > 0) {
                        status = 'warning'
                    }
                } else if (route?.subItem.control?.toLowerCase().includes("tds")) {
                    if (parseFloat(feed) > 300) {
                        updatedWarningCount++;
                    }
                    if (parseFloat(roBufferTank) > 30) {
                        updatedWarningCount++;
                    }
                    if (parseFloat(concentrate) > 1000) {
                        updatedWarningCount++;
                    }
                    if (updatedWarningCount > 0) {
                        status = 'warning'
                    }
                }

                if (route?.subItem?.status == 'pending') {
                    entity = HACCPMonitoringOzoneListModel.create({
                        id: route?.subItem?.id,
                        warning_count: updatedWarningCount,
                        status: status,
                        action: "Add HACCP Monitoring Ozone",
                        haccp_ozone_id: route?.subItem?.haccp_ozone_id,
                        feed: feed,
                        ro_buffer_tank: roBufferTank,
                        concentrate: concentrate,
                        remark: remark
                    })
                } else {
                    const changes = [
                        route?.subItem?.feed != feed ? `Feed from ${route?.subItem?.feed} to ${feed}` : '',
                        route?.subItem?.ro_buffer_tank != roBufferTank ? `RO Buffer Tank from ${route?.subItem?.ro_buffer_tank} to ${roBufferTank}` : '',
                        route?.subItem?.concentrate != concentrate ? `Concentrate from ${route?.subItem?.concentrate} to ${concentrate}` : '',
                        route?.subItem?.remark != remark ? `Remark from ${route?.subItem?.remark == null ? '' : route?.subItem?.remark} to ${remark}` : ''
                    ];
                    const actionString = changes.filter(change => change !== '').join(', ');
                    entity = HACCPMonitoringOzoneListModel.create({
                        id: route?.subItem?.id,
                        warning_count: updatedWarningCount,
                        status: status,
                        action: `has modified ${actionString}`,
                        haccp_ozone_id: route?.subItem?.haccp_ozone_id,
                        feed: feed,
                        ro_buffer_tank: roBufferTank,
                        concentrate: concentrate,
                        remark: remark
                    })
                }
            } else if ((route?.subItem.control?.toLowerCase().includes("ultraviolet")) && route?.item.haccp_ozone_type == 'Reverses Osmosis System (RO2)') {
                if (uv1 == null) {
                    alert('បរាជ័យ', 'សូ​មជ្រើសរើស UV1')
                    return
                }
                if (uv2 == null) {
                    alert('បរាជ័យ', 'សូ​មជ្រើសរើស UV2')
                    return
                }
                let updatedWarningCount = 0;
                let status = 'normal'
                if (uv1 == 0) {
                    updatedWarningCount++;
                }
                if (uv2 == 0) {
                    updatedWarningCount++;
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
                        uv1: uv1.toString(),
                        uv2: uv2.toString(),
                        remark: remark
                    })
                } else {
                    const changes = [
                        route?.subItem?.uv1 != uv1 ? `UV1 from ${route?.subItem?.uv1} to ${uv1}` : '',
                        route?.subItem?.uv2 != uv2 ? `UV2 from ${route?.subItem?.uv2} to ${uv2}` : '',
                        route?.subItem?.remark != remark ? `Remark from ${route?.subItem?.remark == null ? '' : route?.subItem?.remark} to ${remark}` : ''
                    ];
                    const actionString = changes.filter(change => change !== '').join(', ');
                    entity = HACCPMonitoringOzoneListModel.create({
                        id: route?.subItem?.id,
                        warning_count: updatedWarningCount,
                        status: status,
                        action: `has modified ${actionString}`,
                        haccp_ozone_id: route?.subItem?.haccp_ozone_id,
                        uv1: uv1.toString(),
                        uv2: uv2.toString(),
                        remark: remark
                    })
                }
            } else if ((route?.subItem.control?.toLowerCase().includes("ultraviolet")) && route?.item.haccp_ozone_type == 'Reverses Osmosis System (RO3)') {
                if (uv3 == null) {
                    alert('បរាជ័យ', 'សូ​មជ្រើសរើស UV3')
                    return
                }
                if (uv4 == null) {
                    alert('បរាជ័យ', 'សូ​មជ្រើសរើស UV4')
                    return
                }
                let updatedWarningCount = 0;
                let status = 'normal'
                if (uv3 == 0) {
                    updatedWarningCount++;
                }
                if (uv4 == 0) {
                    updatedWarningCount++;
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
                        uv3: uv3.toString(),
                        uv4: uv4.toString(),
                        remark: remark
                    })
                } else {
                    const changes = [
                        route?.subItem?.uv3 != uv3 ? `UV3 from ${route?.subItem?.uv3} to ${uv3}` : '',
                        route?.subItem?.uv4 != uv4 ? `UV4 from ${route?.subItem?.uv4} to ${uv4}` : '',
                        route?.subItem?.remark != remark ? `Remark from ${route?.subItem?.remark == null ? '' : route?.subItem?.remark} to ${remark}` : ''
                    ];
                    const actionString = changes.filter(change => change !== '').join(', ');
                    entity = HACCPMonitoringOzoneListModel.create({
                        id: route?.subItem?.id,
                        warning_count: updatedWarningCount,
                        status: status,
                        action: `has modified ${actionString}`,
                        haccp_ozone_id: route?.subItem?.haccp_ozone_id,
                        uv3: uv3.toString(),
                        uv4: uv4.toString(),
                        remark: remark
                    })
                }
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
                            {route?.subItem.control?.toLowerCase().includes("pressure") ?
                                <View>
                                    <View style={main}>
                                        <View style={sub}>
                                            <View style={{ marginRight: 10 }}>
                                                <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                    <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                                    <Text style={{ marginRight: 5, fontSize: 16 }}>1µm Filter</Text>
                                                    <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}> {"(0.2 - 3.0 bar)"}</Text>
                                                    {(parseFloat(um1Filter) < 0.2 || parseFloat(um1Filter) > 3.0) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                                </View>
                                                <TextInput
                                                    keyboardType="decimal-pad"
                                                    value={um1Filter}
                                                    readOnly={!isEdit}
                                                    style={[styles.input, { width: '100%' }]}
                                                    placeholder="Please Enter"
                                                    onChangeText={(text) => setUm1Filter(text)}>
                                                </TextInput>
                                                {um1Filter == '' ?
                                                    <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ 1µm Filter</Text>
                                                    : <></>}
                                            </View>
                                        </View >
                                        <View style={sub}>
                                            <View style={{ marginRight: 10 }}>
                                                <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                    <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                                    <Text style={{ marginRight: 5, fontSize: 16 }}>Feed Array 1</Text>
                                                    <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}> {"(< 15.0 bar)"}</Text>
                                                    {(parseFloat(feedArray1) > 15.0) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                                </View>
                                                <TextInput
                                                    keyboardType="decimal-pad"
                                                    value={feedArray1}
                                                    readOnly={!isEdit}
                                                    style={[styles.input, { width: '100%' }]}
                                                    placeholder="Please Enter"
                                                    onChangeText={(text) => setFeedArray1(text)}>
                                                </TextInput>
                                                {feedArray1 == '' ?
                                                    <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Feed Array 1</Text>
                                                    : <></>}
                                            </View>
                                        </View >
                                    </View>
                                    <View style={main}>
                                        <View style={sub}>
                                            <View style={{ marginRight: 10 }}>
                                                <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                    <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                                    <Text style={{ marginRight: 5, fontSize: 16 }}>Feed Array 2</Text>
                                                    <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}> {"(< 15.0 bar)"}</Text>
                                                    {(parseFloat(feedArray2) > 15.0) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                                </View>
                                                <TextInput
                                                    keyboardType="decimal-pad"
                                                    value={feedArray2}
                                                    readOnly={!isEdit}
                                                    style={[styles.input, { width: '100%' }]}
                                                    placeholder="Please Enter"
                                                    onChangeText={(text) => setFeedArray2(text)}>
                                                </TextInput>
                                                {feedArray2 == '' ?
                                                    <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Feed Array 2</Text>
                                                    : <></>}
                                            </View>
                                        </View >
                                        <View style={sub}>
                                            <View style={{ marginRight: 10 }}>
                                                <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                    <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                                    <Text style={{ marginRight: 5, fontSize: 16 }}>Concentrate</Text>
                                                    <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}> {"(< 15.0 bar)"}</Text>
                                                    {(parseFloat(concentrate) > 15.0) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                                </View>
                                                <TextInput
                                                    keyboardType="decimal-pad"
                                                    value={concentrate}
                                                    readOnly={!isEdit}
                                                    style={[styles.input, { width: '100%' }]}
                                                    placeholder="Please Enter"
                                                    onChangeText={(text) => setConcentrate(text)}>
                                                </TextInput>
                                                {concentrate == '' ?
                                                    <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Concentrate</Text>
                                                    : <></>}
                                            </View>
                                        </View >
                                        <View >

                                        </View>
                                    </View>
                                    {route.item.haccp_ozone_type == 'Reverses Osmosis System (RO2)' ? (
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
                                        </View >)
                                        : route?.item.haccp_ozone_type == 'Reverses Osmosis System (RO3)' ? (
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
                                                <View >

                                                </View>
                                            </View>) : (<></>)}

                                </View>

                                : (route?.subItem.control?.toLowerCase().includes("δp")) ?
                                    <View>
                                        <View style={main}>
                                            <View style={sub}>
                                                <View style={{ marginRight: 10 }}>
                                                    <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                        <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                                        <Text style={{ marginRight: 5, fontSize: 16 }}>Array 1</Text>
                                                        <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}> {"(< 3.5 bar)"}</Text>
                                                        {(parseFloat(array1) > 3.5) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                                    </View>
                                                    <TextInput
                                                        keyboardType="decimal-pad"
                                                        value={array1}
                                                        readOnly={!isEdit}
                                                        style={[styles.input, { width: '100%' }]}
                                                        placeholder="Please Enter"
                                                        onChangeText={(text) => setArray1(text)}>
                                                    </TextInput>
                                                    {array1 == '' ?
                                                        <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Array 1</Text>
                                                        : <></>}
                                                </View>
                                            </View >
                                            <View style={sub}>
                                                <View style={{ marginRight: 10 }}>
                                                    <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                        <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                                        <Text style={{ marginRight: 5, fontSize: 16 }}>Array 2</Text>
                                                        <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}> {"(< 3.5 bar)"}</Text>
                                                        {(parseFloat(array2) > 3.5) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                                    </View>
                                                    <TextInput
                                                        keyboardType="decimal-pad"
                                                        value={array2}
                                                        readOnly={!isEdit}
                                                        style={[styles.input, { width: '100%' }]}
                                                        placeholder="Please Enter"
                                                        onChangeText={(text) => setArray2(text)}>
                                                    </TextInput>
                                                    {array2 == '' ?
                                                        <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Array 2</Text>
                                                        : <></>}
                                                </View>
                                            </View >
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
                                    : (route?.subItem.control?.toLowerCase().includes("flow rate")) ?
                                        <View>
                                            <View>
                                                <View style={main}>
                                                    <View style={sub}>
                                                        <View style={{ marginRight: 10 }}>
                                                            <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                                <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                                                <Text style={{ marginRight: 5, fontSize: 16 }}>Feed RO</Text>
                                                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}> {(route?.item.haccp_ozone_type == 'Reverses Osmosis System (RO2)') ? "(< 18 m³/h)" : (route?.item.haccp_ozone_type == 'Reverses Osmosis System (RO3)') ? "(< 45 m³/h)" : ""}</Text>
                                                                {(parseFloat(feedRO) > 18) && route?.item.haccp_ozone_type == 'Reverses Osmosis System (RO2)' ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : (parseFloat(feedRO) > 45) && route?.item.haccp_ozone_type == 'Reverses Osmosis System (RO3)' ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                                            </View>
                                                            <TextInput
                                                                keyboardType="decimal-pad"
                                                                value={feedRO}
                                                                readOnly={!isEdit}
                                                                style={[styles.input, { width: '100%' }]}
                                                                placeholder="Please Enter"
                                                                onChangeText={(text) => setFeedRO(text)}>
                                                            </TextInput>
                                                            {feedRO == '' ?
                                                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Feed RO</Text>
                                                                : <></>}
                                                        </View>
                                                    </View >
                                                    <View style={sub}>
                                                        <View style={{ marginRight: 10 }}>
                                                            <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                                <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                                                <Text style={{ marginRight: 5, fontSize: 16 }}>Concentrate</Text>
                                                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}> {(route?.item.haccp_ozone_type == 'Reverses Osmosis System (RO2)') ? "(< 4 m³/h)" : (route?.item.haccp_ozone_type == 'Reverses Osmosis System (RO3)') ? "(< 10 m³/h)" : ""}</Text>
                                                                {(parseFloat(concentrate) > 4) && route?.item.haccp_ozone_type == 'Reverses Osmosis System (RO2)' ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : (parseFloat(concentrate) > 10) && route?.item.haccp_ozone_type == 'Reverses Osmosis System (RO3)' ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                                            </View>
                                                            <TextInput
                                                                keyboardType="decimal-pad"
                                                                value={concentrate}
                                                                readOnly={!isEdit}
                                                                style={[styles.input, { width: '100%' }]}
                                                                placeholder="Please Enter"
                                                                onChangeText={(text) => setConcentrate(text)}>
                                                            </TextInput>
                                                            {concentrate == '' ?
                                                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Concentrate</Text>
                                                                : <></>}
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={main}>
                                                    <View style={sub}>
                                                        <View style={{ marginRight: 10 }}>
                                                            <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                                <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                                                <Text style={{ marginRight: 5, fontSize: 16 }}>Permeate</Text>
                                                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}> {(route?.item.haccp_ozone_type == 'Reverses Osmosis System (RO2)') ? "(12 -14 m³/h)" : (route?.item.haccp_ozone_type == 'Reverses Osmosis System (RO3)') ? "(28 - 35 m³/h)" : ""}</Text>
                                                                {(parseFloat(permeate) < 12 || parseFloat(permeate) > 14) && (route?.item.haccp_ozone_type == 'Reverses Osmosis System (RO2)') ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : (parseFloat(permeate) < 28 || parseFloat(permeate) > 35) && (route?.item.haccp_ozone_type == 'Reverses Osmosis System (RO3)') ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                                            </View>
                                                            <TextInput
                                                                keyboardType="decimal-pad"
                                                                value={permeate}
                                                                readOnly={!isEdit}
                                                                style={[styles.input, { width: '100%' }]}
                                                                placeholder="Please Enter"
                                                                onChangeText={(text) => (setPermeate(text), console.log(text))}>
                                                            </TextInput>
                                                            {permeate == '' ?
                                                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Permeate</Text>
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
                                        </View>
                                        : (route?.subItem.control?.toLowerCase().includes("ph")) || (route?.subItem.control?.toLowerCase().includes("tds")) ?
                                            <View>
                                                <View style={main}>
                                                    <View style={sub}>
                                                        <View style={{ marginRight: 10 }}>
                                                            <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                                <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                                                <Text style={{ marginRight: 5, fontSize: 16 }}>Feed</Text>
                                                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}> {(route?.subItem.control?.toLowerCase().includes("ph")) ? "(6.5 - 8.5)" : (route?.subItem.control?.toLowerCase().includes("tds")) ? "(< 300 ppm)" : ""}</Text>
                                                                {(parseFloat(feed) < 6.5 || parseFloat(feed) > 8.5) && (route?.subItem.control?.toLowerCase().includes("ph")) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : (parseFloat(feed) > 300) && (route?.subItem.control?.toLowerCase().includes("tds")) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                                            </View>
                                                            <TextInput
                                                                keyboardType="decimal-pad"
                                                                value={feed}
                                                                readOnly={!isEdit}
                                                                style={[styles.input, { width: '100%' }]}
                                                                placeholder="Please Enter"
                                                                onChangeText={(text) => setFeed(text)}>
                                                            </TextInput>
                                                            {feed == '' ?
                                                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Feed</Text>
                                                                : <></>}
                                                        </View>
                                                    </View >
                                                    <View style={sub}>
                                                        <View style={{ marginRight: 10 }}>
                                                            <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                                <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                                                <Text style={{ marginRight: 5, fontSize: 16 }}>RO Buffer Tank</Text>
                                                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}> {(route?.subItem.control?.toLowerCase().includes("ph")) ? "(> 6.2)" : (route?.subItem.control?.toLowerCase().includes("tds")) ? "(< 30 ppm)" : ""}</Text>
                                                                {(parseFloat(roBufferTank) < 6.2) && (route?.subItem.control?.toLowerCase().includes("ph")) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : (parseFloat(roBufferTank) > 30) && (route?.subItem.control?.toLowerCase().includes("tds")) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                                            </View>
                                                            <TextInput
                                                                keyboardType="decimal-pad"
                                                                value={roBufferTank}
                                                                readOnly={!isEdit}
                                                                style={[styles.input, { width: '100%' }]}
                                                                placeholder="Please Enter"
                                                                onChangeText={(text) => setRoBufferTank(text)}>
                                                            </TextInput>
                                                            {roBufferTank == '' ?
                                                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ RO Buffer Tank</Text>
                                                                : <></>}
                                                        </View>
                                                    </View >
                                                </View>
                                                <View style={main}>
                                                    <View style={sub}>
                                                        <View style={{ marginRight: 10 }}>
                                                            <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                                <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                                                <Text style={{ marginRight: 5, fontSize: 16 }}>Concentrate</Text>
                                                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}> {(route?.subItem.control?.toLowerCase().includes("ph")) ? "(5.0 - 9.0)" : (route?.subItem.control?.toLowerCase().includes("tds")) ? "(< 1000 ppm)" : ""}</Text>
                                                                {(parseFloat(concentrate) < 5.0 || parseFloat(concentrate) > 9.0) && (route?.subItem.control?.toLowerCase().includes("ph")) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : (parseFloat(concentrate) > 1000) && (route?.subItem.control?.toLowerCase().includes("tds")) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                                            </View>
                                                            <TextInput
                                                                keyboardType="decimal-pad"
                                                                value={concentrate}
                                                                readOnly={!isEdit}
                                                                style={[styles.input, { width: '100%' }]}
                                                                placeholder="Please Enter"
                                                                onChangeText={(text) => setConcentrate(text)}>
                                                            </TextInput>
                                                            {concentrate == '' ?
                                                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Concentrate</Text>
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
                                            : (route?.subItem.control?.toLowerCase().includes("ultraviolet")) && route?.item.haccp_ozone_type == 'Reverses Osmosis System (RO2)' ?
                                                <View>
                                                    <View style={main}>
                                                        <View style={sub}>
                                                            <View style={{ flexDirection: 'row' }}>
                                                                <View style={{ marginRight: 10 }}>
                                                                    <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                                        <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                                                        <Text style={{ marginRight: 5, fontSize: 16 }}>UV1</Text>
                                                                        <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>(Y / N)</Text>
                                                                        {(uv1) == 0 ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                                                    </View>
                                                                    <View style={{ flexDirection: 'row' }}>
                                                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
                                                                            <Checkbox
                                                                                disabled={!isEdit}
                                                                                status={
                                                                                    uv1 === null
                                                                                        ? "unchecked"
                                                                                        : uv1 == 1
                                                                                            ? "checked"
                                                                                            : "unchecked"
                                                                                }
                                                                                onPress={() => {
                                                                                    setUv1(1)
                                                                                }}
                                                                                color="#0081F8"
                                                                            />
                                                                            <Text>Yes </Text>
                                                                        </View>
                                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                            <Checkbox
                                                                                disabled={!isEdit}
                                                                                status={
                                                                                    uv1 === null
                                                                                        ? "unchecked"
                                                                                        : uv1 == 0
                                                                                            ? "checked"
                                                                                            : "unchecked"
                                                                                }
                                                                                onPress={() => {
                                                                                    setUv1(0)
                                                                                }}
                                                                                color="#0081F8"
                                                                            />
                                                                            <Text>No </Text>
                                                                        </View>

                                                                    </View>
                                                                    {uv1 == null ?
                                                                        <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមជ្រើសរើស UV1</Text>
                                                                        : <></>}

                                                                </View>
                                                            </View>
                                                        </View>
                                                        <View style={sub}>
                                                            <View style={{ flexDirection: 'row' }}>
                                                                <View style={{ marginRight: 10 }}>
                                                                    <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                                        <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                                                        <Text style={{ marginRight: 5, fontSize: 16 }}>UV2</Text>
                                                                        <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>(Y / N)</Text>
                                                                        {(uv2) == 0 ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                                                    </View>
                                                                    <View style={{ flexDirection: 'row' }}>
                                                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
                                                                            <Checkbox
                                                                                disabled={!isEdit}
                                                                                status={
                                                                                    uv2 === null
                                                                                        ? "unchecked"
                                                                                        : uv2 == 1
                                                                                            ? "checked"
                                                                                            : "unchecked"
                                                                                }
                                                                                onPress={() => {
                                                                                    setUv2(1)
                                                                                }}
                                                                                color="#0081F8"
                                                                            />
                                                                            <Text>Yes </Text>
                                                                        </View>
                                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                            <Checkbox
                                                                                disabled={!isEdit}
                                                                                status={
                                                                                    uv2 === null
                                                                                        ? "unchecked"
                                                                                        : uv2 == 0
                                                                                            ? "checked"
                                                                                            : "unchecked"
                                                                                }
                                                                                onPress={() => {
                                                                                    setUv2(0)
                                                                                }}
                                                                                color="#0081F8"
                                                                            />
                                                                            <Text>No </Text>
                                                                        </View>

                                                                    </View>
                                                                    {uv2 == null ?
                                                                        <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមជ្រើសរើស UV2</Text>
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
                                                </View>

                                                : (route?.subItem.control?.toLowerCase().includes("ultraviolet")) && route?.item.haccp_ozone_type == 'Reverses Osmosis System (RO3)' ?
                                                    <View>
                                                        <View style={main}>
                                                            <View style={sub}>
                                                                <View style={{ flexDirection: 'row' }}>
                                                                    <View style={{ marginRight: 10 }}>
                                                                        <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                                            <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                                                            <Text style={{ marginRight: 5, fontSize: 16 }}>UV3</Text>
                                                                            <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>(Y / N)</Text>
                                                                            {(uv3) == 0 ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                                                        </View>
                                                                        <View style={{ flexDirection: 'row' }}>
                                                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
                                                                                <Checkbox
                                                                                    disabled={!isEdit}
                                                                                    status={
                                                                                        uv3 === null
                                                                                            ? "unchecked"
                                                                                            : uv3 == 1
                                                                                                ? "checked"
                                                                                                : "unchecked"
                                                                                    }
                                                                                    onPress={() => {
                                                                                        setUv3(1)
                                                                                    }}
                                                                                    color="#0081F8"
                                                                                />
                                                                                <Text>Yes </Text>
                                                                            </View>
                                                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                                <Checkbox
                                                                                    disabled={!isEdit}
                                                                                    status={
                                                                                        uv3 === null
                                                                                            ? "unchecked"
                                                                                            : uv3 == 0
                                                                                                ? "checked"
                                                                                                : "unchecked"
                                                                                    }
                                                                                    onPress={() => {
                                                                                        setUv3(0)
                                                                                    }}
                                                                                    color="#0081F8"
                                                                                />
                                                                                <Text>No </Text>
                                                                            </View>

                                                                        </View>
                                                                        {uv3 == null ?
                                                                            <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមជ្រើសរើស UV3</Text>
                                                                            : <></>}

                                                                    </View>
                                                                </View>
                                                            </View>
                                                            <View style={sub}>
                                                                <View style={{ flexDirection: 'row' }}>
                                                                    <View style={{ marginRight: 10 }}>
                                                                        <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                                            <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                                                            <Text style={{ marginRight: 5, fontSize: 16 }}>UV4</Text>
                                                                            <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>(Y / N)</Text>
                                                                            {(uv4) == 0 ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                                                        </View>
                                                                        <View style={{ flexDirection: 'row' }}>
                                                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
                                                                                <Checkbox
                                                                                    disabled={!isEdit}
                                                                                    status={
                                                                                        uv4 === null
                                                                                            ? "unchecked"
                                                                                            : uv4 == 1
                                                                                                ? "checked"
                                                                                                : "unchecked"
                                                                                    }
                                                                                    onPress={() => {
                                                                                        setUv4(1)
                                                                                    }}
                                                                                    color="#0081F8"
                                                                                />
                                                                                <Text>Yes </Text>
                                                                            </View>
                                                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                                <Checkbox
                                                                                    disabled={!isEdit}
                                                                                    status={
                                                                                        uv4 === null
                                                                                            ? "unchecked"
                                                                                            : uv4 == 0
                                                                                                ? "checked"
                                                                                                : "unchecked"
                                                                                    }
                                                                                    onPress={() => {
                                                                                        setUv4(0)
                                                                                    }}
                                                                                    color="#0081F8"
                                                                                />
                                                                                <Text>No </Text>
                                                                            </View>
                                                                        </View>
                                                                        {uv4 == null ?
                                                                            <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមជ្រើសរើស UV4</Text>
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
                                                    </View>
                                                    : <></>}
                        </View>
                    </ScrollView>
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
