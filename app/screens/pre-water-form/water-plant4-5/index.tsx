import React, { FC, useEffect, useLayoutEffect, useState } from "react"
import Icon from "react-native-vector-icons/Ionicons"
import * as ImagePicker from "expo-image-picker"
import { observer } from "mobx-react-lite"
import { AppStackScreenProps } from "app/navigators"
import {
  View,
  ViewStyle,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  TextInput
} from "react-native"
import { Text } from "app/components/v2"
import ActivityBar from "app/components/v2/WaterTreatment/ActivityBar"
import { useNavigation, useRoute } from "@react-navigation/native"
import { styles } from "../styles"
import CustomInput from "app/components/v2/DailyPreWater/CustomInput"
import { useStores } from "app/models"
import { PreTreatmentListItemModel } from "app/models/pre-water-treatment/pre-water-treatment-model"
import { ALERT_TYPE, Dialog } from "react-native-alert-notification"
import ActivityModal from "app/components/v2/ActivitylogModal"
import { ImagetoText, getResultImageCamera, getResultImageGallery } from "app/utils-v2/ocr"
import { translate } from "../../../i18n/translate"
import IconAntDesign from "react-native-vector-icons/AntDesign"

interface PreWaterForm2ScreenProps extends AppStackScreenProps<"PreWaterForm2"> { }

