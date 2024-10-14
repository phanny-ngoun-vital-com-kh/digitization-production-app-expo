import React, { FC, useEffect, useLayoutEffect, useState } from "react"
import * as ImagePicker from "expo-image-picker"
import { default as IconSecondary } from "react-native-vector-icons/Ionicons"
import { observer } from "mobx-react-lite"
import Icon from "react-native-vector-icons/Ionicons"
import { ALERT_TYPE, Dialog } from "react-native-alert-notification"
import { AppStackScreenProps } from "app/navigators"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Text } from "app/components/v2"
import CustomInput from "app/components/v2/DailyPreWater/CustomInput"
import ActivityBar from "app/components/v2/WaterTreatment/ActivityBar"
import { ActivityIndicator, Checkbox, Portal, Provider } from "react-native-paper"
import ActivityModal from "app/components/v2/ActivitylogModal"
import { useStores } from "app/models"
import { Activities, TreatmentModel } from "app/models/water-treatment/water-treatment-model"
import { KeyboardAvoidingView, ScrollView, TextInput, TouchableOpacity, View, ViewStyle } from "react-native"
import { styles } from "./styles"
import { ImagetoText, getResultImageCamera, getResultImageGallery } from "app/utils-v2/ocr"
import { translate } from "../../i18n/translate"
import IconAntDesign from "react-native-vector-icons/AntDesign"

interface WaterTreatmentPlant2FormScreenProps
  extends AppStackScreenProps<"WaterTreatmentPlant2Form"> { }

