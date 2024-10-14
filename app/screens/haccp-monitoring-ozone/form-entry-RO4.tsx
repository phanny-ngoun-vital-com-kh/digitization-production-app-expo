/* eslint-disable camelcase */
import React, { FC, useEffect, useLayoutEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { useTheme } from "app/theme-v2"
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

interface HACCPMonitoringOzoneFormEntryRO4Props extends AppStackScreenProps<"HACCPMonitoringOzoneFormEntryRO4"> { }
export const HACCPMonitoringOzoneFormEntryRO4Screen: FC<HACCPMonitoringOzoneFormEntryRO4Props> = observer(
    function HACCPMonitoringOzoneFormEntryRO4Screen() {
        const navigation = useNavigation()
        const route = useRoute().params as RouteParams
        const { colors } = useTheme()
        const { haccpMonitoringOzoneStore, authStore } = useStores()
        const [isEdit, setIsEdit] = useState()
        const assignedUsers = route?.subItem?.assign_to_user.split(' ');
        const isUserAssigned = assignedUsers.includes(authStore?.userLogin ?? "");
        const [isloading, setLoading] = useState(false)
        const [feedArray1, setFeedArray1] = useState(route?.subItem.feed_array1 || '')
        const [feedArray2, setFeedArray2] = useState(route?.subItem.feed_array2 || '')
        const [cartridgeUm3, setCartridgeUm3] = useState(route?.subItem.cartridge_um3 || '')
        const [cartridgeUm08, setCartridgeUm08] = useState(route?.subItem.cartridge_um08 || '')
        const [concentrate, setConcentrate] = useState(route?.subItem.concentrate || '')
        const [remark, setRemark] = useState(route?.subItem.remark || '')
        const [array1, setArray1] = useState(route?.subItem.array1 || '')
        const [array2, setArray2] = useState(route?.subItem.array2 || '')
        const [permeate, setPermeate] = useState(route?.subItem.permeate || '')
        const [feedPht133, setfeedPht133] = useState(route?.subItem.feed_pht133 || '')
        const [feedFt102, setfeedFt102] = useState(route?.subItem.feed_ft102 || '')
        const [blending, setBlending] = useState(route?.subItem.blending || '')
        const [recycle, setRecycle] = useState(route?.subItem.recycle || '')
        const [ft171ft192, setft171ft192] = useState(route?.subItem.ft171_ft192 || '')
        const [adjustmentFt382, setadjustmentFt382] = useState(route?.subItem.adjustment_ft382 || '')
        const [ca384, setCa384] = useState(route?.subItem.ca384 || '')
        const [ca181, setCa181] = useState(route?.subItem.ca181 || '')
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
                                ((route?.subItem?.cartridge_um3 == null ? "" : route?.subItem?.cartridge_um3) != cartridgeUm3) ||
                                ((route?.subItem?.cartridge_um08 == null ? "" : route?.subItem?.cartridge_um08) != cartridgeUm08) ||
                                ((route?.subItem?.feed_array1 == null ? "" : route?.subItem?.feed_array1) != feedArray1) ||
                                ((route?.subItem?.feed_array2 == null ? "" : route?.subItem?.feed_array2) != feedArray2) ||
                                ((route?.subItem?.concentrate == null ? "" : route?.subItem?.concentrate) != concentrate) ||
                                ((route?.subItem?.remark == null ? "" : route?.subItem?.remark) != remark)

                            const change2 =
                                ((route?.subItem?.cartridge_um3 == null ? "" : route?.subItem?.cartridge_um3) != cartridgeUm3) ||
                                ((route?.subItem?.cartridge_um08 == null ? "" : route?.subItem?.cartridge_um08) != cartridgeUm08) ||
                                ((route?.subItem?.array1 == null ? "" : route?.subItem?.array1) != array1) ||
                                ((route?.subItem?.array2 == null ? "" : route?.subItem?.array2) != array2) ||
                                ((route?.subItem?.remark == null ? "" : route?.subItem?.remark) != remark)

                            const change3 =
                                ((route?.subItem?.permeate == null ? "" : route?.subItem?.permeate) != permeate) ||
                                ((route?.subItem?.blending == null ? "" : route?.subItem?.blending) != blending) ||
                                ((route?.subItem?.concentrate == null ? "" : route?.subItem?.concentrate) != concentrate) ||
                                ((route?.subItem?.remark == null ? "" : route?.subItem?.remark) != remark)

                            const change4 =
                                ((route?.subItem?.feed_ft102 == null ? "" : route?.subItem?.feed_ft102) != feedFt102) ||
                                ((route?.subItem?.concentrate == null ? "" : route?.subItem?.concentrate) != concentrate) ||
                                ((route?.subItem?.recycle == null ? "" : route?.subItem?.recycle) != recycle) ||
                                ((route?.subItem?.ft171_ft192 == null ? "" : route?.subItem?.ft171_ft192) != ft171ft192) ||
                                ((route?.subItem?.adjustment_ft382 == null ? "" : route?.subItem?.adjustment_ft382) != adjustmentFt382) ||
                                ((route?.subItem?.permeate == null ? "" : route?.subItem?.permeate) != permeate) ||
                                ((route?.subItem?.remark == null ? "" : route?.subItem?.remark) != remark)

                            const change5 =
                                ((route?.subItem?.ca384 == null ? "" : route?.subItem?.ca384) != ca384) ||
                                ((route?.subItem?.ca181 == null ? "" : route?.subItem?.ca181) != ca181) ||
                                ((route?.subItem?.remark == null ? "" : route?.subItem?.remark) != remark)

                            if (route?.subItem.control?.toLowerCase().includes("pressure")) {
                                if (change1) {
                                    setVisible({ visible: true })
                                } else {
                                    navigation.goBack()
                                }

                            }
                            else if (route?.subItem.control?.toLowerCase().includes("δp")) {
                                if (change2) {
                                    setVisible({ visible: true })
                                } else {
                                    navigation.goBack()
                                }
                            } else if (route?.subItem.control?.toLowerCase().includes("ph") || route?.subItem.control?.toLowerCase().includes("tds")) {
                                if (route?.subItem.control?.toLowerCase().includes("ph")) {
                                    if (change3 || ((route?.subItem?.feed_pht133 == null ? "" : route?.subItem?.feed_pht133) != feedPht133)) {
                                        setVisible({ visible: true })
                                    } else {
                                        navigation.goBack()
                                    }
                                } else if (route?.subItem.control?.toLowerCase().includes("tds")) {
                                    if (change3 || ((route?.subItem?.feed_ft102 == null ? "" : route?.subItem?.feed_ft102) != feedFt102)) {
                                        setVisible({ visible: true })
                                    } else {
                                        navigation.goBack()
                                    }
                                }

                            }
                            else if (route?.subItem.control?.toLowerCase().includes("flow rate")) {
                                if (change4) {
                                    setVisible({ visible: true })
                                } else {
                                    navigation.goBack()
                                }
                            
                            } else if (route?.subItem.control?.toLowerCase().includes("permeate")) {
                                if (change5) {
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
        }, [navigation, route, isEdit, cartridgeUm3, cartridgeUm08, feedArray1, feedArray2, concentrate, remark, array1, array2, feedFt102, feedPht133, recycle, permeate, adjustmentFt382, ft171ft192, ca181, ca384])

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
                if (cartridgeUm3 == '') {
                    alert('បរាជ័យ', 'សូ​មបំពេញ Cartridge 3 µm')
                    return
                }
                if (cartridgeUm08 == '') {
                    alert('បរាជ័យ', 'សូ​មបំពេញ Cartridge 0.8 µm')
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
                if (parseFloat(cartridgeUm3) > 5.1) {
                    updatedWarningCount++;
                }
                if (parseFloat(cartridgeUm08) > 5.1) {
                    updatedWarningCount++;
                }
                if (parseFloat(feedArray1) > 15) {
                    updatedWarningCount++;
                }
                if (parseFloat(feedArray2) > 15) {
                    updatedWarningCount++;
                }
                if (parseFloat(concentrate) > 15) {
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
                        cartridge_um3: cartridgeUm3,
                        cartridge_um08: cartridgeUm08,
                        feed_array1: feedArray1,
                        feed_array2: feedArray2,
                        concentrate: concentrate,
                        remark: remark
                    })
                } else {
                    const changes = [
                        route?.subItem?.cartridge_um3 != cartridgeUm3 ? `Cartridge 3 µm from ${route?.subItem?.cartridge_um3} to ${cartridgeUm3}` : '',
                        route?.subItem?.cartridge_um08 != cartridgeUm08 ? `Cartridge 0.8 µm from ${route?.subItem?.cartridge_um08} to ${cartridgeUm08}` : '',
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
                        cartridge_um3: cartridgeUm3,
                        cartridge_um08: cartridgeUm08,
                        feed_array1: feedArray1,
                        feed_array2: feedArray2,
                        concentrate: concentrate,
                        remark: remark
                    })
                }
            } if (route?.subItem.control?.toLowerCase().includes("δp")) {
                if (cartridgeUm3 == '') {
                    alert('បរាជ័យ', 'សូ​មបំពេញ ΔP Cartridge 3 µm')
                    return
                }
                if (cartridgeUm08 == '') {
                    alert('បរាជ័យ', 'សូ​មបំពេញ ΔP Cartridge 0.8 µm')
                    return
                }
                if (array1 == '') {
                    alert('បរាជ័យ', 'សូ​មបំពេញ Array 1')
                    return
                }
                if (array2 == '') {
                    alert('បរាជ័យ', 'សូ​មបំពេញ Array 2')
                    return
                }
                let updatedWarningCount = 0;
                let status = 'normal'
                if (parseFloat(cartridgeUm3) < 0.2) {
                    updatedWarningCount++;
                }
                if (parseFloat(cartridgeUm08) < 0.2) {
                    updatedWarningCount++;
                }
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
                        cartridge_um3: cartridgeUm3,
                        cartridge_um08: cartridgeUm08,
                        array1: array1,
                        array2: array2,
                        remark: remark
                    })
                } else {
                    const changes = [
                        route?.subItem?.cartridge_um3 != cartridgeUm3 ? `ΔP Cartridge 3 µm from ${route?.subItem?.cartridge_um3} to ${cartridgeUm3}` : '',
                        route?.subItem?.cartridge_um08 != cartridgeUm08 ? `ΔP Cartridge 0.8 µm from ${route?.subItem?.cartridge_um08} to ${cartridgeUm08}` : '',
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
                        cartridge_um3: cartridgeUm3,
                        cartridge_um08: cartridgeUm08,
                        array1: array1,
                        array2: array2,
                        remark: remark
                    })
                }
            } else if (route?.subItem.control?.toLowerCase().includes("ph") || route?.subItem.control?.toLowerCase().includes("tds")) {
                if (route?.subItem.control?.toLowerCase().includes("ph")) {
                    if (feedPht133 == '') {
                        alert('បរាជ័យ', 'សូ​មបំពេញ Feed PHT133')
                        return
                    }
                } else if (route?.subItem.control?.toLowerCase().includes("tds")) {
                    if (feedFt102 == '') {
                        alert('បរាជ័យ', 'សូ​មបំពេញ Feed FT102')
                        return
                    }
                }
                if (permeate == '') {
                    alert('បរាជ័យ', 'សូ​មបំពេញ Permeate')
                    return
                }
                if (blending == '') {
                    alert('បរាជ័យ', 'សូ​មបំពេញ Blending')
                    return
                }
                if (concentrate == '') {
                    alert('បរាជ័យ', 'សូ​មបំពេញ Concentrate')
                    return
                }
                let updatedWarningCount = 0;
                let status = 'normal'
                if (route?.subItem.control?.toLowerCase().includes("ph")) {
                    if (parseFloat(feedPht133) < 6.5 || parseFloat(feedPht133) > 8.5) {
                        updatedWarningCount++;
                    }
                    if (parseFloat(permeate) < 6.2) {
                        updatedWarningCount++;
                    }
                    if (parseFloat(blending) < 6.5 || parseFloat(blending) > 8.5) {
                        updatedWarningCount++;
                    }
                    if (parseFloat(concentrate) < 5.0 || parseFloat(concentrate) > 9.0) {
                        updatedWarningCount++;
                    }
                    if (updatedWarningCount > 0) {
                        status = 'warning'
                    }
                } else if (route?.subItem.control?.toLowerCase().includes("tds")) {
                    if (parseFloat(feedFt102) > 400) {
                        updatedWarningCount++;
                    }
                    if (parseFloat(permeate) > 30) {
                        updatedWarningCount++;
                    }
                    if (parseFloat(blending) > 30) {
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
                        feed_pht133: feedPht133,
                        feed_ft102: feedFt102,
                        blending: blending,
                        permeate: permeate,
                        concentrate: concentrate,
                        remark: remark
                    })
                } else {
                    const changes = [
                        route?.subItem?.feed_pht133 != feedPht133 ? `Feed PHT133 from ${route?.subItem?.feed_pht133} to ${feedPht133}` : '',
                        route?.subItem?.feed_ft102 != feedFt102 ? `Feed FT102 from ${route?.subItem?.feed_ft102} to ${feedFt102}` : '',
                        route?.subItem?.permeate != permeate ? `Permeate from ${route?.subItem?.permeate} to ${permeate}` : '',
                        route?.subItem?.blending != blending ? `Blending from ${route?.subItem?.blending} to ${blending}` : '',
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
                        feed_pht133: feedPht133,
                        feed_ft102: feedFt102,
                        blending: blending,
                        permeate: permeate,
                        concentrate: concentrate,
                        remark: remark
                    })
                }
            } else if (route?.subItem.control?.toLowerCase().includes("flow rate")) {
                if (feedFt102 == '') {
                    alert('បរាជ័យ', 'សូ​មបំពេញ Feed FT102')
                    return
                }
                if (concentrate == '') {
                    alert('បរាជ័យ', 'សូ​មបំពេញ Concentrate FT171')
                    return
                }
                if (recycle == '') {
                    alert('បរាជ័យ', 'សូ​មបំពេញ Recycle FT192')
                    return
                }
                if (ft171ft192 == '') {
                    alert('បរាជ័យ', 'សូ​មបំពេញ FT171 + FT192')
                    return
                }
                if (adjustmentFt382 == '') {
                    alert('បរាជ័យ', 'សូ​មបំពេញ Adjustment FT382 ')
                    return
                }
                if (permeate == '') {
                    alert('បរាជ័យ', 'សូ​មបំពេញ Permeate')
                    return
                }
                let updatedWarningCount = 0;
                let status = 'normal'
                if (parseFloat(feedFt102) > 75000) {
                    updatedWarningCount++;
                }
                if (parseFloat(concentrate) > 15000) {
                    updatedWarningCount++;
                }
                if (parseFloat(recycle) > 25000) {
                    updatedWarningCount++;
                }
                if (parseFloat(ft171ft192) > 40000) {
                    updatedWarningCount++;
                }
                if (parseFloat(adjustmentFt382) > 14000) {
                    updatedWarningCount++;
                }
                if (parseFloat(permeate) < 52 || parseFloat(permeate) > 62) {
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
                        feed_ft102: feedFt102,
                        recycle: recycle,
                        concentrate: concentrate,
                        ft171_ft192: ft171ft192,
                        adjustment_ft382: adjustmentFt382,
                        permeate: permeate,
                        remark: remark
                    })
                } else {
                    const changes = [
                        route?.subItem?.feed_ft102 != feedFt102 ? `Feed FT102 from ${route?.subItem?.feed_ft102} to ${feedFt102}` : '',
                        route?.subItem?.concentrate != concentrate ? `Concentrate FT171 from ${route?.subItem?.concentrate} to ${concentrate}` : '',
                        route?.subItem?.recycle != recycle ? `Recycle FT192 from ${route?.subItem?.recycle} to ${recycle}` : '',
                        route?.subItem?.ft171_ft192 != ft171ft192 ? `FT171 + FT192 from ${route?.subItem?.ft171_ft192} to ${ft171ft192}` : '',
                        route?.subItem?.adjustment_ft382 != adjustmentFt382 ? `Adjustment FT382 from ${route?.subItem?.adjustment_ft382} to ${adjustmentFt382}` : '',
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
                        feed_ft102: feedFt102,
                        recycle: recycle,
                        concentrate: concentrate,
                        ft171_ft192: ft171ft192,
                        adjustment_ft382: adjustmentFt382,
                        permeate: permeate,
                        remark: remark
                    })
                }
            } else if (route?.subItem.control?.toLowerCase().includes("permeate")) {
                if (ca384 == '') {
                    alert('បរាជ័យ', 'សូ​មបំពេញ 1 CA384')
                    return
                }
                if (ca181 == '') {
                    alert('បរាជ័យ', 'សូ​មបំពេញ 2 CA181')
                    return
                }
                let updatedWarningCount = 0;
                let status = 'normal'
                if (parseFloat(ca384) > 60) {
                    updatedWarningCount++;
                }
                if (parseFloat(ca181) > 60) {
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
                        ca384: ca384,
                        ca181: ca181,
                        remark: remark
                    })
                } else {
                    const changes = [
                        route?.subItem?.ca384 != ca384 ? `1 CA384 from ${route?.subItem?.ca384} to ${ca384}` : '',
                        route?.subItem?.ca181 != ca181 ? `2 CA181 from ${route?.subItem?.ca181} to ${ca181}` : '',
                        route?.subItem?.remark != remark ? `Remark from ${route?.subItem?.remark == null ? '' : route?.subItem?.remark} to ${remark}` : ''
                    ];
                    const actionString = changes.filter(change => change !== '').join(', ');
                    entity = HACCPMonitoringOzoneListModel.create({
                        id: route?.subItem?.id,
                        warning_count: updatedWarningCount,
                        status: status,
                        action: `has modified ${actionString}`,
                        haccp_ozone_id: route?.subItem?.haccp_ozone_id,
                        ca384: ca384,
                        ca181: ca181,
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
                if(rs == 'Success'){
                    Dialog.show({
                        type: ALERT_TYPE.SUCCESS,
                        title: 'ជោគជ័យ',
                        textBody: 'រក្សាទុកបានជោគជ័យ',
                        // button: 'close',
                        autoClose: 100
                    })
                    navigation.goBack()
                }else{
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
                                                    <Text style={{ marginRight: 5, fontSize: 16 }}>Cartridge 3 µm</Text>
                                                    <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}> {"(< 5.1 bar)"}</Text>
                                                    {(parseFloat(cartridgeUm3) > 5.1) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                                </View>
                                                <TextInput
                                                    keyboardType="decimal-pad"
                                                    value={cartridgeUm3}
                                                    readOnly={!isEdit}
                                                    style={[styles.input, { width: '100%' }]}
                                                    placeholder="Please Enter"
                                                    onChangeText={(text) => setCartridgeUm3(text)}>
                                                </TextInput>
                                                {cartridgeUm3 == '' ?
                                                    <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Cartridge 3 µm</Text>
                                                    : <></>}
                                            </View>
                                        </View >
                                        <View style={sub}>
                                            <View style={{ marginRight: 10 }}>
                                                <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                    <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                                    <Text style={{ marginRight: 5, fontSize: 16 }}>Cartridge 0.8 µm</Text>
                                                    <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}> {"(< 5.1 bar)"}</Text>
                                                    {(parseFloat(cartridgeUm08) > 5.1) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                                </View>
                                                <TextInput
                                                    keyboardType="decimal-pad"
                                                    value={cartridgeUm08}
                                                    readOnly={!isEdit}
                                                    style={[styles.input, { width: '100%' }]}
                                                    placeholder="Please Enter"
                                                    onChangeText={(text) => setCartridgeUm08(text)}>
                                                </TextInput>
                                                {cartridgeUm08 == '' ?
                                                    <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Cartridge 0.8 µm</Text>
                                                    : <></>}
                                            </View>
                                        </View >
                                    </View>
                                    <View style={main}>
                                        <View style={sub}>
                                            <View style={{ marginRight: 10 }}>
                                                <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                    <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                                    <Text style={{ marginRight: 5, fontSize: 16 }}>Feed Array 1 (PT141)</Text>
                                                    <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}> {"(< 15 bar)"}</Text>
                                                    {(parseFloat(feedArray1) > 15) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
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
                                                    <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Feed Array 1 (PT141)</Text>
                                                    : <></>}
                                            </View>
                                        </View >
                                        <View style={sub}>
                                            <View style={{ marginRight: 10 }}>
                                                <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                    <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                                    <Text style={{ marginRight: 5, fontSize: 16 }}>Feed Array 2 (PT142)</Text>
                                                    <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}> {"(< 15 bar)"}</Text>
                                                    {(parseFloat(feedArray2) > 15) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
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
                                                    <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Feed Array 2 (PT142)</Text>
                                                    : <></>}
                                            </View>
                                        </View >
                                    </View>
                                    <View style={main}>
                                        <View style={sub}>
                                            <View style={{ marginRight: 10 }}>
                                                <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                    <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                                    <Text style={{ marginRight: 5, fontSize: 16 }}>Concentrate (PT145)</Text>
                                                    <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}> {"(< 15 bar)"}</Text>
                                                    {(parseFloat(concentrate) > 15) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
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
                                                    <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Concentrate (PT145)</Text>
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

                                : (route?.subItem.control?.toLowerCase().includes("δp")) ?
                                    <View>
                                        <View style={main}>
                                            <View style={sub}>
                                                <View style={{ marginRight: 10 }}>
                                                    <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                        <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                                        <Text style={{ marginRight: 5, fontSize: 16 }}>ΔP Cartridge 3 µm</Text>
                                                        <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}> {"(> 0.2 bar)"}</Text>
                                                        {(parseFloat(cartridgeUm3) < 0.2) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                                    </View>
                                                    <TextInput
                                                        keyboardType="decimal-pad"
                                                        value={cartridgeUm3}
                                                        readOnly={!isEdit}
                                                        style={[styles.input, { width: '100%' }]}
                                                        placeholder="Please Enter"
                                                        onChangeText={(text) => setCartridgeUm3(text)}>
                                                    </TextInput>
                                                    {cartridgeUm3 == '' ?
                                                        <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ ΔP Cartridge 3 µm</Text>
                                                        : <></>}
                                                </View>
                                            </View >
                                            <View style={sub}>
                                                <View style={{ marginRight: 10 }}>
                                                    <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                        <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                                        <Text style={{ marginRight: 5, fontSize: 16 }}>ΔP Cartridge 0.8 µm</Text>
                                                        <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}> {"(> 0.2 bar)"}</Text>
                                                        {(parseFloat(cartridgeUm08) < 0.2) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                                    </View>
                                                    <TextInput
                                                        keyboardType="decimal-pad"
                                                        value={cartridgeUm08}
                                                        readOnly={!isEdit}
                                                        style={[styles.input, { width: '100%' }]}
                                                        placeholder="Please Enter"
                                                        onChangeText={(text) => setCartridgeUm08(text)}>
                                                    </TextInput>
                                                    {cartridgeUm08 == '' ?
                                                        <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ ΔP Cartridge 0.8 µm</Text>
                                                        : <></>}
                                                </View>
                                            </View >
                                        </View>
                                        <View style={main}>
                                            <View style={sub}>
                                                <View style={{ marginRight: 10 }}>
                                                    <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                        <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                                        <Text style={{ marginRight: 5, fontSize: 16 }}>Array 1 PT(141-142)</Text>
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
                                                        <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Array 1 PT(141-142)</Text>
                                                        : <></>}
                                                </View>
                                            </View >
                                            <View style={sub}>
                                                <View style={{ marginRight: 10 }}>
                                                    <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                        <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                                        <Text style={{ marginRight: 5, fontSize: 16 }}>Array 2 PT(142-145)</Text>
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
                                                        <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Array 2 PT(142-145)</Text>
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
                                                {(route?.subItem.control?.toLowerCase().includes("ph")) ?
                                                    <View style={sub}>
                                                        <View style={{ marginRight: 10 }}>
                                                            <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                                <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                                                <Text style={{ marginRight: 5, fontSize: 16 }}>Feed PHT133</Text>
                                                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}> {"(6.5 - 8.5)"}</Text>
                                                                {(parseFloat(feedPht133) < 6.5 || parseFloat(feedPht133) > 8.5) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                                            </View>
                                                            <TextInput
                                                                keyboardType="decimal-pad"
                                                                value={feedPht133}
                                                                readOnly={!isEdit}
                                                                style={[styles.input, { width: '100%' }]}
                                                                placeholder="Please Enter"
                                                                onChangeText={(text) => setfeedPht133(text)}>
                                                            </TextInput>
                                                            {feedPht133 == '' ?
                                                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Feed PHT133</Text>
                                                                : <></>}
                                                        </View>
                                                    </View >
                                                    : (route?.subItem.control?.toLowerCase().includes("tds")) ?
                                                        <View style={sub}>
                                                            <View style={{ marginRight: 10 }}>
                                                                <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                                    <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                                                    <Text style={{ marginRight: 5, fontSize: 16 }}>Feed FT102</Text>
                                                                    <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}> {"(< 400 ppm)"}</Text>
                                                                    {(parseFloat(feedFt102) > 400) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                                                </View>
                                                                <TextInput
                                                                    keyboardType="decimal-pad"
                                                                    value={feedFt102}
                                                                    readOnly={!isEdit}
                                                                    style={[styles.input, { width: '100%' }]}
                                                                    placeholder="Please Enter"
                                                                    onChangeText={(text) => setfeedFt102(text)}>
                                                                </TextInput>
                                                                {feedFt102 == '' ?
                                                                    <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Feed FT102</Text>
                                                                    : <></>}
                                                            </View>
                                                        </View >
                                                        : <></>}
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
                                                            <Text style={{ marginRight: 5, fontSize: 16 }}>Blending</Text>
                                                            <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}> {(route?.subItem.control?.toLowerCase().includes("ph")) ? "(6.5 - 8.5)" : (route?.subItem.control?.toLowerCase().includes("tds")) ? "(< 30 ppm)" : ""}</Text>
                                                            {(parseFloat(blending) < 6.5 || parseFloat(blending) > 8.5) && (route?.subItem.control?.toLowerCase().includes("ph")) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : (parseFloat(blending) > 30) && (route?.subItem.control?.toLowerCase().includes("tds")) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                                        </View>
                                                        <TextInput
                                                            keyboardType="decimal-pad"
                                                            value={blending}
                                                            readOnly={!isEdit}
                                                            style={[styles.input, { width: '100%' }]}
                                                            placeholder="Please Enter"
                                                            onChangeText={(text) => setBlending(text)}>
                                                        </TextInput>
                                                        {blending == '' ?
                                                            <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Blending</Text>
                                                            : <></>}
                                                    </View>
                                                </View >
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
                                                                <Text style={{ marginRight: 5, fontSize: 16 }}>Feed FT02</Text>
                                                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}> {"(< 75000 L/h)"}</Text>
                                                                {(parseFloat(feedFt102) > 75000) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                                            </View>
                                                            <TextInput
                                                                keyboardType="decimal-pad"
                                                                value={feedFt102}
                                                                readOnly={!isEdit}
                                                                style={[styles.input, { width: '100%' }]}
                                                                placeholder="Please Enter"
                                                                onChangeText={(text) => setfeedFt102(text)}>
                                                            </TextInput>
                                                            {feedFt102 == '' ?
                                                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Feed FT02</Text>
                                                                : <></>}
                                                        </View>
                                                    </View >
                                                    <View style={sub}>
                                                        <View style={{ marginRight: 10 }}>
                                                            <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                                <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                                                <Text style={{ marginRight: 5, fontSize: 16 }}>Concentrate FT171</Text>
                                                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}> {"(< 15000 L/h)"}</Text>
                                                                {(parseFloat(concentrate) > 15000) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
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
                                                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Concentrate FT171</Text>
                                                                : <></>}
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={main}>
                                                    <View style={sub}>
                                                        <View style={{ marginRight: 10 }}>
                                                            <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                                <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                                                <Text style={{ marginRight: 5, fontSize: 16 }}>Recycle FT192</Text>
                                                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}> {"(< 25000 L/h)"}</Text>
                                                                {(parseFloat(recycle) > 25000) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
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
                                                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Recycle FT192</Text>
                                                                : <></>}
                                                        </View>
                                                    </View >
                                                    <View style={sub}>
                                                        <View style={{ marginRight: 10 }}>
                                                            <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                                <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                                                <Text style={{ marginRight: 5, fontSize: 16 }}>FT171 + FT192</Text>
                                                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}> {"(< 40000 L/h)"}</Text>
                                                                {(parseFloat(ft171ft192) > 40000) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                                            </View>
                                                            <TextInput
                                                                keyboardType="decimal-pad"
                                                                value={ft171ft192}
                                                                readOnly={!isEdit}
                                                                style={[styles.input, { width: '100%' }]}
                                                                placeholder="Please Enter"
                                                                onChangeText={(text) => setft171ft192(text)}>
                                                            </TextInput>
                                                            {ft171ft192 == '' ?
                                                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ FT171 + FT192</Text>
                                                                : <></>}
                                                        </View>
                                                    </View >
                                                </View>
                                                <View style={main}>
                                                    <View style={sub}>
                                                        <View style={{ marginRight: 10 }}>
                                                            <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                                <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                                                <Text style={{ marginRight: 5, fontSize: 16 }}>Adjustment FT382</Text>
                                                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}> {"(< 14000 L/h)"}</Text>
                                                                {(parseFloat(adjustmentFt382) > 25000) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                                            </View>
                                                            <TextInput
                                                                keyboardType="decimal-pad"
                                                                value={adjustmentFt382}
                                                                readOnly={!isEdit}
                                                                style={[styles.input, { width: '100%' }]}
                                                                placeholder="Please Enter"
                                                                onChangeText={(text) => setadjustmentFt382(text)}>
                                                            </TextInput>
                                                            {adjustmentFt382 == '' ?
                                                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Adjustment FT382</Text>
                                                                : <></>}
                                                        </View>
                                                    </View >
                                                    <View style={sub}>
                                                        <View style={{ marginRight: 10 }}>
                                                            <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                                <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                                                <Text style={{ marginRight: 5, fontSize: 16 }}>Permeate</Text>
                                                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}> {"(52 - 62 m³/h)"}</Text>
                                                                {(parseFloat(permeate) < 52 || parseFloat(permeate) > 62) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
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
                                            : (route?.subItem.control?.toLowerCase().includes("permeate")) ?
                                                <View>
                                                    <View style={main}>
                                                        <View style={sub}>
                                                            <View style={{ marginRight: 10 }}>
                                                                <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                                    <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                                                    <Text style={{ marginRight: 5, fontSize: 16 }}>1 CA384</Text>
                                                                    <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}> {"(< 60 µS)"}</Text>
                                                                    {(parseFloat(ca384) > 60) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                                                </View>
                                                                <TextInput
                                                                    keyboardType="decimal-pad"
                                                                    value={ca384}
                                                                    readOnly={!isEdit}
                                                                    style={[styles.input, { width: '100%' }]}
                                                                    placeholder="Please Enter"
                                                                    onChangeText={(text) => setCa384(text)}>
                                                                </TextInput>
                                                                {ca384 == '' ?
                                                                    <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ 1 CA384</Text>
                                                                    : <></>}
                                                            </View>
                                                        </View >
                                                        <View style={sub}>
                                                            <View style={{ marginRight: 10 }}>
                                                                <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                                                    <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                                                    <Text style={{ marginRight: 5, fontSize: 16 }}>2 CA181</Text>
                                                                    <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}> {"(< 60 µS)"}</Text>
                                                                    {(parseFloat(ca181) > 60) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                                                </View>
                                                                <TextInput
                                                                    keyboardType="decimal-pad"
                                                                    value={ca181}
                                                                    readOnly={!isEdit}
                                                                    style={[styles.input, { width: '100%' }]}
                                                                    placeholder="Please Enter"
                                                                    onChangeText={(text) => setCa181(text)}>
                                                                </TextInput>
                                                                {ca181 == '' ?
                                                                    <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ 2 CA181</Text>
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