export const PreWaterForm2Screen: FC<PreWaterForm2ScreenProps> = observer(
  function PreWaterForm2Screen() {

    const { preWaterTreatmentStore, authStore } = useStores()
    const navigation = useNavigation()
    const route = useRoute().params
    const [isScanning, setScanning] = useState(false)
    const [image, setImage] = useState(null)
    const [activities, setActivities] = useState([])
    const [showLog, setShowlog] = useState<boolean>(false)
    const [isLoading, setLoading] = useState<boolean>(false)
    const assignedUsers = route?.item?.assign_to_user.split(' ');
    const isUserAssigned = assignedUsers.includes(authStore?.userLogin);
    // const isEdit = (route?.isvalidDate && isUserAssigned && route?.isValidShift)
    const [isEdit, setIsEdit] = useState()
    const [sf1, setSf1] = useState(route?.item?.sf1 || '')
    const [sf2, setSf2] = useState(route?.item?.sf2 || '')
    const [acf1, setacf1] = useState(route?.item?.acf1 || '')
    const [acf2, setacf2] = useState(route?.item?.acf2 || '')
    const [um101, setum101] = useState(route?.item?.um101 || '')
    const [um102, setum102] = useState(route?.item?.um102 || '')
    const [other, setOther] = useState(route?.item?.remark || '')
    const [rawWater, setRawWater] = useState(route?.item?.raw_water || '')
    const [bufferSt002, setBufferSt002] = useState(route?.item?.buffer_st002 || '')

    const [form, setForm] = useState({
      sf1: "",
      sf2: "",
      acf1: "",
      acf2: "",
      um101: "",
      um102: "",
      raw_water: "",
      remarks: "",
      buffer_st002: "",
    })

    const [isEditable, setEditable] = useState(false)
    const [errors, setErrors] = useState({
      sf1: true,
      sf2: true,
      acf1: true,
      acf2: true,
      um101: true,
      um102: true,
      remarks: true,
      raw_water: true,
      buffer_st002: true,
    })

    const setImageToform = (result: string[]) => {
      const blocktext = result as string[]
      const numeric = []

      const isNumeric = (string) => /^[+-]?\d+(\.\d+)?$/.test(string)

      for (let i = 0; i < blocktext.length; i++) {
        const values = blocktext[i]

        // Check if the value is numeric and not in the ignore list
        if (isNumeric(values)) {
          numeric.push(values)
        } else if (values === "✓") {
          numeric.push(values)
        }
      }
      if (route?.type?.toLowerCase().startsWith("pressure")) {
        const [sf1, sf2, mM102, acf1, acf2, _mM102, mM101] = numeric

        setForm({
          acf1: acf1 ?? "",
          acf2: acf2 ?? "",
          um101: mM101 ?? "",
          um102: mM102 ?? "",
          sf1: sf1 ?? "",
          sf2: sf2 ?? "",
        })
        setErrors({
          acf1: !!acf1,
          acf2: !!acf2,
          um101: !!mM101,
          um102: !!mM102,
          sf1: !!sf1,
          sf2: !!sf2,
        })
      }

      if (route?.type?.toLowerCase().startsWith("tds")) {
        // const [sf1, sf2, acf1, acf2, mM101, mM102,raw_water,buffer_st002] = numeric

        const num = numeric.filter((item) => Number(item) > 2)
        const [sf1, acf1, sf2, acf2, mM101, mM102, raw_water, buffer_st002] = num
        setForm({
          raw_water: raw_water,
          sf1: sf1,
          sf2: sf2,
          acf1: acf1,
          acf2: acf2,
          um101: mM101,
          um102: mM102,
          buffer_st002: buffer_st002,
        })
        setErrors({
          raw_water: !!raw_water,
          sf1: !!sf1,
          sf2: !!sf2,
          acf1: !!acf1,
          acf2: !!acf2,
          um101: !!mM101,
          um102: !!mM102,
          buffer_st002: !!buffer_st002,
        })
      }
      if (route?.type?.toLowerCase().startsWith("ph")) {
        const num = numeric.filter((item) => Number(item) > 2)
        const [sf1, sf2, acf1, acf2, mM101, mM102, raw_water, buffer_st002] = num
        setForm({
          raw_water: raw_water,
          sf1: sf1,
          sf2: sf2,
          acf1: acf1,
          acf2: acf2,
          um101: mM101,
          um102: mM102,
          buffer_st002: buffer_st002,
        })
        setErrors({
          raw_water: !!raw_water,
          sf1: !!sf1,
          sf2: !!sf2,
          acf1: !!acf1,
          acf2: !!acf2,
          um101: !!mM101,
          um102: !!mM102,
          buffer_st002: !!buffer_st002,
        })
      }
      setScanning(false)
    }
    const performOCR = async (file: ImagePicker.ImagePickerAsset) => {
      try {
        const result = await ImagetoText(file)
        if (!result) {
          Dialog.show({
            type: ALERT_TYPE.WARNING,
            title: "រក​មិនឃើញ",
            autoClose: 500,
            textBody: "យើងមិនអាចស្រង់ចេញបានទេ។",
          })
          setScanning(false)
          return
        }
        const annotations = result["annotations"]

        // Function to check if a sequence of words matches the pattern to ignore
        let shouldIgnoreSequence: any
        if (route?.type?.toLowerCase().startsWith("pressure")) {
          shouldIgnoreSequence = (sequence) => {
            const ignorePatterns = [
              ["(", "0.2-0.5", "bar", ")"],
              ["(", "1", "<", "2.5", "bar", ")"],
              ["*", "ACF", "1"],
              ["*", "ACF", "2"],
              ["*", "SF", "1"],
              ["*", "SF", "2"],
              ["*", "10Mm", "1"],
              ["*", "10Mm", "2"],
            ]

            return ignorePatterns.some((pattern) => {
              if (sequence.length < pattern.length) {
                return false
              }
              for (let i = 0; i < pattern.length; i++) {
                if (sequence[i] !== pattern[i]) {
                  return false
                }
              }
              return true
            })
          }
        } else {
          shouldIgnoreSequence = (sequence) => false
        }

        if (route?.type?.toLowerCase().startsWith("tds")) {
          shouldIgnoreSequence = (sequence) => {
            const ignorePattern = [translate("wtpcommon.level"), "TDS", "<", "300", "mg/l"]
            for (let i = 0; i < ignorePattern.length; i++) {
              if (sequence[i] !== ignorePattern[i]) {
                return false
              }
            }
            return true
          }
        }
        if (route?.type?.toLowerCase().startsWith("ph")) {
          shouldIgnoreSequence = (sequence) => {
            const ignorePattern = [translate("wtpcommon.level"), "PH", "6.5", "-", "8.5"]
            for (let i = 0; i < ignorePattern.length; i++) {
              if (sequence[i] !== ignorePattern[i]) {
                return false
              }
            }
            return true
          }
        }
        // Function to filter out unwanted sequences
        const filterAnnotations = (annotations) => {
          let filteredAnnotations = []
          for (let i = 0; i < annotations.length; i++) {
            // Check if the current sequence matches the ignore pattern
            if (i <= annotations.length - 8 && shouldIgnoreSequence(annotations.slice(i, i + 8))) {
              // Skip the next 8 items
              i += 7
            } else {
              filteredAnnotations.push(annotations[i])
            }
          }
          return filteredAnnotations
        }

        const filteredAnnotations = filterAnnotations(annotations)
        setImageToform(filteredAnnotations)
      } catch (error) {
        console.error(error.message)
        Dialog.show({
          type: ALERT_TYPE.WARNING,
          title: "បរាជ័យ",
          autoClose: 500,
          textBody: "ស្កែនរូបភាពទៅជាអត្ថបទមិនជោគជ័យទេ។",
        })
      }
    }
    const onlaunchGallery = async () => {
      try {
        setScanning(true)
        const result = await getResultImageGallery()
        if (!result) {
          setScanning(false)
          return
        }
        if (!result.canceled) {
          performOCR(result?.assets[0])
          setImage(result?.assets[0]?.uri)
          // Set the selected image in state
        }
      } catch (error) {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "បរាជ័យ",
          textBody: "សូម​ព្យាយាម​ម្តង​ទៀត",
          // button: 'close',
          autoClose: 100,
        })
      }
    }
    const onlaunchCamera = async () => {
      try {
        setScanning(true)

        const result = await getResultImageCamera()
        if (!result) {
          setScanning(false)

          return
        }

        if (!result.canceled) {
          performOCR(result?.assets[0])
          setImage(result?.assets[0]?.uri)
          // Set the selected image in state
        }
      } catch (error) {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "បរាជ័យ",
          textBody: "សូម​ព្យាយាម​ម្តង​ទៀត",
          // button: 'close',
          autoClose: 100,
        })
      }
    }
    const fetchUserActivity = async () => {
      const result = await preWaterTreatmentStore.getActivitiesList(
        route?.item?.id,
        route?.item?.pre_treatment_type,
      )

      setActivities(result.sort((a, b) => new Date(b.actionDate) - new Date(a.actionDate)))
    }

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
      const assignedUsers = route?.item?.assign_to_user.split(' ');
      const isUserAssigned = assignedUsers.includes(authStore?.userLogin);
      console.log(route?.isvalidDate, isUserAssigned, route?.isValidShift)
      navigation.setOptions({
        headerShown: true,
        title: route?.type,

        headerTitle: (props) => (
          <TouchableOpacity {...props}>
            <Text semibold body1>
              {route?.type}

              {route?.type?.toLowerCase().includes("tds") ? (
                <Text errorColor semibold body2>
                  {`  ( < 300 mg/l )`}
                </Text>
              ) : route?.type?.toLowerCase().includes("ph") ? (
                <Text errorColor semibold body2>
                  {` ( 6.5 - 8.5  )`}
                </Text>
              ) : (
                <Text semibold body1>
                  {` ΔP`}
                </Text>
              )}
            </Text>
          </TouchableOpacity>
        ),
        headerRight: () =>
          (isEdit) ? (
            <TouchableOpacity
              style={$horizon}
              disabled={isScanning}
              onPress={() => { submit() }}
            >
              <Icon name="checkmark-sharp" size={24} color={"#0081F8"} />
              <Text primaryColor body1 semibold>
                {translate("wtpcommon.save")}
              </Text>
            </TouchableOpacity>
          ) : (
            <></>
          ),
      })
    }, [navigation, route, errors, form, isEditable, isScanning, sf1, sf2, acf1, acf2, um101, um102, other,bufferSt002,isEdit])

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
      if (route?.type?.toLowerCase()?.startsWith("pressure")) {
        if (sf1 == '') {
          alert('បរាជ័យ', 'សូ​មបំពេញ SF 1')
          return
        }
        if (sf2 == '') {
          alert('បរាជ័យ', 'សូ​មបំពេញ SF 2')
          return
        }
        if (acf1 == '') {
          alert('បរាជ័យ', 'សូ​មបំពេញ ACF 1')
          return
        }
        if (acf2 == '') {
          alert('បរាជ័យ', 'សូ​មបំពេញ ACF 2')
          return
        }
        if (um101 == '') {
          alert('បរាជ័យ', 'សូ​មបំពេញ 10µm 1')
          return
        }
        if (um102 == '') {
          alert('បរាជ័យ', 'សូ​មបំពេញ 10µm 2')
          return
        }
        let updatedWarningCount = 0;
        let status = 'normal'
        if (parseFloat(sf1) < 0.2 || parseFloat(sf1) > 0.5) {
          updatedWarningCount++;
        }
        if (parseFloat(sf2) < 0.2 || parseFloat(sf2) > 0.5) {
          updatedWarningCount++;
        }
        if (parseFloat(acf1) < 0.2 || parseFloat(acf1) > 0.5) {
          updatedWarningCount++;
        }
        if (parseFloat(acf2) < 0.2 || parseFloat(acf2) > 0.5) {
          updatedWarningCount++;
        }
        if (parseFloat(um101) > 2.5) {
          updatedWarningCount++;
        }
        if (parseFloat(um102) > 2.5) {
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
            sf1: sf1,
            sf2: sf2,
            acf1: acf1,
            acf2: acf2,
            um101: um101,
            um102: um102,
            remark: other
          })
        } else {
          const changes = [
            route?.item?.sf1 != sf1 ? `SF 1 from ${route?.item?.sf1} to ${sf1}` : '',
            route?.item?.sf2 != sf2 ? `SF 2 from ${route?.item?.sf2} to ${sf2}` : '',
            route?.item?.acf1 != acf1 ? `ACF1 from ${route?.item?.acf1} to ${acf1}` : '',
            route?.item?.acf2 != acf2 ? `ACF2 from ${route?.item?.acf2} to ${acf2}` : '',
            route?.item?.um101 != um101 ? `10µm 1 from ${route?.item?.um101} to ${um101}` : '',
            route?.item?.um102 != um102 ? `10µm 2 from ${route?.item?.um102} to ${um102}` : '',
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
            sf1: sf1,
            sf2: sf2,
            acf1: acf1,
            acf2: acf2,
            um101: um101,
            um102: um102,
            remark: other
          })
        }
      } else if (route?.type?.toLowerCase().includes("tds") || route?.type?.toLowerCase().includes("ph")) {
        if (rawWater == '') {
          alert('បរាជ័យ', 'សូ​មបំពេញ Raw Water')
          return
        }
        if (sf1 == '') {
          alert('បរាជ័យ', 'សូ​មបំពេញ SF')
          return
        }
        if (sf2 == '') {
          alert('បរាជ័យ', 'សូ​មបំពេញ SF 2')
          return
        }
        if (acf1 == '') {
          alert('បរាជ័យ', 'សូ​មបំពេញ ACF 1')
          return
        }
        if (acf2 == '') {
          alert('បរាជ័យ', 'សូ​មបំពេញ ACF 2')
          return
        }
        if (um101 == '') {
          alert('បរាជ័យ', 'សូ​មបំពេញ 10µm 1')
          return
        }
        if (um102 == '') {
          alert('បរាជ័យ', 'សូ​មបំពេញ 10µm 2')
          return
        }
        if (bufferSt002 == '') {
          alert('បរាជ័យ', 'សូ​មបំពេញ Buffer St002')
          return
        }
        let updatedWarningCount = 0;
        let status = 'normal'
        if (route?.type?.toLowerCase().includes("tds")) {
          if (parseFloat(rawWater) > 300) {
            updatedWarningCount++;
          }
          if (parseFloat(sf1) > 300) {
            updatedWarningCount++;
          }
          if (parseFloat(sf2) > 300) {
            updatedWarningCount++;
          }
          if (parseFloat(acf1) > 300) {
            updatedWarningCount++;
          }
          if (parseFloat(acf2) > 300) {
            updatedWarningCount++;
          }
          if (parseFloat(um101) > 300) {
            updatedWarningCount++;
          }
          if (parseFloat(um102) > 300) {
            updatedWarningCount++;
          }
          if (parseFloat(bufferSt002) > 300) {
            updatedWarningCount++;
          }
          if (updatedWarningCount > 0) {
            status = 'warning'
          }
        } else if (route?.type?.toLowerCase().includes("ph")) {
          if (parseFloat(rawWater) < 6.5 || parseFloat(rawWater) > 8.5) {
            updatedWarningCount++;
          }
          if (parseFloat(sf1) < 6.5 || parseFloat(sf1) > 8.5) {
            updatedWarningCount++;
          }
          if (parseFloat(sf2) < 6.5 || parseFloat(sf2) > 8.5) {
            updatedWarningCount++;
          }
          if (parseFloat(acf1) < 6.5 || parseFloat(acf1) > 8.5) {
            updatedWarningCount++;
          }
          if (parseFloat(acf2) < 6.5 || parseFloat(acf2) > 8.5) {
            updatedWarningCount++;
          }
          if (parseFloat(um101) < 6.5 || parseFloat(um101) > 8.5) {
            updatedWarningCount++;
          }
          if (parseFloat(um102) < 6.5 || parseFloat(um102) > 8.5) {
            updatedWarningCount++;
          }
          if (parseFloat(bufferSt002) < 6.5 || parseFloat(bufferSt002) > 8.5) {
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
            sf1: sf1,
            sf2: sf2,
            acf1: acf1,
            acf2: acf2,
            um101:um101,
            um102:um102,
            raw_water: rawWater,
            buffer_st002:bufferSt002,
            remark: other
          })

        } else {
          const changes = [
            route?.item?.sf1 != sf1 ? `SF 1 from ${route?.item?.sf1} to ${sf1}` : '',
            route?.item?.sf2 != sf2 ? `SF 2 from ${route?.item?.sf2} to ${sf2}` : '',
            route?.item?.acf1 != acf1 ? `ACF1 from ${route?.item?.acf1} to ${acf1}` : '',
            route?.item?.acf2 != acf2 ? `ACF2 from ${route?.item?.acf2} to ${acf2}` : '',
            route?.item?.um101 != um101 ? `10µm 1 from ${route?.item?.um101} to ${um101}` : '',
            route?.item?.um102 != um102 ? `10µm 2 from ${route?.item?.um102} to ${um102}` : '',
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
            sf1: sf1,
            sf2: sf2,
            acf1: acf1,
            acf2: acf2,
            um101:um101,
            um102:um102,
            raw_water: rawWater,
            buffer_st002:bufferSt002,
            remark: other
          })
        }
      }
      try {
        setLoading(true)
        await (preWaterTreatmentStore
          .addPretreatments(entity)
          .savePreWtp4()
          .then()
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
      <KeyboardAvoidingView behavior={"padding"} keyboardVerticalOffset={100} style={$root}>
        {isScanning && (
          <View style={styles.overlay}>
            <ActivityIndicator color="#8CC8FF" size={35} />
            <View style={{ marginVertical: 15 }}></View>
            <Text whiteColor textAlign={"center"}>
              Progressing Image ...
            </Text>
          </View>
        )}
        {isLoading && (
          <View style={styles.overlay}>
            <ActivityIndicator color="#8CC8FF" size={35} />
            <View style={{ marginVertical: 15 }}></View>
            <Text whiteColor textAlign={"center"}>
              {translate("wtpcommon.savingRecord")} ...
            </Text>
          </View>
        )}
        <ScrollView>
          <View style={$outerContainer}>
            <View style={[$horizon, { justifyContent: "flex-end" }]}>
              {route?.isvalidDate && route?.item?.assign_to_user && (
                <ActivityBar
                  direction="end"
                  disable
                  onScanCamera={onlaunchCamera}
                  onAttachment={onlaunchGallery}
                  onActivity={() => setShowlog(true)}
                />
              )}
            </View>
            {route?.type?.toLowerCase()?.startsWith("pressure") ?
              <View>
                <View style={main}>
                  <View style={sub}>
                    <View style={{ marginRight: 10 }}>
                      <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                        <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                        <Text style={{ marginRight: 5, fontSize: 16 }}>SF 1</Text>
                        <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>(0.2-0.5 bar)</Text>
                        {(parseFloat(sf1) < 0.2 || parseFloat(sf1) > 0.5) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}

                      </View>
                      <TextInput
                        keyboardType="decimal-pad"
                        value={sf1}
                        readOnly={!isEdit}
                        style={[styles.input, { width: '100%' }]}
                        placeholder="Please Enter"
                        onChangeText={(text) => setSf1(text)}>
                      </TextInput>
                      {sf1 == '' ?
                        <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ SF 1</Text>
                        : <></>}
                    </View>
                  </View >
                  <View style={sub}>
                    <View style={{ marginRight: 10 }}>
                      <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                        <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                        <Text style={{ marginRight: 5, fontSize: 16 }}>SF 2</Text>
                        <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>(0.2-0.5 bar)</Text>
                        {(parseFloat(sf2) < 0.2 || parseFloat(sf2) > 0.5) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                      </View>
                      <TextInput
                        keyboardType="decimal-pad"
                        value={sf2}
                        readOnly={!isEdit}
                        style={[styles.input, { width: '100%' }]}
                        placeholder="Please Enter"
                        onChangeText={(text) => setSf2(text)}>
                      </TextInput>
                      {sf2 == '' ?
                        <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ SF 2</Text>
                        : <></>}
                    </View>
                  </View>
                </View>
                <View style={main}>
                  <View style={sub}>
                    <View style={{ marginRight: 10 }}>
                      <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                        <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                        <Text style={{ marginRight: 5, fontSize: 16 }}>ACF1</Text>
                        <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>(0.2-0.5 bar)</Text>
                        {(parseFloat(acf1) < 0.2 || parseFloat(acf1) > 0.5) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                      </View>
                      <TextInput
                        keyboardType="decimal-pad"
                        value={acf1}
                        readOnly={!isEdit}
                        style={[styles.input, { width: '100%' }]}
                        placeholder="Please Enter"
                        onChangeText={(text) => setacf1(text)}>
                      </TextInput>
                      {acf1 == '' ?
                        <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ ACF1</Text>
                        : <></>}
                    </View>
                  </View >
                  <View style={sub}>
                    <View style={{ marginRight: 10 }}>
                      <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                        <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                        <Text style={{ marginRight: 5, fontSize: 16 }}>ACF 2</Text>
                        <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>(0.2-0.5 bar)</Text>
                        {(parseFloat(acf2) < 0.2 || parseFloat(acf2) > 0.5) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                      </View>
                      <TextInput
                        keyboardType="decimal-pad"
                        value={acf2}
                        readOnly={!isEdit}
                        style={[styles.input, { width: '100%' }]}
                        placeholder="Please Enter"
                        onChangeText={(text) => setacf2(text)}>
                      </TextInput>
                      {acf2 == '' ?
                        <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ ACF 2</Text>
                        : <></>}
                    </View>
                  </View >
                </View>
                <View style={main}>
                  <View style={sub}>
                    <View style={{ marginRight: 10 }}>
                      <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                        <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                        <Text style={{ marginRight: 5, fontSize: 16 }}>10µm 1</Text>
                        <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>(&lt; 2.5 bar)</Text>
                        {(parseFloat(um101) > 2.5) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                      </View>
                      <TextInput
                        keyboardType="decimal-pad"
                        value={um101}
                        readOnly={!isEdit}
                        style={[styles.input, { width: '100%' }]}
                        placeholder="Please Enter"
                        onChangeText={(text) => setum101(text)}>
                      </TextInput>
                      {um101 == '' ?
                        <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ 10µm 1</Text>
                        : <></>}
                    </View>
                  </View >
                  <View style={sub}>
                    <View style={{ marginRight: 10 }}>
                      <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                        <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                        <Text style={{ marginRight: 5, fontSize: 16 }}>10µm 2</Text>
                        <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>(&lt; 2.5 bar)</Text>
                        {(parseFloat(um102) > 2.5) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                      </View>
                      <TextInput
                        keyboardType="decimal-pad"
                        value={um102}
                        readOnly={!isEdit}
                        style={[styles.input, { width: '100%' }]}
                        placeholder="Please Enter"
                        onChangeText={(text) => setum102(text)}>
                      </TextInput>
                      {um102 == '' ?
                        <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ 10µm 2</Text>
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
                          <Text style={{ marginRight: 5, fontSize: 16 }}>SF 1</Text>
                          {(route?.type?.toLowerCase().includes("tds")) && (parseFloat(sf1) > 300) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : (route?.type?.toLowerCase().includes("ph")) && (parseFloat(sf1) < 6.5 || parseFloat(sf1) > 8.5) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}

                        </View>
                        <TextInput
                          keyboardType="decimal-pad"
                          value={sf1}
                          readOnly={!isEdit}
                          style={[styles.input, { width: '100%' }]}
                          placeholder="Please Enter"
                          onChangeText={(text) => setSf1(text)}>
                        </TextInput>
                        {sf1 == '' ?
                          <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ SF 1</Text>
                          : <></>}
                      </View>
                    </View >

                  </View>
                  <View style={main}>
                    <View style={sub}>
                      <View style={{ marginRight: 10 }}>
                        <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                          <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                          <Text style={{ marginRight: 5, fontSize: 16 }}>SF 2</Text>
                          {(route?.type?.toLowerCase().includes("tds")) && (parseFloat(sf2) > 300) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : (route?.type?.toLowerCase().includes("ph")) && (parseFloat(sf2) < 6.5 || parseFloat(sf2) > 8.5) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                        </View>
                        <TextInput
                          keyboardType="decimal-pad"
                          value={sf2}
                          readOnly={!isEdit}
                          style={[styles.input, { width: '100%' }]}
                          placeholder="Please Enter"
                          onChangeText={(text) => setSf2(text)}>
                        </TextInput>
                        {sf2 == '' ?
                          <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ SF 2</Text>
                          : <></>}
                      </View>
                    </View>
                    <View style={sub}>
                      <View style={{ marginRight: 10 }}>
                        <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                          <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                          <Text style={{ marginRight: 5, fontSize: 16 }}>ACF1</Text>
                          {(route?.type?.toLowerCase().includes("tds")) && (parseFloat(acf1) > 300) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : (route?.type?.toLowerCase().includes("ph")) && (parseFloat(acf1) < 6.5 || parseFloat(acf1) > 8.5) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                        </View>
                        <TextInput
                          keyboardType="decimal-pad"
                          value={acf1}
                          readOnly={!isEdit}
                          style={[styles.input, { width: '100%' }]}
                          placeholder="Please Enter"
                          onChangeText={(text) => setacf1(text)}>
                        </TextInput>
                        {acf1 == '' ?
                          <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ ACF1</Text>
                          : <></>}
                      </View>
                    </View >

                  </View>
                  <View style={main}>
                    <View style={sub}>
                      <View style={{ marginRight: 10 }}>
                        <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                          <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                          <Text style={{ marginRight: 5, fontSize: 16 }}>ACF 2</Text>
                          {(route?.type?.toLowerCase().includes("tds")) && (parseFloat(acf2) > 300) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : (route?.type?.toLowerCase().includes("ph")) && (parseFloat(acf2) < 6.5 || parseFloat(acf2) > 8.5) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                        </View>
                        <TextInput
                          keyboardType="decimal-pad"
                          value={acf2}
                          readOnly={!isEdit}
                          style={[styles.input, { width: '100%' }]}
                          placeholder="Please Enter"
                          onChangeText={(text) => setacf2(text)}>
                        </TextInput>
                        {acf2 == '' ?
                          <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ ACF 2</Text>
                          : <></>}
                      </View>
                    </View >
                    <View style={sub}>
                      <View style={{ marginRight: 10 }}>
                        <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                          <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                          <Text style={{ marginRight: 5, fontSize: 16 }}>10µm 1</Text>
                          {(route?.type?.toLowerCase().includes("tds")) && (parseFloat(um101) > 300) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : (route?.type?.toLowerCase().includes("ph")) && (parseFloat(um101) < 6.5 || parseFloat(um101) > 8.5) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                        </View>
                        <TextInput
                          keyboardType="decimal-pad"
                          value={um101}
                          readOnly={!isEdit}
                          style={[styles.input, { width: '100%' }]}
                          placeholder="Please Enter"
                          onChangeText={(text) => setum101(text)}>
                        </TextInput>
                        {um101 == '' ?
                          <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ 10µm 1</Text>
                          : <></>}
                      </View>
                    </View >
                  </View>
                  <View style={main}>
                    <View style={sub}>
                      <View style={{ marginRight: 10 }}>
                        <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                          <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                          <Text style={{ marginRight: 5, fontSize: 16 }}>10µm 2</Text>
                          {(route?.type?.toLowerCase().includes("tds")) && (parseFloat(um102) > 300) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : (route?.type?.toLowerCase().includes("ph")) && (parseFloat(um102) < 6.5 || parseFloat(um102) > 8.5) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                        </View>
                        <TextInput
                          keyboardType="decimal-pad"
                          value={um102}
                          readOnly={!isEdit}
                          style={[styles.input, { width: '100%' }]}
                          placeholder="Please Enter"
                          onChangeText={(text) => setum102(text)}>
                        </TextInput>
                        {um102 == '' ?
                          <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ 10µm 2</Text>
                          : <></>}
                      </View>
                    </View >
                    <View style={sub}>
                      <View style={{ marginRight: 10 }}>
                        <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                          <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                          <Text style={{ marginRight: 5, fontSize: 16 }}>Buffer_St002</Text>
                          {(route?.type?.toLowerCase().includes("tds")) && (parseFloat(bufferSt002) > 300) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : (route?.type?.toLowerCase().includes("ph")) && (parseFloat(bufferSt002) < 6.5 || parseFloat(bufferSt002) > 8.5) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                        </View>
                        <TextInput
                          keyboardType="decimal-pad"
                          value={bufferSt002}
                          readOnly={!isEdit}
                          style={[styles.input, { width: '100%' }]}
                          placeholder="Please Enter"
                          onChangeText={(text) => setBufferSt002(text)}>
                        </TextInput>
                        {bufferSt002 == '' ?
                          <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Buffer_St002</Text>
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
  paddingBottom: 80,
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