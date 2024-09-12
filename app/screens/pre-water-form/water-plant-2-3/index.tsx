import React, { FC, useEffect, useLayoutEffect, useState } from "react"
import Icon from "react-native-vector-icons/Ionicons"
import * as ImagePicker from "expo-image-picker"
import { observer } from "mobx-react-lite"
import { AppStackScreenProps } from "app/navigators"
import {
  View,
  ViewStyle,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  ScrollView,
  TextInput
} from "react-native"
import { Text } from "app/components/v2"
import ActivityBar from "app/components/v2/WaterTreatment/ActivityBar"
import { useNavigation, useRoute } from "@react-navigation/native"
import CustomInput from "app/components/v2/DailyPreWater/CustomInput"
import { Checkbox, Divider } from "react-native-paper"
import { useStores } from "app/models"
import { PreTreatmentListItemModel } from "app/models/pre-water-treatment/pre-water-treatment-model"
import { ALERT_TYPE, Dialog } from "react-native-alert-notification"
import ActivityModal from "app/components/v2/ActivitylogModal"
import { styles } from "../styles"
import BadgeWarning from "app/components/v2/Badgewarn"
import { ImagetoText, getResultImageCamera, getResultImageGallery } from "app/utils-v2/ocr"
import { translate } from "../../../i18n/translate"
import IconAntDesign from "react-native-vector-icons/AntDesign"

interface PreWaterForm1ScreenProps extends AppStackScreenProps<"PreWaterForm1"> { }

