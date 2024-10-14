/* eslint-disable camelcase */
import React, { FC, useEffect, useLayoutEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import {
    View,
    ViewStyle,
    TouchableOpacity,
    ScrollView,
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
import { RouteParams } from "./form-data"
import { HACCPMonitoringOzoneListModel } from "app/models/haccp-monitoring-ozone/haccp-monitoring-ozone-model"
import AlertDialog from "app/components/v2/AlertDialog"
import { Provider } from "react-native-paper"

interface HACCPMonitoringOzoneFormEntryRO1Props extends AppStackScreenProps<"HACCPMonitoringOzoneFormEntryRO1"> { }
export const HACCPMonitoringOzoneFormEntryRO1Screen: FC<HACCPMonitoringOzoneFormEntryRO1Props> = observer(
    function HACCPMonitoringOzoneFormEntryRO1Screen() {
        const navigation = useNavigation()
        const route = useRoute().params as RouteParams
        const { haccpMonitoringOzoneStore, authStore } = useStores()
        const [isloading, setLoading] = useState(false)
        const assignedUsers = route?.subItem?.assign_to_user?.split(' ');
        const isUserAssigned = assignedUsers?.includes(authStore?.userLogin ?? '');
        const [isEdit, setIsEdit] = useState()
        const [feedArray1, setFeedArray1] = useState(route?.subItem.feed_array1 || '')
        const [feedArray2, setFeedArray2] = useState(route?.subItem.feed_array2 || '')
        const [concentrate, setConcentrate] = useState(route?.subItem.concentrate || '')
        const [array1, setArray1] = useState(route?.subItem.array1 || '')
        const [array2, setArray2] = useState(route?.subItem.array2 || '')
        const [remark, setRemark] = useState(route?.subItem.remark || '')
        const [feedRO, setFeedRO] = useState(route?.subItem.feed_ro || '')
        const [recycle, setRecycle] = useState(route?.subItem.recycle || '')
        const [permeate, setPermeate] = useState(route?.subItem.permeate || '')
        const [feed, setFeed] = useState(route?.subItem.feed || '')
        const [visible, setVisible] = useState<{ visible: boolean }>({ visible: false })

        useEffect(() => {
            const role = async () => {
                try {
                    const rs = await authStore.getUserInfo();
                    const admin = rs?.data.authorities?.includes('ROLE_PROD_PRO_ADMIN')
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
                                ((route?.subItem?.recycle == null ? "" : route?.subItem?.recycle) != recycle) ||
                                ((route?.subItem?.concentrate == null ? "" : route?.subItem?.concentrate) != concentrate) ||
                                ((route?.subItem?.permeate == null ? "" : route?.subItem?.permeate) != permeate) ||
                                ((route?.subItem?.remark == null ? "" : route?.subItem?.remark) != remark)

                            const change4 =
                                ((route?.subItem?.feed == null ? "" : route?.subItem?.feed) != feed) ||
                                ((route?.subItem?.concentrate == null ? "" : route?.subItem?.concentrate) != concentrate) ||
                                ((route?.subItem?.permeate == null ? "" : route?.subItem?.permeate) != permeate) ||
                                ((route?.subItem?.remark == null ? "" : route?.subItem?.remark) != remark)

                            if (route?.subItem.control?.toLowerCase().includes("pressure")) {
                                if (change1) {
                                    setVisible({ visible: true })
                                } else {
                                    navigation.goBack()
                                }
                            } else if (route?.subItem.control?.toLowerCase().includes("δp")) {
                                if (change2) {
                                    setVisible({ visible: true })
                                } else {
                                    navigation.goBack()
                                }
                            } else if (route?.subItem.control?.toLowerCase().includes("flow rate")) {
                                if (change3) {
                                    setVisible({ visible: true })
                                } else {
                                    navigation.goBack()
                                }
                            } else if (route?.subItem.control?.toLowerCase().includes("ph") || route?.subItem.control?.toLowerCase().includes("tds")) {
                                if (change4) {
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
        }, [navigation, route, isEdit, feedArray1, feedArray2, concentrate, remark, array1, array2, feedRO, permeate, recycle, feed])

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
                        feed_array1: feedArray1,
                        feed_array2: feedArray2,
                        concentrate: concentrate,
                        remark: remark
                    })
                } else {
                    const changes = [
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
                if (recycle == '') {
                    alert('បរាជ័យ', 'សូ​មបំពេញ Recycle')
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
                if (parseFloat(feedRO) > 16) {
                    updatedWarningCount++;
                }
                if (parseFloat(recycle) > 4) {
                    updatedWarningCount++;
                }
                if (parseFloat(concentrate) > 4) {
                    updatedWarningCount++;
                }
                if (parseFloat(permeate) < 8 || parseFloat(permeate) > 10) {
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
                        feed_ro: feedRO,
                        recycle: recycle,
                        concentrate: concentrate,
                        permeate: permeate,
                        remark: remark
                    })
                } else {
                    const changes = [
                        route?.subItem?.feed_ro != feedRO ? `Feed RO from ${route?.subItem?.feed_ro} to ${feedRO}` : '',
                        route?.subItem?.recycle != recycle ? `Recycle from ${route?.subItem?.recycle} to ${recycle}` : '',
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
                        recycle: recycle,
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
                if (permeate == '') {
                    alert('បរាជ័យ', 'សូ​មបំពេញ Permeate')
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
                    if (parseFloat(permeate) < 6.2) {
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
                    if (parseFloat(permeate) > 30) {
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
                        permeate: permeate,
                        concentrate: concentrate,
                        remark: remark
                    })
                } else {
                    const changes = [
                        route?.subItem?.feed != feed ? `Feed from ${route?.subItem?.feed} to ${feed}` : '',
                        route?.subItem?.permeate != permeate ? `Permeate from ${route?.subItem?.permeate} to ${permeate}` : '',
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
                        permeate: permeate,
                        concentrate: concentrate,
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
                                    </View>
                                    <View style={main}>
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
                                                    onChangeText={(text) => (setRemark(text), console.log(text))}>
                                                </TextInput>
                                            </View>
                                        </View >
                                    </View>

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
                                            <View style={main}>
                                                <View style={sub}>
                                                    <View style={{ marginRight: 10 }}>
                                                        <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                            <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                                            <Text style={{ marginRight: 5, fontSize: 16 }}>Feed RO</Text>
                                                            <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}> {"(< 16 m³/h)"}</Text>
                                                            {(parseFloat(feedRO) > 16) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
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
                                                            <Text style={{ marginRight: 5, fontSize: 16 }}>Recycle</Text>
                                                            <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}> {"(< 4 m³/h)"}</Text>
                                                            {(parseFloat(recycle) > 3.5) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                                        </View>
                                                        <TextInput
                                                            keyboardType="decimal-pad"
                                                            value={recycle}
                                                            readOnly={!isEdit}
                                                            style={[styles.input, { width: '100%' }]}
                                                            placeholder="Please Enter"
                                                            onChangeText={(text) => setRecycle(text)}>
                                                        </TextInput>
                                                        {recycle == '' ?
                                                            <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Recycle</Text>
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
                                                            <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}> {"(< 4 m³/h)"}</Text>
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
                                                </View>
                                                <View style={sub}>
                                                    <View style={{ marginRight: 10 }}>
                                                        <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                            <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                                            <Text style={{ marginRight: 5, fontSize: 16 }}>Permeate</Text>
                                                            <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}> {"(8 - 10 m³/h)"}</Text>
                                                            {(parseFloat(permeate) < 8 || parseFloat(permeate) > 10) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                                        </View>
                                                        <TextInput
                                                            keyboardType="decimal-pad"
                                                            value={permeate}
                                                            readOnly={!isEdit}
                                                            style={[styles.input, { width: '100%' }]}
                                                            placeholder="Please Enter"
                                                            onChangeText={(text) => setPermeate(text)}>
                                                        </TextInput>
                                                        {permeate == '' ?
                                                            <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Permeate</Text>
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
                                                                <Text style={{ marginRight: 5, fontSize: 16 }}>Permeate</Text>
                                                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}> {(route?.subItem.control?.toLowerCase().includes("ph")) ? "(> 6.2)" : (route?.subItem.control?.toLowerCase().includes("tds")) ? "(< 30 ppm)" : ""}</Text>
                                                                {(parseFloat(permeate) < 6.2) && (route?.subItem.control?.toLowerCase().includes("ph")) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : (parseFloat(permeate) > 30) && (route?.subItem.control?.toLowerCase().includes("tds")) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                                            </View>
                                                            <TextInput
                                                                keyboardType="decimal-pad"
                                                                value={permeate}
                                                                readOnly={!isEdit}
                                                                style={[styles.input, { width: '100%' }]}
                                                                placeholder="Please Enter"
                                                                onChangeText={(text) => setPermeate(text)}>
                                                            </TextInput>
                                                            {permeate == '' ?
                                                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Permeate</Text>
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
                                            : <></>}
                        </View>
                    </ScrollView>
                    <AlertDialog
                        visible={visible.visible}
                        content="អ្នកមិនទាន់បានរក្សាទុកទេ, ច្បាស់ទេថានឹងចាក់ចេញ?"
                        hideDialog={() => setVisible({ visible: false })}
                        onPositive={() => navigation.goBack()}
                        onNegative={() => setVisible({ visible: false })} isLoading={false} />
                    {/* <ActivityModal log={activities} onClose={() => setShowlog(false)} isVisible={showLog} /> */}
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