export const WaterTreatmentPlant2FormScreen: FC<WaterTreatmentPlant2FormScreenProps> = observer(
  function WaterTreatmentPlant2FormScreen() {
    const { waterTreatmentStore, authStore } = useStores()
    const [isOffline, setIsOffline] = useState(false)
    const navigation = useNavigation()
    const [isLoading, setLoading] = useState({
      image: false,
      submitting: false,
    })
    const [showLog, setShowlog] = useState<boolean>(false)
    const [activities, setActivities] = useState<Activities[]>([])
    const [isEditable, setEditable] = useState(true)
    const route = useRoute().params
    const [hasCompleted, setHasCompleted] = useState(false)
    const [tds, setTds] = useState(route?.items?.tds || '')
    const [ph, setPH] = useState(route?.items?.ph || '')
    const [temperature, setTemperature] = useState(route?.items?.temperature || '')
    const [pressure, setPressure] = useState(route?.items?.pressure || '')
    const [other, setOther] = useState(route?.items?.other || '')
    const [airRelease, setAirRelease] = useState(route?.items?.air_release != null ? parseFloat(route?.items?.air_release) : null)
    const [pressInlet, setPressInlet] = useState(route?.items?.press_inlet || '')
    const [pressTreat, setPressTreat] = useState(route?.items?.press_treat || '')
    const [pressDrain, setPressDrain] = useState(route?.items?.press_drain || '')
    const [odor, setOdor] = useState(route?.items?.odor != null ? parseFloat(route?.items?.odor) : null)
    const [taste, setTaste] = useState(route?.items?.taste != null ? parseFloat(route?.items?.taste) : null)
    const assignedUsers = route?.items.assign_to_user.split(' ');
    const isUserAssigned = assignedUsers.includes(authStore?.userLogin);

    const [form, setForm] = useState({
      tds: "",
      ph: "",
      temperature: "",
      other: "",
      air_release: null,
      pressure: "",
      odor: null,
      taste: null,
      press_inlet: "",
      press_treat: "",
      press_drain: "",
    })

    const [errors, setErrors] = useState({
      tds: true,
      ph: true,
      temperature: true,
      other: false,
      air_release: true,
      pressure: true,
      odor: true,
      taste: true,
      press_inlet: true,
      press_treat: true,
      press_drain: true,
    })

    const [image, setImage] = useState(null)

    useEffect(() => {
      const role = async () => {
        try {
          const rs = await authStore.getUserInfo();
          const admin=rs.data.authorities.includes('ROLE_PROD_PRO_ADMIN')
          const adminWTP = rs.data.authorities.includes('ROLE_PROD_WTP_ADMIN')
          const edit = (route?.isvalidDate && isUserAssigned && route?.isValidShift) || admin || adminWTP
          setEditable(edit)
          // Modify the list based on the user's role
          // setGetRole(rs)
        } catch (e) {
          console.log(e);
        }
      };
      role();
    }, []);

    const onlaunchGallery = async () => {
      try {
        const result = await getResultImageGallery()
        if (!result) {
          return
        }
        if (!result.canceled) {
          // Set the selected image in state
          performOCR(result?.assets[0])
          setImage(result?.assets[0]?.uri)
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
        const result = await getResultImageCamera()
        if (!result) {
          return
        }
        if (!result.canceled) {
          // Set the selected image in state
          performOCR(result?.assets[0])
          setImage(result?.assets[0]?.uri)
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

    const performOCR = async (file: ImagePicker.ImagePickerAsset) => {
      setLoading((pre) => ({ ...pre, image: true }))

      try {
        const result = await ImagetoText(file)
        if (!result) {
          Dialog.show({
            type: ALERT_TYPE.WARNING,
            title: "រក​មិនឃើញ",
            autoClose: 500,
            textBody: "យើងមិនអាចស្រង់ចេញបានទេ។",
          })
          setLoading((pre) => ({ ...pre, image: false }))
          return
        }
        onScanImagetoForm(result["annotations"])
      } catch (error) {
        Dialog.show({
          type: ALERT_TYPE.WARNING,
          title: "បរាជ័យ",
          autoClose: 500,
          textBody: "ស្កែនរូបភាពទៅជាអត្ថបទមិនជោគជ័យទេ។",
        })
      } finally {
        setLoading((pre) => ({ ...pre, image: false }))
      }
    }

    const onScanImagetoForm = (result: string[]) => {
      const blocktext = result as string[]
      const numberic = []
      const isNumeric = (string) => /^[+-]?\d+(\.\d+)?$/.test(string)

      for (let i = 0; i <= blocktext?.length; i++) {
        const values = blocktext[i]

        if (isNumeric(values)) {
          numberic.push(values)
        }
        if (values === "✓") {
          numberic.push(values)
        }
      }
      const [temp] = numberic.filter((item) => parseInt(item) >= 0 && parseInt(item) <= 50)
      const [tds, pressure] = numberic.filter(
        (item) => parseInt(item) >= 100 && parseInt(item) >= 300,
      )
      const [ph] = numberic.filter(
        (item) =>
          (parseInt(item) <= 6.5 && parseInt(item) >= 1) ||
          (parseInt(item) <= 9 && parseInt(item) >= 6.5),
      )
      const [press_inlet, press_treat, press_drain] = numberic.filter(
        (item) => parseInt(item) >= 0 && parseInt(item) <= 1,
      )

      if (route?.type?.toLowerCase()?.startsWith("raw water stock")) {
        const [tds, temp, ph] = numberic

        setForm({
          tds: tds?.toString(),
          ph: ph?.toString(),
          temperature: temp?.toString(),
        })
        setErrors({
          tds: !tds?.toString(),
          ph: !ph?.toString(),
          temperature: !temp?.toString(),
        })
      } else if (
        ["sand filter", "carbon filter", "resin filter"].includes(route?.type?.toLowerCase())
      ) {
        const [tds, temp, ph, pressure] = numberic

        setForm({
          tds: tds?.toString(),
          ph: ph?.toString(),
          temperature: temp?.toString(),
          pressure: pressure?.toString(),
        })
        setErrors({
          tds: !tds?.toString(),
          ph: !ph?.toString(),
          temperature: !temp?.toString(),
          pressure: !pressure?.toString(),
        })
      } else if (route?.type?.toLowerCase()?.startsWith("micro")) {
        setForm({
          tds: tds?.toString(),
          ph: ph?.toString(),
          temperature: temp?.toString(),
          pressure: pressure?.toString(),
        })
        setErrors({
          tds: !tds?.toString(),
          ph: !ph?.toString(),
          temperature: !temp?.toString(),
          pressure: !pressure?.toString(),
        })
      } else {
        setForm({
          tds: tds?.toString(),
          ph: ph?.toString(),
          press_inlet: press_inlet?.toString(),
          press_drain: press_drain?.toString(),
          press_treat: press_treat?.toString(),
        })
        setErrors({
          tds: !tds?.toString(),
          ph: !ph?.toString(),
          press_inlet: !press_inlet?.toString(),
          press_drain: !press_drain?.toString(),
          press_treat: !press_treat?.toString(),
        })
      }
    }

    useLayoutEffect(() => {
      
      // checkUserRole()
      navigation.setOptions({
        headerShown: true,
        title: route?.type,
        headerRight: () => (
          (isEditable) ?(
            <TouchableOpacity
              disabled={isLoading.submitting == true}
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
    }, [errors, navigation, route, form, route?.isEdit, hasCompleted, tds, ph, temperature, pressure, airRelease, pressDrain, pressInlet, pressTreat, odor, taste,isEditable])

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
      if (route?.type?.toLowerCase()?.startsWith("raw water stock")) {
        if (tds == '') {
          alert('បរាជ័យ', 'សូ​មបំពេញ TDS')
          return
        }
        if (ph == '') {
          alert('បរាជ័យ', 'សូ​មបំពេញ PH')
          return
        }
        if (temperature == '') {
          alert('បរាជ័យ', 'សូ​មបំពេញ Temperature')
          return
        }
        let updatedWarningCount = 0;
        let status = 'normal'
        if (parseFloat(tds) > 300) {
          updatedWarningCount++;
        }
        if (parseFloat(ph) < 6.5 || parseFloat(ph) > 8.5) {
          updatedWarningCount++;
        }
        if (parseFloat(temperature) < 25 || parseFloat(temperature) > 35) {
          updatedWarningCount++;
        }
        if (updatedWarningCount > 0) {
          status = 'warning'
        }
        if (route?.items?.status == 'pending') {
          entity = TreatmentModel.create({
            id: route?.items?.id,
            warning_count: updatedWarningCount,
            status: status,
            action: "Add Treatment",
            treatment_id: route?.items?.treatment_id,
            tds: tds,
            ph: ph,
            temperature: temperature,
            machine: route?.type,
          })
        } else {
          const changes = [
            route?.items?.tds != tds ? `TDS from ${route?.items?.tds} to ${tds}` : '',
            route?.items?.ph != ph ? `PH from ${route?.items?.ph} to ${ph}` : '',
            route?.items?.temperature != temperature ? `Temperature from ${route?.items?.temperature} to ${temperature}` : '',
            route?.items?.other != other ? `Other from ${route?.items?.other == null ? '' : route?.items?.other} to ${other}` : '',
          ];
          const actionString = changes.filter(change => change !== '').join(', ');

          entity = TreatmentModel.create({
            id: route?.items?.id,
            warning_count: updatedWarningCount,
            status: status,
            action: `has modified ${actionString}`,
            treatment_id: route?.items?.treatment_id,
            tds: tds,
            ph: ph,
            temperature: temperature,
            machine: route?.type,
          })
        }

      } else if (route?.type?.toLowerCase() === "sand filter" ||
        route?.type?.toLowerCase() === "carbon filter" ||
        route?.type?.toLowerCase() === "resin filter") {
        if (tds == '') {
          alert('បរាជ័យ', 'សូ​មបំពេញ TDS')
          return
        }
        if (ph == '') {
          alert('បរាជ័យ', 'សូ​មបំពេញ PH')
          return
        }
        if (temperature == '') {
          alert('បរាជ័យ', 'សូ​មបំពេញ Temperature')
          return
        }
        if (pressure == '') {
          alert('បរាជ័យ', 'សូ​មបំពេញ Pressure')
          return
        }
        if (airRelease == null) {
          alert('បរាជ័យ', 'សូ​មជ្រើសរើស Air Release')
          return
        }
        let updatedWarningCount = 0;
        let status = 'normal'
        if (parseFloat(tds) > 300) {
          updatedWarningCount++;
        }
        if (parseFloat(ph) < 6.5 || parseFloat(ph) > 8.5) {
          updatedWarningCount++;
        }
        if (parseFloat(temperature) < 25 || parseFloat(temperature) > 35) {
          updatedWarningCount++;
        }
        if (parseFloat(pressure) < 0.1 || parseFloat(pressure) > 0.3) {
          updatedWarningCount++;
        }
        if (airRelease == 0) {
          updatedWarningCount++;
        }
        if (updatedWarningCount > 0) {
          status = 'warning'
        }
        if (route?.items?.status == 'pending') {
          entity = TreatmentModel.create({
            id: route?.items?.id,
            warning_count: updatedWarningCount,
            status: status,
            air_release: airRelease,
            action: "Add Treatment",
            treatment_id: route?.items?.treatment_id,
            machine: route?.type,
            tds: tds,
            ph: ph,
            temperature: temperature,
            pressure: pressure,
            other: other
          })
        } else {
          const changes = [
            route?.items?.tds != tds ? `TDS from ${route?.items?.tds} to ${tds}` : '',
            route?.items?.ph != ph ? `PH from ${route?.items?.ph} to ${ph}` : '',
            route?.items?.temperature != temperature ? `Temperature from ${route?.items?.temperature} to ${temperature}` : '',
            route?.items?.pressure != pressure ? `Pressure from ${route?.items?.pressure} to ${pressure}` : '',
            route?.items?.air_release != airRelease ? `Air Release from ${route?.items?.air_release == 1 ? 'Yes' : 'No'} to ${airRelease == 1 ? 'Yes' : 'No'}` : '',
            route?.items?.other != other ? `Other from ${route?.items?.other == null ? '' : route?.items?.other} to ${other}` : '',
          ];
          const actionString = changes.filter(change => change !== '').join(', ');

          entity = TreatmentModel.create({
            id: route?.items?.id,
            warning_count: updatedWarningCount,
            status: status,
            air_release: airRelease,
            action: `has modified ${actionString}`,
            treatment_id: route?.items?.treatment_id,
            machine: route?.type,
            tds: tds,
            ph: ph,
            temperature: temperature,
            pressure: pressure,
            other: other
          })
        }
      } else if ((route?.type?.toLowerCase()?.startsWith("micro"))) {
        if (tds == '') {
          alert('បរាជ័យ', 'សូ​មបំពេញ TDS')
          return
        }
        if (ph == '') {
          alert('បរាជ័យ', 'សូ​មបំពេញ PH')
          return
        }
        if (temperature == '') {
          alert('បរាជ័យ', 'សូ​មបំពេញ Temperature')
          return
        }
        if (pressure == '') {
          alert('បរាជ័យ', 'សូ​មបំពេញ Pressure')
          return
        }
        let updatedWarningCount = 0;
        let status = 'normal'
        if (parseFloat(tds) > 300) {
          updatedWarningCount++;
        }
        if (parseFloat(ph) < 6.5 || parseFloat(ph) > 8.5) {
          updatedWarningCount++;
        }
        if (parseFloat(temperature) < 25 || parseFloat(temperature) > 35) {
          updatedWarningCount++;
        }
        if (parseFloat(pressure) < 0.1 || parseFloat(pressure) > 0.3) {
          updatedWarningCount++;
        }
        if (updatedWarningCount > 0) {
          status = 'warning'
        }
        if (route?.items?.status == 'pending') {
          entity = TreatmentModel.create({
            id: route?.items?.id,
            warning_count: updatedWarningCount,
            status: status,
            action: "Add Treatment",
            treatment_id: route?.items?.treatment_id,
            machine: route?.type,
            tds: tds,
            ph: ph,
            temperature: temperature,
            pressure: pressure,
            other: other
          })
        } else {
          const changes = [
            route?.items?.tds != tds ? `TDS from ${route?.items?.tds} to ${tds}` : '',
            route?.items?.ph != ph ? `PH from ${route?.items?.ph} to ${ph}` : '',
            route?.items?.temperature != temperature ? `Temperature from ${route?.items?.temperature} to ${temperature}` : '',
            route?.items?.pressure != pressure ? `Pressure from ${route?.items?.pressure} to ${pressure}` : '',
            route?.items?.other != other ? `Other from ${route?.items?.other == null ? '' : route?.items?.other} to ${other}` : '',
          ];
          const actionString = changes.filter(change => change !== '').join(', ');

          entity = TreatmentModel.create({
            id: route?.items?.id,
            warning_count: updatedWarningCount,
            status: status,
            action: `has modified ${actionString}`,
            treatment_id: route?.items?.treatment_id,
            machine: route?.type,
            tds: tds,
            ph: ph,
            temperature: temperature,
            pressure: pressure,
            other: other
          })
        }
      } else if ((route?.type?.toLowerCase()?.startsWith("reverses"))) {
        if (tds == '') {
          alert('បរាជ័យ', 'សូ​មបំពេញ TDS')
          return
        }
        if (ph == '') {
          alert('បរាជ័យ', 'សូ​មបំពេញ PH')
          return
        }
        if (pressInlet == '') {
          alert('បរាជ័យ', 'សូ​មបំពេញ Press-inlet')
          return
        }
        if (pressTreat == '') {
          alert('បរាជ័យ', 'សូ​មបំពេញ Press-Treat')
          return
        }
        if (pressDrain == '') {
          alert('បរាជ័យ', 'សូ​មបំពេញ Press-Drain')
          return
        }
        if (odor == null) {
          alert('បរាជ័យ', 'សូ​មជ្រើសរើស Odor')
          return
        }
        if (taste == null) {
          alert('បរាជ័យ', 'សូ​មជ្រើសរើស Taste')
          return
        }
        let updatedWarningCount = 0;
        let status = 'normal'
        if (parseFloat(tds) > 10) {
          updatedWarningCount++;
        }
        if (parseFloat(ph) < 6.5 || parseFloat(ph) > 8.5) {
          updatedWarningCount++;
        }
        if (parseFloat(pressInlet) < 0.01 || parseFloat(pressInlet) > 0.3) {
          updatedWarningCount++;
        }
        if (parseFloat(pressTreat) < 0.01 || parseFloat(pressTreat) > 1.5) {
          updatedWarningCount++;
        }
        if (parseFloat(pressDrain) < 0.01 || parseFloat(pressDrain) > 1.5) {
          updatedWarningCount++;
        }
        if (odor == 0) {
          updatedWarningCount++;
        }
        if (taste == 0) {
          updatedWarningCount++;
        }
        if (updatedWarningCount > 0) {
          status = 'warning'
        }
        if (route?.items?.status == 'pending') {
          entity = TreatmentModel.create({
            id: route?.items?.id,
            warning_count: updatedWarningCount,
            status: status,
            action: "Add Treatment",
            treatment_id: route?.items?.treatment_id,
            machine: route?.type,
            tds: tds,
            ph: ph,
            press_drain: pressDrain,
            press_inlet: pressInlet,
            press_treat: pressTreat,
            odor: odor,
            taste: taste,
            other: other
          })
        } else {
          const changes = [
            route?.items?.tds != tds ? `TDS from ${route?.items?.tds} to ${tds}` : '',
            route?.items?.ph != ph ? `PH from ${route?.items?.ph} to ${ph}` : '',
            route?.items?.press_inlet != pressInlet ? `Press-inlet from ${route?.items?.press_inlet} to ${pressInlet}` : '',
            route?.items?.press_treat != pressTreat ? `Press-Treat from ${route?.items?.press_treat} to ${pressTreat}` : '',
            route?.items?.press_drain != pressDrain ? `Press-Drain from ${route?.items?.press_drain} to ${pressDrain}` : '',
            route?.items?.odor != odor ? `Odor from ${route?.items?.odor == 1 ? 'Yes' : 'No'} to ${odor == 1 ? 'Yes' : 'No'}` : '',
            route?.items?.taste != taste ? `Taste from ${route?.items?.taste == 1 ? 'Yes' : 'No'} to ${taste == 1 ? 'Yes' : 'No'}` : '',
            route?.items?.other != other ? `Other from ${route?.items?.other == null ? '' : route?.items?.other} to ${other}` : '',
          ];
          const actionString = changes.filter(change => change !== '').join(', ');

          entity = TreatmentModel.create({
            id: route?.items?.id,
            warning_count: updatedWarningCount,
            status: status,
            action: `has modified ${actionString}`,
            treatment_id: route?.items?.treatment_id,
            machine: route?.type,
            tds: tds,
            ph: ph,
            press_drain: pressDrain,
            press_inlet: pressInlet,
            press_treat: pressTreat,
            odor: odor,
            taste: taste,
            other: other
          })
        }
      }
      try {
        setLoading((pre) => ({ ...pre, submitting: true }));

        await (waterTreatmentStore
          .createWtpRequest(entity)
          .saveWtp2()
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
        route?.onReturn(true)
        setLoading({ image: false, submitting: false })
      }
    };

    return (
      <Provider>
        <Portal>
          <KeyboardAvoidingView behavior={"padding"} keyboardVerticalOffset={100} style={[$root]}>
            {isLoading.image && (
              <View style={styles.overlay}>
                <ActivityIndicator color="#8CC8FF" size={35} />
                <View style={{ marginVertical: 15 }}></View>
                <Text whiteColor textAlign={"center"}>
                  {translate("wtpcommon.processImage")} ...
                </Text>
              </View>
            )}
            {isLoading.submitting && (
              <View style={styles.overlay}>
                <ActivityIndicator color="#8CC8FF" size={35} />
                <View style={{ marginVertical: 15 }}></View>
                <Text whiteColor textAlign={"center"}>
                  {translate("wtpcommon.savingRecord")} ...
                </Text>
              </View>
            )}

            <View>
              <ScrollView>
                <View style={$outer}>
                  {route?.isvalidDate && route?.isValidShift && route?.isEdit && (
                    <View>
                      {isOffline && (
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                          <IconSecondary name="cloud-offline" size={19} color={"red"} />
                          <Text style={{ marginRight: 5 }} errorColor caption1 semibold>
                            You are offline
                          </Text>
                        </View>
                      )}
                      <ActivityBar
                        onScanCamera={onlaunchCamera}
                        direction="end"
                        disable
                        onActivity={() => setShowlog(true)}
                        onAttachment={onlaunchGallery}
                      />
                    </View>
                  )}

                  <View
                    key={"header"}
                    style={[$containerHorizon, { marginBottom: 40, marginTop: 15 }]}
                  >
                    {route?.type?.toLowerCase()?.startsWith("raw water stock") ? (
                      <View>
                        <View style={main}>
                          <View style={sub}>
                            <View style={{ marginRight: 10 }}>
                              <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                <Text style={{ marginRight: 5, fontSize: 16 }}>TDS</Text>
                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>(≤300 ppm)</Text>
                                {(parseFloat(tds) > 300) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}

                              </View>
                              <TextInput
                                keyboardType="decimal-pad"
                                value={tds}
                                readOnly={!isEditable}
                                style={[styles.input, { width: '100%' }]}
                                placeholder="Please Enter"
                                onChangeText={(text) => setTds(text)}>
                              </TextInput>
                              {tds == '' ?
                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ TDS</Text>
                                : <></>}
                            </View>
                          </View >
                          <View style={sub}>
                            <View style={{ marginRight: 10 }}>
                              <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                <Text style={{ marginRight: 5, fontSize: 16 }}>PH</Text>
                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>(6.5-8.5)</Text>
                                {(parseFloat(ph) < 6.5 || parseFloat(ph) > 8.5) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                              </View>
                              <TextInput
                                keyboardType="decimal-pad"
                                value={ph}
                                readOnly={!isEditable}
                                style={[styles.input, { width: '100%' }]}
                                placeholder="Please Enter"
                                onChangeText={(text) => setPH(text)}>
                              </TextInput>
                              {ph == '' ?
                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ PH</Text>
                                : <></>}
                            </View>
                          </View>
                        </View>
                        <View style={main}>
                          <View style={sub}>
                            <View style={{ marginRight: 10 }}>
                              <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                <Text style={{ marginRight: 5, fontSize: 16 }}>Temperature</Text>
                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>(25-35)°C</Text>
                                {(parseFloat(temperature) < 25 || parseFloat(temperature) > 35) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                              </View>
                              <TextInput
                                keyboardType="decimal-pad"
                                value={temperature}
                                readOnly={!isEditable}
                                style={[styles.input, { width: '100%' }]}
                                placeholder="Please Enter"
                                onChangeText={(text) => setTemperature(text)}>
                              </TextInput>
                              {temperature == '' ?
                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Temperature</Text>
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
                                readOnly={!isEditable}
                                style={[styles.input, { width: '100%' }]}
                                placeholder="Please Enter"
                                onChangeText={(text) => setOther(text)}>
                              </TextInput>
                            </View>
                          </View>
                        </View>
                      </View>
                    ) : (route?.type?.toLowerCase() === "sand filter" ||
                      route?.type?.toLowerCase() === "carbon filter" ||
                      route?.type?.toLowerCase() === "resin filter") ?
                      <View>
                        <View style={main}>
                          <View style={sub}>
                            <View style={{ marginRight: 10 }}>
                              <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                <Text style={{ marginRight: 5, fontSize: 16 }}>TDS</Text>
                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>(≤300 ppm)</Text>
                                {(parseFloat(tds) > 300) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}

                              </View>
                              <TextInput
                                keyboardType="decimal-pad"
                                value={tds}
                                readOnly={!isEditable}
                                style={[styles.input, { width: '100%' }]}
                                placeholder="Please Enter"
                                onChangeText={(text) => setTds(text)}>
                              </TextInput>
                              {tds == '' ?
                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ TDS</Text>
                                : <></>}
                            </View>
                          </View >
                          <View style={sub}>
                            <View style={{ marginRight: 10 }}>
                              <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                <Text style={{ marginRight: 5, fontSize: 16 }}>PH</Text>
                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>(6.5-8.5)</Text>
                                {(parseFloat(ph) < 6.5 || parseFloat(ph) > 8.5) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                              </View>
                              <TextInput
                                keyboardType="decimal-pad"
                                value={ph}
                                readOnly={!isEditable}
                                style={[styles.input, { width: '100%' }]}
                                placeholder="Please Enter"
                                onChangeText={(text) => setPH(text)}>
                              </TextInput>
                              {ph == '' ?
                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ PH</Text>
                                : <></>}
                            </View>
                          </View>
                        </View>
                        <View style={main}>
                          <View style={sub}>
                            <View style={{ marginRight: 10 }}>
                              <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                <Text style={{ marginRight: 5, fontSize: 16 }}>Temperature</Text>
                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>(25-35)°C</Text>
                                {(parseFloat(temperature) < 25 || parseFloat(temperature) > 35) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                              </View>
                              <TextInput
                                keyboardType="decimal-pad"
                                value={temperature}
                                readOnly={!isEditable}
                                style={[styles.input, { width: '100%' }]}
                                placeholder="Please Enter"
                                onChangeText={(text) => setTemperature(text)}>
                              </TextInput>
                              {temperature == '' ?
                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Temperature</Text>
                                : <></>}
                            </View>
                          </View >
                          <View style={sub}>
                            <View style={{ marginRight: 10 }}>
                              <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                <Text style={{ marginRight: 5, fontSize: 16 }}>Pressure</Text>
                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>(0.1-0.3 Mpa)</Text>
                                {(parseFloat(pressure) < 0.1 || parseFloat(pressure) > 0.3) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                              </View>
                              <TextInput
                                keyboardType="decimal-pad"
                                value={pressure}
                                readOnly={!isEditable}
                                style={[styles.input, { width: '100%' }]}
                                placeholder="Please Enter"
                                onChangeText={(text) => setPressure(text)}>
                              </TextInput>
                              {pressure == '' ?
                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Pressure</Text>
                                : <></>}
                            </View>
                          </View >
                          {/* <View style={sub}>
                            <View style={{ marginRight: 10 }}>
                              <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                <Text style={{ marginRight: 5, fontSize: 16 }}>Other</Text>
                              </View>
                              <TextInput
                                value={pressure}
                                readOnly={!isEditable}
                                style={[styles.input, { width: '100%' }]}
                                placeholder="Please Enter"
                                onChangeText={(text) => setOther(text)}>
                              </TextInput>
                            </View>
                          </View> */}
                        </View>
                        <View style={main}>
                          <View style={sub}>
                            <View style={{ marginRight: 10 }}>
                              <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                <Text style={{ marginRight: 5, fontSize: 16 }}>Air Release</Text>
                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>(Y / N)</Text>
                                {(airRelease) == 0 ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                              </View>
                              <View style={{ flexDirection: 'row' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
                                  <Checkbox
                                    disabled={!isEditable}
                                    status={
                                      airRelease === null
                                        ? "unchecked"
                                        : airRelease == 1
                                          ? "checked"
                                          : "unchecked"
                                    }
                                    onPress={() => {
                                      setAirRelease(1)
                                    }}
                                    color="#0081F8"
                                  />
                                  <Text>Yes </Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                  <Checkbox
                                    disabled={!isEditable}
                                    status={
                                      airRelease === null
                                        ? "unchecked"
                                        : airRelease == 0
                                          ? "checked"
                                          : "unchecked"
                                    }
                                    onPress={() => {
                                      setAirRelease(0)
                                    }}
                                    color="#0081F8"
                                  />
                                  <Text>No </Text>
                                </View>

                              </View>
                              {airRelease == null ?
                                <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមជ្រើសរើស Air Release</Text>
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
                                readOnly={!isEditable}
                                style={[styles.input, { width: '100%' }]}
                                placeholder="Please Enter"
                                onChangeText={(text) => setOther(text)}>
                              </TextInput>
                            </View>
                          </View>
                        </View>
                      </View>
                      : (route?.type?.toLowerCase()?.startsWith("micro")) ?
                        <View>
                          <View style={main}>
                            <View style={sub}>
                              <View style={{ marginRight: 10 }}>
                                <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                  <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                  <Text style={{ marginRight: 5, fontSize: 16 }}>TDS</Text>
                                  <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>(≤300 ppm)</Text>
                                  {(parseFloat(tds) > 300) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}

                                </View>
                                <TextInput
                                  keyboardType="decimal-pad"
                                  value={tds}
                                  readOnly={!isEditable}
                                  style={[styles.input, { width: '100%' }]}
                                  placeholder="Please Enter"
                                  onChangeText={(text) => setTds(text)}>
                                </TextInput>
                                {tds == '' ?
                                  <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ TDS</Text>
                                  : <></>}
                              </View>
                            </View >
                            <View style={sub}>
                              <View style={{ marginRight: 10 }}>
                                <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                  <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                  <Text style={{ marginRight: 5, fontSize: 16 }}>PH</Text>
                                  <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>(6.5-8.5)</Text>
                                  {(parseFloat(ph) < 6.5 || parseFloat(ph) > 8.5) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                </View>
                                <TextInput
                                  keyboardType="decimal-pad"
                                  value={ph}
                                  readOnly={!isEditable}
                                  style={[styles.input, { width: '100%' }]}
                                  placeholder="Please Enter"
                                  onChangeText={(text) => setPH(text)}>
                                </TextInput>
                                {ph == '' ?
                                  <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ PH</Text>
                                  : <></>}
                              </View>
                            </View>
                          </View>
                          <View style={main}>
                            <View style={sub}>
                              <View style={{ marginRight: 10 }}>
                                <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                  <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                  <Text style={{ marginRight: 5, fontSize: 16 }}>Pressure</Text>
                                  <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>(0.1-0.3 Mpa)</Text>
                                  {(parseFloat(pressure) < 0.1 || parseFloat(pressure) > 0.3) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                </View>
                                <TextInput
                                  keyboardType="decimal-pad"
                                  value={pressure}
                                  readOnly={!isEditable}
                                  style={[styles.input, { width: '100%' }]}
                                  placeholder="Please Enter"
                                  onChangeText={(text) => setPressure(text)}>
                                </TextInput>
                                {pressure == '' ?
                                  <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Pressure</Text>
                                  : <></>}
                              </View>
                            </View >
                            <View style={sub}>
                              <View style={{ marginRight: 10 }}>
                                <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                  <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                  <Text style={{ marginRight: 5, fontSize: 16 }}>Temperature</Text>
                                  <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>(25-35)°C</Text>
                                  {(parseFloat(temperature) < 25 || parseFloat(temperature) > 35) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                </View>
                                <TextInput
                                  keyboardType="decimal-pad"
                                  value={temperature}
                                  readOnly={!isEditable}
                                  style={[styles.input, { width: '100%' }]}
                                  placeholder="Please Enter"
                                  onChangeText={(text) => setTemperature(text)}>
                                </TextInput>
                                {temperature == '' ?
                                  <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Temperature</Text>
                                  : <></>}
                              </View>
                            </View >
                          </View>
                          <View style={{ flex: 1 }}>
                            {/* <View style={sub}> */}
                            <View style={{ marginRight: 10 }}>
                              <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                <Text style={{ marginRight: 5, fontSize: 16 }}>Other</Text>
                              </View>
                              <TextInput
                                value={other}
                                readOnly={!isEditable}
                                style={[styles.input, { width: '100%' }]}
                                placeholder="Please Enter"
                                onChangeText={(text) => setOther(text)}>
                              </TextInput>
                            </View>
                          </View>
                          {/* </View> */}
                        </View>
                        : (route?.type?.toLowerCase()?.startsWith("reverses")) ?
                          <View>
                            <View style={main}>
                              <View style={sub}>
                                <View style={{ marginRight: 10 }}>
                                  <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                    <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                    <Text style={{ marginRight: 5, fontSize: 16 }}>TDS</Text>
                                    <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>(≤10 ppm)</Text>
                                    {(parseFloat(tds) > 10) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}

                                  </View>
                                  <TextInput
                                    keyboardType="decimal-pad"
                                    value={tds}
                                    readOnly={!isEditable}
                                    style={[styles.input, { width: '100%' }]}
                                    placeholder="Please Enter"
                                    onChangeText={(text) => setTds(text)}>
                                  </TextInput>
                                  {tds == '' ?
                                    <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ TDS</Text>
                                    : <></>}
                                </View>
                              </View >
                              <View style={sub}>
                                <View style={{ marginRight: 10 }}>
                                  <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                    <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                    <Text style={{ marginRight: 5, fontSize: 16 }}>PH</Text>
                                    <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>(6.5-8.5)</Text>
                                    {(parseFloat(ph) < 6.5 || parseFloat(ph) > 8.5) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                  </View>
                                  <TextInput
                                    keyboardType="decimal-pad"
                                    value={ph}
                                    readOnly={!isEditable}
                                    style={[styles.input, { width: '100%' }]}
                                    placeholder="Please Enter"
                                    onChangeText={(text) => setPH(text)}>
                                  </TextInput>
                                  {ph == '' ?
                                    <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ PH</Text>
                                    : <></>}
                                </View>
                              </View>
                            </View>
                            <View style={main}>
                              <View style={sub}>
                                <View style={{ marginRight: 10 }}>
                                  <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                    <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                    <Text style={{ marginRight: 5, fontSize: 16 }}>Press-inlet</Text>
                                    <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>(0.01-0.3 Mpa)</Text>
                                    {(parseFloat(pressInlet) < 0.01 || parseFloat(pressInlet) > 0.3) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                  </View>
                                  <TextInput
                                    keyboardType="decimal-pad"
                                    value={pressInlet}
                                    readOnly={!isEditable}
                                    style={[styles.input, { width: '100%' }]}
                                    placeholder="Please Enter"
                                    onChangeText={(text) => setPressInlet(text)}>
                                  </TextInput>
                                  {pressInlet == '' ?
                                    <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Press-inlet</Text>
                                    : <></>}
                                </View>
                              </View >
                              <View style={sub}>
                                <View style={{ marginRight: 10 }}>
                                  <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                    <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                    <Text style={{ marginRight: 5, fontSize: 16 }}>Press-Treat</Text>
                                    <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>(0.01-1.5 Mpa)</Text>
                                    {(parseFloat(pressTreat) < 0.01 || parseFloat(pressTreat) > 1.5) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                  </View>
                                  <TextInput
                                    keyboardType="decimal-pad"
                                    value={pressTreat}
                                    readOnly={!isEditable}
                                    style={[styles.input, { width: '100%' }]}
                                    placeholder="Please Enter"
                                    onChangeText={(text) => setPressTreat(text)}>
                                  </TextInput>
                                  {pressTreat == '' ?
                                    <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Press-Treat</Text>
                                    : <></>}
                                </View>
                              </View >
                            </View>
                            <View style={main}>
                              <View style={sub}>
                                <View style={{ marginRight: 10 }}>
                                  <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                    <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                    <Text style={{ marginRight: 5, fontSize: 16 }}>Press-Drain</Text>
                                    <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>(0.01-1.5 Mpa)</Text>
                                    {(parseFloat(pressDrain) < 0.01 || parseFloat(pressDrain) > 1.5) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                  </View>
                                  <TextInput
                                    keyboardType="decimal-pad"
                                    value={pressDrain}
                                    readOnly={!isEditable}
                                    style={[styles.input, { width: '100%' }]}
                                    placeholder="Please Enter"
                                    onChangeText={(text) => setPressDrain(text)}>
                                  </TextInput>
                                  {pressDrain == '' ?
                                    <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Press-Drain</Text>
                                    : <></>}
                                </View>
                              </View >
                              <View style={sub}>
                                <View style={{ flexDirection: 'row' }}>
                                  <View style={{ marginRight: 10 }}>
                                    <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                      <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                      <Text style={{ marginRight: 5, fontSize: 16 }}>Oder</Text>
                                      <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>(Y / N)</Text>
                                      {(odor) == 0 ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                      <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
                                        <Checkbox
                                          disabled={!isEditable}
                                          status={
                                            odor === null
                                              ? "unchecked"
                                              : odor == 1
                                                ? "checked"
                                                : "unchecked"
                                          }
                                          onPress={() => {
                                            setOdor(1)
                                          }}
                                          color="#0081F8"
                                        />
                                        <Text>Yes </Text>
                                      </View>
                                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Checkbox
                                          disabled={!isEditable}
                                          status={
                                            odor === null
                                              ? "unchecked"
                                              : odor == 0
                                                ? "checked"
                                                : "unchecked"
                                          }
                                          onPress={() => {
                                            setOdor(0)
                                          }}
                                          color="#0081F8"
                                        />
                                        <Text>No </Text>
                                      </View>

                                    </View>
                                    {odor == null ?
                                      <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមជ្រើសរើស Odor</Text>
                                      : <></>}

                                  </View>
                                  <View style={{ marginLeft: 80 }}>
                                    <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                      <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                      <Text style={{ marginRight: 5, fontSize: 16 }}>Taste</Text>
                                      <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>(Y / N)</Text>
                                      {(taste) == 0 ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                      <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
                                        <Checkbox
                                          disabled={!isEditable}
                                          status={
                                            taste === null
                                              ? "unchecked"
                                              : taste == 1
                                                ? "checked"
                                                : "unchecked"
                                          }
                                          onPress={() => {
                                            setTaste(1)
                                          }}
                                          color="#0081F8"
                                        />
                                        <Text>Yes </Text>
                                      </View>
                                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Checkbox
                                          disabled={!isEditable}
                                          status={
                                            taste === null
                                              ? "unchecked"
                                              : taste == 0
                                                ? "checked"
                                                : "unchecked"
                                          }
                                          onPress={() => {
                                            setTaste(0)
                                          }}
                                          color="#0081F8"
                                        />
                                        <Text>No </Text>
                                      </View>

                                    </View>
                                    {taste == null ?
                                      <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមជ្រើសរើស Taste</Text>
                                      : <></>}

                                  </View>
                                </View>
                              </View>
                            </View>
                            <View style={{ flex: 1 }}>
                              {/* <View style={sub}> */}
                              <View style={{ marginRight: 10 }}>
                                <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                  <Text style={{ marginRight: 5, fontSize: 16 }}>Other</Text>
                                </View>
                                <TextInput
                                  value={other}
                                  readOnly={!isEditable}
                                  style={[styles.input, { width: '100%' }]}
                                  placeholder="Please Enter"
                                  onChangeText={(text) => setOther(text)}>
                                </TextInput>
                              </View>
                            </View>
                            {/* </View> */}
                          </View>
                          : <></>}
                  </View>
                </View>
              </ScrollView>
            </View>
            <ActivityModal log={activities} onClose={() => setShowlog(false)} isVisible={showLog} />
          </KeyboardAvoidingView>
        </Portal>
      </Provider>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
  backgroundColor: "white",
}
const $outer: ViewStyle = {
  marginVertical: 25,
  marginHorizontal: 34,
}

const $containerHorizon: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: 25,
}

const $width: ViewStyle = {
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