export const PreWaterForm1Screen: FC<PreWaterForm1ScreenProps> = observer(
  function PreWaterForm1Screen() {
    const navigation = useNavigation()
    const [activities, setActivities] = useState([])
    const { preWaterTreatmentStore, authStore } = useStores()
    const [isloading, setLoading] = useState(false)
    const [isScanning, setScanning] = useState(false)
    const route = useRoute().params
    const [image, setImage] = useState(null)
    const [showLog, setShowlog] = useState<boolean>(false)
    const [sf, setSf] = useState(route?.item?.sf || '')
    const [acf, setacf] = useState(route?.item?.acf || '')
    const [resin, setResin] = useState(route?.item?.resin || '')
    const [um5, setum5] = useState(route?.item?.um5 || '')
    const [other, setOther] = useState(route?.item?.remark || '')
    const [airSF, setAirSF] = useState(route?.item?.sf != null ? parseFloat(route?.item?.sf) : null)
    const [airACF, setAirACF] = useState(route?.item?.acf != null ? parseFloat(route?.item?.acf) : null)
    const [airResin, setAirResin] = useState(route?.item?.resin != null ? parseFloat(route?.item?.resin) : null)
    const [rawWater, setRawWater] = useState(route?.item?.raw_water || '')
    const assignedUsers = route?.item?.assign_to_user.split(' ');
    const [isEdit, setIsEdit] = useState()
    const isUserAssigned = assignedUsers.includes(authStore?.userLogin);
    // const isEdit = (route?.isvalidDate && isUserAssigned && route?.isValidShift)
    const [form, setForm] = useState({
      sf: "",
      acf: "",
      resin: "",
      raw_water: "",
      fiveMm: "",
      remarks: "",
      air_released: {
        sf: null,
        acf: null,
        resin: null,
        remarks: "",
      },
    })

    const [oldRoute, setRoute] = useState({})
    const [isEditable, setEditable] = useState(false)
    const [errors, setErrors] = useState({
      sf: true,
      acf: true,
      resin: true,
      raw_water: true,
      fiveMm: true,
      remarks: true,
      air_released: false,
    })
    
    useEffect(() => {
      const role = async () => {
        try {
          const rs = await authStore.getUserInfo();
          const admin=rs.data.authorities.includes('ROLE_PROD_PRO_ADMIN')
          const edit = (route?.isvalidDate && isUserAssigned && route?.isValidShift) || admin
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
        headerShown: true,
        title: route?.type,

        headerTitle: (props) => (
          <TouchableOpacity {...props}>
            <Text semibold body1>
              {route?.type}

              {route?.type?.toLowerCase().includes("air") ? (
                <Text errorColor semibold body2>
                  {`  (Y / N )`}
                </Text>
              ) : route?.type?.toLowerCase().includes("tds") ? (
                <Text errorColor semibold body2>
                  {`  ( ≤300 ppm )`}
                </Text>
              ) : route?.type?.toLowerCase().includes("ph") ? (
                <Text errorColor semibold body2>
                  {` ( 6.5 - 8.5  )`}
                </Text>
              ) : (
                <Text errorColor semibold body2>
                  {`   ( 0.1 - 0.3 Mpa )`}
                </Text>
              )}
            </Text>
          </TouchableOpacity>
        ),

        headerRight: () =>

          (isEdit) ? (
            <TouchableOpacity
              style={$horizon}
              onPress={() => {
                submit()
              }}
            >
              <Icon name="checkmark-sharp" size={24} color={"#0081F8"} />
              <Text primaryColor body1 semibold>
                {translate("wtpcommon.save")}
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              <Text></Text>
            </>
          ),
      })
    }, [form, route, errors, oldRoute, isEditable, sf, acf, resin, um5, other, airACF, airResin, airSF, rawWater,isEdit])

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
      if (route?.type?.toLowerCase().includes("pressure")) {
        if (sf == '') {
          alert('បរាជ័យ', 'សូ​មបំពេញ SF')
          return
        }
        if (acf == '') {
          alert('បរាជ័យ', 'សូ​មបំពេញ ACF')
          return
        }
        if (resin == '') {
          alert('បរាជ័យ', 'សូ​មបំពេញ Resin')
          return
        }
        if (um5 == '') {
          alert('បរាជ័យ', 'សូ​មបំពេញ 5µm')
          return
        }
        let updatedWarningCount = 0;
        let status = 'normal'
        if (parseFloat(sf) < 0.1 || parseFloat(sf) > 0.3) {
          updatedWarningCount++;
        }
        if (parseFloat(acf) < 0.1 || parseFloat(acf) > 0.3) {
          updatedWarningCount++;
        }
        if (parseFloat(resin) < 0.1 || parseFloat(resin) > 0.3) {
          updatedWarningCount++;
        }
        if (parseFloat(um5) < 0.1 || parseFloat(um5) > 0.3) {
          updatedWarningCount++;
        }
        if (updatedWarningCount > 0) {
          status = 'warning'
        }
        if (route?.item?.status == 'pending') {
          entity = PreTreatmentListItemModel.create({
            id: route?.item?.id,
            warning_count: updatedWarningCount,
            status: status,
            action: "Add Treatment",
            pre_treatment_id: route?.item?.pre_treatment_id,
            pre_treatment_type: route?.item?.pre_treatment_type,
            sf: sf,
            acf: acf,
            resin: resin,
            um5: um5,
            remark: other
          })

        } else {
          const changes = [
            route?.item?.sf != sf ? `SF from ${route?.item?.sf} to ${sf}` : '',
            route?.item?.acf != acf ? `ACF from ${route?.item?.acf} to ${acf}` : '',
            route?.item?.resin != resin ? `Resin from ${route?.item?.resin} to ${resin}` : '',
            route?.item?.um5 != um5 ? `5µm from ${route?.item?.um5} to ${um5}` : '',
            route?.item?.remark != other ? `Remark from ${route?.item?.remark == null ? '' : route?.item?.remark} to ${other}` : ''
          ];
          const actionString = changes.filter(change => change !== '').join(', ');
          entity = PreTreatmentListItemModel.create({
            id: route?.item?.id,
            warning_count: updatedWarningCount,
            status: status,
            action: `has modified ${actionString}`,
            pre_treatment_id: route?.item?.pre_treatment_id,
            pre_treatment_type: route?.item?.pre_treatment_type, sf: sf,
            acf: acf,
            resin: resin,
            um5: um5,
            remark: other
          })
        }
      } else if (route?.type?.toLowerCase().includes("air")) {
        if (airSF == null) {
          alert('បរាជ័យ', 'សូ​មបំពេញ SF')
          return
        }
        if (airACF == null) {
          alert('បរាជ័យ', 'សូ​មបំពេញ ACF')
          return
        }
        if (airResin == null) {
          alert('បរាជ័យ', 'សូ​មបំពេញ Resin')
          return
        }
        let updatedWarningCount = 0;
        let status = 'normal'
        if (airSF == 0) {
          updatedWarningCount++;
        }
        if (airACF == 0) {
          updatedWarningCount++;
        }
        if (airResin == 0) {
          updatedWarningCount++;
        }
        if (updatedWarningCount > 0) {
          status = 'warning'
        }
        if (route?.item?.status == 'pending') {
          entity = PreTreatmentListItemModel.create({
            id: route?.item?.id,
            warning_count: updatedWarningCount,
            status: status,
            action: "Add Treatment",
            pre_treatment_id: route?.item?.pre_treatment_id,
            pre_treatment_type: route?.item?.pre_treatment_type,
            sf: airSF.toString(),
            acf: airACF.toString(),
            resin: airResin.toString(),
            remark: other
          })

        } else {
          const changes = [
            route?.item?.sf != airSF ? `SF from ${route?.item?.sf == 1 ? 'Yes' : 'No'} to ${airSF == 1 ? 'Yes' : 'No'}` : '',
            route?.item?.acf != airACF ? `ACF from ${route?.item?.acf == 1 ? 'Yes' : 'No'} to ${airACF == 1 ? 'Yes' : 'No'}` : '',
            route?.item?.resin != airResin ? `Resin from ${route?.item?.resin == 1 ? 'Yes' : 'No'} to ${airResin == 1 ? 'Yes' : 'No'}` : '',
            route?.item?.remark != other ? `Remark from ${route?.item?.remark == null ? '' : route?.item?.remark} to ${other}` : ''
          ];
          const actionString = changes.filter(change => change !== '').join(', ');
          entity = PreTreatmentListItemModel.create({
            id: route?.item?.id,
            warning_count: updatedWarningCount,
            status: status,
            action: `has modified ${actionString}`,
            pre_treatment_id: route?.item?.pre_treatment_id,
            pre_treatment_type: route?.item?.pre_treatment_type,
            sf: airSF.toString(),
            acf: airACF.toString(),
            resin: airResin.toString(),
            remark: other
          })
        }
      } else if (route?.type?.toLowerCase().includes("tds") || route?.type?.toLowerCase().includes("ph")) {
        if (rawWater == '') {
          alert('បរាជ័យ', 'សូ​មបំពេញ Raw Water')
          return
        }
        if (sf == '') {
          alert('បរាជ័យ', 'សូ​មបំពេញ SF')
          return
        }
        if (acf == '') {
          alert('បរាជ័យ', 'សូ​មបំពេញ ACF')
          return
        }
        if (resin == '') {
          alert('បរាជ័យ', 'សូ​មបំពេញ Resin')
          return
        }
        if (um5 == '') {
          alert('បរាជ័យ', 'សូ​មបំពេញ 5µm')
          return
        }
        let updatedWarningCount = 0;
        let status = 'normal'
        if (route?.type?.toLowerCase().includes("tds")) {
          if (parseFloat(rawWater) > 300) {
            updatedWarningCount++;
          }
          if (parseFloat(sf) > 300) {
            updatedWarningCount++;
          }
          if (parseFloat(acf) > 300) {
            updatedWarningCount++;
          }
          if (parseFloat(resin) > 300) {
            updatedWarningCount++;
          }
          if (parseFloat(um5) > 300) {
            updatedWarningCount++;
          }
          if (updatedWarningCount > 0) {
            status = 'warning'
          }
        } else if (route?.type?.toLowerCase().includes("ph")) {
          if (parseFloat(rawWater) < 6.5 || parseFloat(rawWater) > 8.5) {
            updatedWarningCount++;
          }
          if (parseFloat(sf) < 6.5 || parseFloat(sf) > 8.5) {
            updatedWarningCount++;
          }
          if (parseFloat(acf) < 6.5 || parseFloat(acf) > 8.5) {
            updatedWarningCount++;
          }
          if (parseFloat(resin) < 6.5 || parseFloat(resin) > 8.5) {
            updatedWarningCount++;
          }
          if (parseFloat(um5) < 6.5 || parseFloat(um5) > 8.5) {
            updatedWarningCount++;
          }
          if (updatedWarningCount > 0) {
            status = 'warning'
          }
        }
        if (route?.item?.status == 'pending') {
          entity = PreTreatmentListItemModel.create({
            id: route?.item?.id,
            warning_count: updatedWarningCount,
            status: status,
            action: "Add Treatment",
            pre_treatment_id: route?.item?.pre_treatment_id,
            pre_treatment_type: route?.item?.pre_treatment_type,
            sf: sf,
            acf: acf,
            resin: resin,
            um5: um5,
            raw_water: rawWater,
            remark: other
          })

        } else {
          const changes = [
            route?.item?.raw_water != rawWater ? `Raw Water from ${route?.item?.raw_water} to ${rawWater}` : '',
            route?.item?.sf != sf ? `SF from ${route?.item?.sf} to ${sf}` : '',
            route?.item?.acf != acf ? `ACF from ${route?.item?.acf} to ${acf}` : '',
            route?.item?.resin != resin ? `Resin from ${route?.item?.resin} to ${resin}` : '',
            route?.item?.um5 != um5 ? `5µm from ${route?.item?.um5} to ${um5}` : '',
            route?.item?.remark != other ? `Remark from ${route?.item?.remark == null ? '' : route?.item?.remark} to ${other}` : ''
          ];
          const actionString = changes.filter(change => change !== '').join(', ');
          entity = PreTreatmentListItemModel.create({
            id: route?.item?.id,
            warning_count: updatedWarningCount,
            status: status,
            action: `has modified ${actionString}`,
            pre_treatment_id: route?.item?.pre_treatment_id,
            pre_treatment_type: route?.item?.pre_treatment_type, sf: sf,
            acf: acf,
            resin: resin,
            um5: um5,
            raw_water: rawWater,
            remark: other
          })
        }
      }
      try {
        setLoading(true)
        await (preWaterTreatmentStore
          .addPretreatments(entity)
          .savePreWtp().then()
          .catch((e) => console.log(e)))
        {
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
        route?.onBack()
        setLoading(false)
      }
    }

    return (
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
        {isScanning && (
          <View style={styles.overlay}>
            <ActivityIndicator color="#8CC8FF" size={35} />
            <View style={{ marginVertical: 15 }}></View>
            <Text whiteColor textAlign={"center"}>
              Scanning ...
            </Text>
          </View>
        )}
        <ScrollView>
          <View style={$outerContainer}>
            <View style={[$horizon, { justifyContent: "space-between" }]}>
            </View>
            {route?.type?.toLowerCase().includes("pressure") ?
              <View>
                <View style={main}>
                  <View style={sub}>
                    <View style={{ marginRight: 10 }}>
                      <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                        <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                        <Text style={{ marginRight: 5, fontSize: 16 }}>SF</Text>
                        {(parseFloat(sf) < 0.1 || parseFloat(sf) > 0.3) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}

                      </View>
                      <TextInput
                        keyboardType="decimal-pad"
                        value={sf}
                        readOnly={!isEdit}
                        style={[styles.input, { width: '100%' }]}
                        placeholder="Please Enter"
                        onChangeText={(text) => setSf(text)}>
                      </TextInput>
                      {sf == '' ?
                        <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ SF</Text>
                        : <></>}
                    </View>
                  </View >
                  <View style={sub}>
                    <View style={{ marginRight: 10 }}>
                      <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                        <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                        <Text style={{ marginRight: 5, fontSize: 16 }}>ACF</Text>
                        {(parseFloat(acf) < 0.1 || parseFloat(acf) > 0.3) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                      </View>
                      <TextInput
                        keyboardType="decimal-pad"
                        value={acf}
                        readOnly={!isEdit}
                        style={[styles.input, { width: '100%' }]}
                        placeholder="Please Enter"
                        onChangeText={(text) => setacf(text)}>
                      </TextInput>
                      {acf == '' ?
                        <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ ACF</Text>
                        : <></>}
                    </View>
                  </View>
                </View>
                <View style={main}>
                  <View style={sub}>
                    <View style={{ marginRight: 10 }}>
                      <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                        <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                        <Text style={{ marginRight: 5, fontSize: 16 }}>Resin</Text>
                        {(parseFloat(resin) < 0.1 || parseFloat(resin) > 0.3) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                      </View>
                      <TextInput
                        keyboardType="decimal-pad"
                        value={resin}
                        readOnly={!isEdit}
                        style={[styles.input, { width: '100%' }]}
                        placeholder="Please Enter"
                        onChangeText={(text) => setResin(text)}>
                      </TextInput>
                      {resin == '' ?
                        <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Resin</Text>
                        : <></>}
                    </View>
                  </View >
                  <View style={sub}>
                    <View style={{ marginRight: 10 }}>
                      <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                        <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                        <Text style={{ marginRight: 5, fontSize: 16 }}>5µm</Text>
                        {(parseFloat(um5) < 0.1 || parseFloat(um5) > 0.3) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                      </View>
                      <TextInput
                        keyboardType="decimal-pad"
                        value={um5}
                        readOnly={!isEdit}
                        style={[styles.input, { width: '100%' }]}
                        placeholder="Please Enter"
                        onChangeText={(text) => setum5(text)}>
                      </TextInput>
                      {um5 == '' ?
                        <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ 5µm</Text>
                        : <></>}
                    </View>
                  </View >
                </View>
                <View style={{ flex: 1 }}>

                  <View style={{ marginRight: 10 }}>
                    <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                      <Text style={{ marginRight: 5, fontSize: 16 }}>Other</Text>
                    </View>
                    <TextInput
                      value={other}
                      readOnly={!isEdit}
                      style={[styles.input, { width: '100%' }]}
                      placeholder="Please Enter"
                      onChangeText={(text) => setOther(text)}>
                    </TextInput>
                  </View>
                </View>
              </View>

              : (route?.type?.toLowerCase().includes("air")) ?
                <>
                  <View style={{ gap: 15 }}>
                    <View style={[$horizon]}>
                      <View style={{ marginVertical: 25, flex: 1 }}>
                        <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                          <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                          <Text style={{ marginRight: 5, fontSize: 16 }}>SF</Text>
                          {(airSF) == 0 ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
                            <Checkbox
                              disabled={!isEdit}
                              status={
                                airSF === null
                                  ? "unchecked"
                                  : airSF == 1
                                    ? "checked"
                                    : "unchecked"
                              }
                              onPress={() => {
                                setAirSF(1)
                              }}
                              color="#0081F8"
                            />
                            <Text>Yes </Text>
                          </View>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Checkbox
                              disabled={!isEdit}
                              status={
                                airSF === null
                                  ? "unchecked"
                                  : airSF == 0
                                    ? "checked"
                                    : "unchecked"
                              }
                              onPress={() => {
                                setAirSF(0)
                              }}
                              color="#0081F8"
                            />
                            <Text>No </Text>
                          </View>

                        </View>
                        {airSF == null ?
                          <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមជ្រើសរើស SF</Text>
                          : <></>}

                      </View>
                      <View style={{ marginVertical: 25, flex: 1 }}>
                        <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                          <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                          <Text style={{ marginRight: 5, fontSize: 16 }}>ACF</Text>
                          {(airACF) == 0 ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
                            <Checkbox
                              disabled={!isEdit}
                              status={
                                airACF === null
                                  ? "unchecked"
                                  : airACF == 1
                                    ? "checked"
                                    : "unchecked"
                              }
                              onPress={() => {
                                setAirACF(1)
                              }}
                              color="#0081F8"
                            />
                            <Text>Yes </Text>
                          </View>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Checkbox
                              disabled={!isEdit}
                              status={
                                airACF === null
                                  ? "unchecked"
                                  : airACF == 0
                                    ? "checked"
                                    : "unchecked"
                              }
                              onPress={() => {
                                setAirACF(0)
                              }}
                              color="#0081F8"
                            />
                            <Text>No </Text>
                          </View>

                        </View>
                        {airACF == null ?
                          <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមជ្រើសរើស ACF</Text>
                          : <></>}
                      </View>
                      <View style={{ marginVertical: 25, flex: 1 }}>
                        <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                          <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                          <Text style={{ marginRight: 5, fontSize: 16 }}>Resin</Text>
                          {(airResin) == 0 ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
                            <Checkbox
                              disabled={!isEdit}
                              status={
                                airResin === null
                                  ? "unchecked"
                                  : airResin == 1
                                    ? "checked"
                                    : "unchecked"
                              }
                              onPress={() => {
                                setAirResin(1)
                              }}
                              color="#0081F8"
                            />
                            <Text>Yes </Text>
                          </View>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Checkbox
                              disabled={!isEdit}
                              status={
                                airResin === null
                                  ? "unchecked"
                                  : airResin == 0
                                    ? "checked"
                                    : "unchecked"
                              }
                              onPress={() => {
                                setAirResin(0)
                              }}
                              color="#0081F8"
                            />
                            <Text>No </Text>
                          </View>

                        </View>
                        {airResin == null ?
                          <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមជ្រើសរើស Resin</Text>
                          : <></>}
                      </View>
                    </View>
                    <View style={{ flex: 1 }}>

                      <View style={{ marginRight: 10 }}>
                        <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                          <Text style={{ marginRight: 5, fontSize: 16 }}>Other</Text>
                        </View>
                        <TextInput
                          value={other}
                          readOnly={!isEdit}
                          style={[styles.input, { width: '100%' }]}
                          placeholder="Please Enter"
                          onChangeText={(text) => setOther(text)}>
                        </TextInput>
                      </View>
                    </View>
                  </View>
                </>
                : (route?.type?.toLowerCase().includes("tds") || route?.type?.toLowerCase().includes("ph")) ?
                  <View>
                    <View style={main}>
                      <View style={sub}>
                        <View style={{ marginRight: 10 }}>
                          <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                            <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                            <Text style={{ marginRight: 5, fontSize: 16 }}>Raw Water</Text>
                            {(route?.type?.toLowerCase().includes("tds")) && (parseFloat(rawWater) > 300) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : (route?.type?.toLowerCase().includes("ph")) && (parseFloat(rawWater) < 6.5 || parseFloat(rawWater) > 8.5) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}

                          </View>
                          <TextInput
                            keyboardType="decimal-pad"
                            value={rawWater}
                            readOnly={!isEdit}
                            style={[styles.input, { width: '100%' }]}
                            placeholder="Please Enter"
                            onChangeText={(text) => setRawWater(text)}>
                          </TextInput>
                          {rawWater == '' ?
                            <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Raw Water</Text>
                            : <></>}
                        </View>
                      </View >
                      <View style={sub}>
                        <View style={{ marginRight: 10 }}>
                          <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                            <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                            <Text style={{ marginRight: 5, fontSize: 16 }}>SF</Text>
                            {(route?.type?.toLowerCase().includes("tds")) && (parseFloat(sf) > 300) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : (route?.type?.toLowerCase().includes("ph")) && (parseFloat(sf) < 6.5 || parseFloat(sf) > 8.5) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                          </View>
                          <TextInput
                            keyboardType="decimal-pad"
                            value={sf}
                            readOnly={!isEdit}
                            style={[styles.input, { width: '100%' }]}
                            placeholder="Please Enter"
                            onChangeText={(text) => setSf(text)}>
                          </TextInput>
                          {sf == '' ?
                            <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ SF</Text>
                            : <></>}
                        </View>
                      </View>
                    </View>
                    <View style={main}>
                      <View style={sub}>
                        <View style={{ marginRight: 10 }}>
                          <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                            <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                            <Text style={{ marginRight: 5, fontSize: 16 }}>ACF</Text>
                            {(route?.type?.toLowerCase().includes("tds")) && (parseFloat(acf) > 300) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : (route?.type?.toLowerCase().includes("ph")) && (parseFloat(acf) < 6.5 || parseFloat(acf) > 8.5) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                          </View>
                          <TextInput
                            keyboardType="decimal-pad"
                            value={acf}
                            readOnly={!isEdit}
                            style={[styles.input, { width: '100%' }]}
                            placeholder="Please Enter"
                            onChangeText={(text) => setacf(text)}>
                          </TextInput>
                          {acf == '' ?
                            <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ ACF</Text>
                            : <></>}
                        </View>
                      </View >
                      <View style={sub}>
                        <View style={{ marginRight: 10 }}>
                          <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                            <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                            <Text style={{ marginRight: 5, fontSize: 16 }}>Resin</Text>
                            {(route?.type?.toLowerCase().includes("tds")) && (parseFloat(resin) > 300) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : (route?.type?.toLowerCase().includes("ph")) && (parseFloat(resin) < 6.5 || parseFloat(resin) > 8.5) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                          </View>
                          <TextInput
                            keyboardType="decimal-pad"
                            value={resin}
                            readOnly={!isEdit}
                            style={[styles.input, { width: '100%' }]}
                            placeholder="Please Enter"
                            onChangeText={(text) => setResin(text)}>
                          </TextInput>
                          {resin == '' ?
                            <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Resin</Text>
                            : <></>}
                        </View>
                      </View >

                    </View>
                    <View style={main}>
                      <View style={sub}>
                        <View style={{ marginRight: 10 }}>
                          <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                            <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                            <Text style={{ marginRight: 5, fontSize: 16 }}>5µm</Text>
                            {(route?.type?.toLowerCase().includes("tds")) && (parseFloat(um5) > 300) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : (route?.type?.toLowerCase().includes("ph")) && (parseFloat(um5) < 6.5 || parseFloat(um5) > 8.5) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                          </View>
                          <TextInput
                            keyboardType="decimal-pad"
                            value={um5}
                            readOnly={!isEdit}
                            style={[styles.input, { width: '100%' }]}
                            placeholder="Please Enter"
                            onChangeText={(text) => setum5(text)}>
                          </TextInput>
                          {um5 == '' ?
                            <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ 5µm</Text>
                            : <></>}
                        </View>
                      </View >
                      <View style={sub}>
                        <View style={{ marginRight: 10 }}>
                          <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                            <Text style={{ marginRight: 5, fontSize: 16 }}>Other</Text>
                          </View>
                          <TextInput
                            value={other}
                            readOnly={!isEdit}
                            style={[styles.input, { width: '100%' }]}
                            placeholder="Please Enter"
                            onChangeText={(text) => setOther(text)}>
                          </TextInput>
                        </View>
                      </View >
                    </View>
                  </View>
                  : <></>}
          </View>
        </ScrollView>
        <ActivityModal log={activities} onClose={() => setShowlog(false)} isVisible={showLog} />
      </KeyboardAvoidingView>
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
  gap: 20,
}
const $width: ViewStyle = {
  flex: 1,
}

const $horizon: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: 15,
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