import React, { FC, useEffect, useLayoutEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import Icon from "react-native-vector-icons/Ionicons"
import * as ImagePicker from "expo-image-picker"
import { AppStackScreenProps } from "app/navigators"
import { Text } from "app/components/v2"
import {
  View,
  ViewStyle,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  ScrollView,
  TextInput,
} from "react-native"
import ActivityBar from "app/components/v2/WaterTreatment/ActivityBar"
import CustomInput from "app/components/v2/DailyPreWater/CustomInput"
import { Badge, Checkbox, Divider, Portal, Provider } from "react-native-paper"
import { useNavigation, useRoute } from "@react-navigation/native"
import ActivityModal from "app/components/v2/ActivitylogModal"
import InstructionList from "app/components/v2/HACCP/InstructionList"
import { useStores } from "app/models"
import { ALERT_TYPE, Dialog } from "react-native-alert-notification"
import { ImagetoText, getResultImageCamera, getResultImageGallery } from "app/utils-v2/ocr"
import { HaccpActionType, LinesItemModel } from "app/models/haccp-monitoring/haccp-lines-model"
import { styles } from "./styles"
import { translate } from "../../../i18n/translate"
import IconAntDesign from "react-native-vector-icons/AntDesign"

interface HaccpLineFormScreenProps extends AppStackScreenProps<"HaccpLineForm"> { }
export const HaccpLineFormScreen: FC<HaccpLineFormScreenProps> = observer(
  function HaccpLineFormScreen() {
    const route = useRoute().params
    const { haccpLinesStore, authStore ,inventoryRequestStore} = useStores()
    const [activityLogs, setActivityLogs] = useState<HaccpActionType[]>([])
    const navigation = useNavigation()
    const [showinstruction, setShowInstruction] = useState(true)
    const [disableSave, setDisableSave] = useState(false)
    const [showActivitylog, setShowActivitylog] = useState(false)
    const [currUser, setCurrUser] = useState("")
    const [isLoading, setLoading] = useState(false)
    const [isScanning, setScanning] = useState(false)
    const [image, setImage] = useState(null)
    const [waterPressure, setWaterPressure] = useState(route?.item?.water_pressure || '')
    const [nozzlesRinser, setNozzlesRinser] = useState(route?.item?.nozzles_rinser != null ? parseFloat(route?.item?.nozzles_rinser) : null)
    const [fg, setFg] = useState(route?.item?.fg || '')
    const [smell, setSmell] = useState(route?.item?.smell != null ? parseFloat(route?.item?.smell) : null)
    const [activities, setActivities] = useState(route?.item?.activity_control != null ? parseFloat(route?.item?.activity_control) : null)
    const [takeAction, setTakeAction] = useState(route?.item?.take_action || '')
    const [other, setOther] = useState(route?.item?.other || '')
    const [isEdit, setIsEdit] = useState()
    const [sideWall, setSideWall] = useState(route?.item?.side_wall || '')
    const [airPressure, setAirPressure] = useState(route?.item?.air_pressure || '')
    const [temperaturePreform, setTemperaturePreform] = useState(route?.item?.temperature_preform || '')
    const [treatedWaterPressure, setTreatedWaterPressure] = useState(route?.item?.treated_water_pressure || '')
    const [allFcm, setAllFcm] = useState([])

    const [formLineA, setFormLineA] = useState({
      side_wall: "",
      air_pressure: "",
      tem_preform: "",
      tw_pressure: "",
      FG: "",
      activity_control: null,
      instruction: "",
    })
    const [formLineB, setFormLineB] = useState({
      water_pressure: "",
      nozzie_rinser: null,
      FG: "",
      activity_control: null,
      smell: null,
      instruction: "",
      other: "",
    })
    const [errorsLineB, setErrorsLineB] = useState({
      water_pressure: true,
      nozzie_rinser: true,
      FG: true,
      activity_control: true,
      smell: true,
      instruction: (formLineB.nozzie_rinser == null || formLineB.nozzie_rinser == false || formLineB.smell == null || formLineB.smell == false) ? true : false,
      other: false,
    })
    const [errorsLineA, setErrorsLineA] = useState({
      side_wall: true,
      air_pressure: true,
      tem_preform: true,
      tw_pressure: true,
      FG: true,
      activity_control: true,
      instruction: true,
    })

    const onShowInstruction = () => {
      setShowInstruction((pre) => !pre)
    }

    const performOCR = async (file: ImagePicker.ImagePickerAsset) => {
      setLoading(true)

      try {
        const result = await ImagetoText(file)
        if (!result) {
          setLoading(false)

          return
        }
        setImageToform(result["annotations"])
      } catch (error) {
        Dialog.show({
          type: ALERT_TYPE.WARNING,
          title: "បរាជ័យ",
          autoClose: 500,
          textBody: "ស្កែនរូបភាពទៅជាអត្ថបទមិនជោគជ័យទេ។",
        })
      } finally {
        setLoading(false)
      }
    }
    const setImageToform = (result: string[]) => {
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

      if ([4, 5, 6]?.includes(+route?.line)) {
        const [side_wall] = numberic.filter(
          (item) =>
            (parseInt(item) >= 100 && parseInt(item) <= 110) ||
            (parseInt(item) < 100 && parseInt(item) > 50) ||
            (parseInt(item) > 110 && parseInt(item) < 150),
        )

        const [air_pressure] = numberic.filter(
          (item) =>
            (parseInt(item) >= 1.5 && parseInt(item) <= 3) ||
            (parseInt(item) < 1.5 && parseInt(item) >= 1),
        )
        const [tem_preform] = numberic.filter(
          (item) =>
            (parseInt(item) >= 100 && parseInt(item) <= 110) ||
            (parseInt(item) < 100 && parseInt(item) > 50) ||
            (parseInt(item) > 110 && parseInt(item) < 150),
        )
        const [treat_water_pressure] = numberic.filter(
          (item) =>
            (parseInt(item) >= 1.5 && parseInt(item) <= 3) ||
            (parseInt(item) < 1.5 && parseInt(item) >= 1),
        )
        const [fg] = numberic.filter(
          (item) =>
            (parseInt(item) <= 0.4 && parseInt(item) >= 0.05) ||
            (parseInt(item) <= 0.05 && parseInt(item) >= 0),
        )

        setFormLineA({
          side_wall: side_wall,
          air_pressure: air_pressure,
          FG: fg,
          tem_preform: tem_preform,
          tw_pressure: treat_water_pressure,
        })
        setErrorsLineA({
          side_wall: !!side_wall,
          air_pressure: !!air_pressure,
          FG: !!fg,
          tem_preform: !!tem_preform,
          tw_pressure: !!treat_water_pressure,
        })
      } else {
        const filterWaterPressure = numberic?.filter((item) => {
          if (item.startsWith("03")) {
            return false
          }
          const value = parseFloat(item)
          return (value > 0 && value <= 1) || (value >= 1 && value <= 20)
        })

        const water_pressure = Math.max(...filterWaterPressure?.map((item) => parseFloat(item)))

        const [nozzie_rinser] = numberic.filter(
          (item) => parseInt(item) >= 32 && parseInt(item) <= 40,
        )
        const [fg] = numberic.filter(
          (item) =>
            (parseInt(item) <= 0.4 && parseInt(item) >= 0.05) ||
            (parseInt(item) <= 0.05 && parseInt(item) >= 0),
        )

        setFormLineB({
          water_pressure: water_pressure,
          nozzie_rinser: nozzie_rinser,
          FG: fg,
        })
        setErrorsLineB({
          water_pressure: !!water_pressure,
          nozzie_rinser: !!nozzie_rinser,
          FG: !!fg,
        })
      }
    }

    const onlaunchGallery = async () => {
      try {
        const result = await getResultImageGallery()
        if (!result) {
          setLoading(false)
          return
        }
        if (!result?.canceled) {
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
          setLoading(false)
          return
        }
        if (!result?.canceled) {
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

    useEffect(() => {
      const role = async () => {
        try {
          const rs = await authStore.getUserInfo();
          const admin = rs.data.authorities.includes('ROLE_PROD_PRO_ADMIN')
          const edit = (route?.isvalidDate || route?.assign) || admin
          setIsEdit(edit)
          // Modify the list based on the user's role
          // setGetRole(rs)
          const data = (await inventoryRequestStore.getMobileUserList())
          const usersWithRole = data.filter(user =>
            user.authorities.some(authority => authority.authority_name === "ROLE_PROD_PRO_ADMIN")
          );

          // Extract fcm_token from the filtered user object
          const fcmTokens = usersWithRole.map(user => user.fcm_token);
          setAllFcm(fcmTokens)
        } catch (e) {
          console.log(e);
        }
      };
      role();
    }, [route]);

    useLayoutEffect(() => {
      navigation.setOptions({
        headerShown: true,
        title: "Line - " + route?.line?.toString(),
        headerRight: () =>
          (isEdit) ? (
            <TouchableOpacity
              disabled={disableSave}
              style={{
                flexDirection: "row",
                alignItems: "center",
                display: disableSave ? "none" : "flex",
              }}
              onPress={() => {
                if ([4, 5, 6].includes(+route?.line)) {
                  line456Submit();
                }
                if ([2, 3].includes(+route?.line)) {
                  line23Submit();
                }
              }}
            >
              <Icon name="checkmark-sharp" size={24} color={"#0081F8"} />
              <Text primaryColor body1 semibold>
                {translate("wtpcommon.save")}
              </Text>
            </TouchableOpacity>
          ) : (
            <></>
          ),
      });
    }, [route, navigation, waterPressure, nozzlesRinser, fg, smell, activities, takeAction, other, sideWall, airPressure, temperaturePreform, treatedWaterPressure, isEdit,allFcm]);

    async function sendNotification(title: string, body: string, deviceTokens, sound = 'default') {
      const SERVER_KEY = 'AAAAOOy0KJ8:APA91bFo9GbcJoCq9Jyv2iKsttPa0qxIif32lUnDmYZprkFHGyudIlhqtbvkaA1Nj9Gzr2CC3aiuw4L-8DP1GDWh3olE1YV4reA3PJwVMTXbSzquIVl4pk-XrDaqZCoAhmsN5apvkKUm';

      try {
        const response = await fetch('https://fcm.googleapis.com/fcm/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `key=${SERVER_KEY}`
          },
          body: JSON.stringify({
            registration_ids: deviceTokens,
            notification: {
              title: title,
              body: body,
              sound: sound,
            },
            android: {
              notification: {
                sound: sound,
                priority: 'high',
                vibrate: true,
              }
            }

          }),
        });
        const responseData = await response.json();
        console.log('Notification sent successfully:', responseData);
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    }

    const alert = (title: string, textBody: string) => {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: title,
        textBody: textBody,
        button: 'បិទ',
      })
    }

    const line23Submit = async () => {

      let updatedWarningCount = 0;
      if (waterPressure == '') {
        alert('បរាជ័យ', 'សូ​មបំពេញ Water Pressure')
        return
      }
      if (nozzlesRinser == null) {
        alert('បរាជ័យ', 'សូ​មជ្រើសរើស Nozzles rinser')
        return
      }
      if (fg == '') {
        alert('បរាជ័យ', 'សូ​មបំពេញ FG')
        return
      }
      if (smell == null) {
        alert('បរាជ័យ', 'សូ​មជ្រើសរើស Smell')
        return
      }
      if (activities == null) {
        alert('បរាជ័យ', 'សូ​មជ្រើសរើស Control')
        return
      }
      if (takeAction == '' && (nozzlesRinser == 0 || smell == 0)) {
        alert('បរាជ័យ', 'សូ​មបំពេញ Take action')
        return
      }

      let status = 'normal'
      if (parseFloat(waterPressure) < 1.0) {
        updatedWarningCount++;
      }
      if (parseFloat(fg) < 0.05 || parseFloat(fg) > 0.4) {
        updatedWarningCount++;
      }
      if (smell == 0) {
        updatedWarningCount++;
      }
      if (activities == 0) {
        updatedWarningCount++;
      }
      if (nozzlesRinser == 0) {
        updatedWarningCount++;
      }
      if (updatedWarningCount > 0) {
        status = 'warning'
      }
      let entity
      try {
        setLoading(true)
        if (route?.item == undefined) {
          entity = LinesItemModel.create({
            id: route?.item?.id ?? null,
            line: "Line" + " " + route?.line,
            warning_count: updatedWarningCount,
            status: status,
            water_pressure: waterPressure,
            fg: fg,
            nozzles_rinser: nozzlesRinser,
            smell: smell,
            activity_control: (activities).toString(),
            take_action: takeAction,
            other: other,
            haccp_id: route?.haccp_id,
            activities: [{ action: "Add Monitoring " }],
          })
        } else if (route?.item) {
          const changes = [
            route?.item?.water_pressure != waterPressure ? `Water Pressure from ${route?.item?.water_pressure} to ${waterPressure}` : '',
            parseFloat(route?.item?.nozzles_rinser) != parseFloat(nozzlesRinser) ? `Nozzles Rinser from ${parseFloat(route?.item?.nozzles_rinser) == 1 ? 'Yes' : 'No'} to ${parseFloat(nozzlesRinser) == 1 ? 'Yes' : 'No'}` : '',
            route?.item?.fg != fg ? `FG from ${route?.item?.fg} to ${fg}` : '',
            parseFloat(route?.item?.smell) != parseFloat(smell) ? `Smell from ${parseFloat(route?.item?.smell) == 1 ? 'Yes' : 'No'} to ${parseFloat(smell) == 1 ? 'Yes' : 'No'}` : '',
            parseFloat(route?.item?.activity_control) != parseFloat(activities) ? `Control from ${parseFloat(route?.item?.activity_control) == 1 ? 'Yes' : 'No'} to ${parseFloat(activities) == 1 ? 'Yes' : 'No'}` : '',
            route?.item?.take_action != takeAction ? `Take Action from ${route?.item?.take_action} to ${takeAction}` : '',
            route?.item?.other != other ? `Other from ${route?.item?.other} to ${other}` : '',
          ];
          const actionString = changes.filter(change => change !== '').join(', ');

          entity = LinesItemModel.create({
            id: route?.item?.id ?? null,
            line: "Line" + " " + route?.line,
            warning_count: updatedWarningCount,
            status: status,
            water_pressure: waterPressure,
            fg: fg,
            nozzles_rinser: nozzlesRinser,
            smell: smell,
            activity_control: (activities).toString(),
            take_action: takeAction,
            other: other,
            haccp_id: route?.haccp_id,
            activities: [{ action: `has modified ${actionString}` }],
          })
        }

        await (haccpLinesStore
          .addHaccpLines(entity)
          .saveHaccpLine23()
          .then()
          .catch((e) => console.log(e)))
        {
          if (nozzlesRinser == 0) {
            sendNotification(`Critical Warning Line - ${+ route?.line?.toString()}`, `Nozzles are clog now, Please take action.`,allFcm)
          }
          Dialog.show({
            type: ALERT_TYPE.SUCCESS,
            title: 'ជោគជ័យ',
            textBody: 'រក្សាទុកបានជោគជ័យ',
            // button: 'close',
            autoClose: 100
          })
          console.log(entity)
        }
      } catch (error) {
        console.log(error);
        // Show error dialog
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'បរាជ័យ',
          textBody: 'សូមបំពេញទិន្នន័យអោយបានត្រឹមត្រូវ',
          button: 'បិទ',
        });
      } finally {
        setLoading(false); // Reset loading state regardless of success or failure
        route?.onReload()
      }
    }

    const line456Submit = async () => {

      let updatedWarningCount = 0;
      if (sideWall == '') {
        alert('បរាជ័យ', 'សូ​មបំពេញ Side Wall')
        return
      }
      if (airPressure == '') {
        alert('បរាជ័យ', 'សូ​មបំពេញ Air Pressure')
        return
      }

      if (temperaturePreform == null) {
        alert('បរាជ័យ', 'សូ​មបំពេញ Temperature Preform')
        return
      }
      if (fg == '') {
        alert('បរាជ័យ', 'សូ​មបំពេញ FG')
        return
      }
      if (treatedWaterPressure == '') {
        alert('បរាជ័យ', 'សូ​មបំពេញ Treated Water Pressure')
        return
      }
      if (activities == null) {
        alert('បរាជ័យ', 'សូ​មជ្រើសរើស Control')
        return
      }
      let status = 'normal'
      if (parseFloat(sideWall) < 100 || parseFloat(sideWall) > 110) {
        updatedWarningCount++;
      }
      if (parseFloat(airPressure) < 1.5) {
        updatedWarningCount++;
      }
      if (parseFloat(temperaturePreform) < 87 || parseFloat(temperaturePreform) > 115) {
        updatedWarningCount++;
      }
      if (parseFloat(fg) < 0.05 || parseFloat(fg) > 0.4) {
        updatedWarningCount++;
      }
      if (parseFloat(treatedWaterPressure) < 1.5) {
        updatedWarningCount++;
      }
      if (activities == 0) {
        updatedWarningCount++;
      }
      if (updatedWarningCount > 0) {
        status = 'warning'
      }
      let entity
      setLoading(true)
      try {
        if (route?.item == undefined) {
          entity = LinesItemModel.create({
            id: route?.item?.id ?? null,
            line: "Line" + " " + route?.line,
            warning_count: updatedWarningCount,
            status: status,
            side_wall: sideWall,
            fg: fg,
            air_pressure: airPressure,
            temperature_preform: temperaturePreform,
            activity_control: (activities).toString(),
            treated_water_pressure: treatedWaterPressure,
            take_action: takeAction,
            other: other,
            haccp_id: route?.haccp_id,
            activities: [{ action: "Add Monitoring " }],
          })
        } else if (route?.item) {
          const changes = [
            route?.item?.side_wall != sideWall ? `Side Wall from ${route?.item?.side_wall} to ${sideWall}` : '',
            route?.item?.air_pressure != airPressure ? `Air Pressure from ${route?.item?.air_pressure} to ${airPressure}` : '',
            route?.item?.temperature_preform != temperaturePreform ? `Temperature Preform from ${route?.item?.temperature_preform} to ${temperaturePreform}` : '',
            route?.item?.fg != fg ? `FG from ${route?.item?.fg} to ${fg}` : '',
            route?.item?.treated_water_pressure != treatedWaterPressure ? `Treated Water Pressure from ${route?.item?.treated_water_pressure} to ${treatedWaterPressure}` : '',
            parseFloat(route?.item?.activity_control) != parseFloat(activities) ? `Control from ${parseFloat(route?.item?.activity_control) == 1 ? 'Yes' : 'No'} to ${parseFloat(activities) == 1 ? 'Yes' : 'No'}` : '',
            route?.item?.take_action != takeAction ? `Take Action from ${route?.item?.take_action} to ${takeAction}` : '',
            route?.item?.other !== other ? `Other from ${route?.item?.other} to ${other}` : ''
          ];
          const actionString = changes.filter(change => change !== '').join(', ');

          entity = LinesItemModel.create({
            id: route?.item?.id ?? null,
            line: "Line" + " " + route?.line,
            warning_count: updatedWarningCount,
            status: status,
            side_wall: sideWall,
            fg: fg,
            air_pressure: airPressure,
            temperature_preform: temperaturePreform,
            activity_control: (activities).toString(),
            treated_water_pressure: treatedWaterPressure,
            take_action: takeAction,
            other: other,
            haccp_id: route?.haccp_id,
            activities: [{ action: `has modified ${actionString}` }],
          })
        }

        await (haccpLinesStore
          .addHaccpLines(entity)
          .saveHaccpLine456()
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
          console.log(entity)
        }
        console.log(entity)
      } catch (error) {
        console.log(error);
        // Show error dialog
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'បរាជ័យ',
          textBody: 'សូមបំពេញទិន្នន័យអោយបានត្រឹមត្រូវ',
          button: 'បិទ',
        });
      } finally {
        setLoading(false); // Reset loading state regardless of success or failure
        route?.onReload()
      }
    }

    return (
      <Provider>
        <Portal>
          <KeyboardAvoidingView behavior={"padding"} keyboardVerticalOffset={100} style={$root}>
            {isLoading && (
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
                  Progressing Image ...
                </Text>
              </View>
            )}
            <ScrollView showsVerticalScrollIndicator persistentScrollbar stickyHeaderIndices={[]}>
              <View style={[$outerContainer]}>
                {[2, 3].includes(+route?.line) && (
                  <>
                    <InstructionList
                      showinstruction={showinstruction}
                      handleToggle={onShowInstruction}
                      group_list="1"
                    />

                    <View style={[$containerHorizon, { justifyContent: "space-between" }]}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text title3>Bottle and Cap rinsing</Text>
                        <Text style={{ marginLeft: 15, fontSize: 15, color: 'gray' }}>(oPRP7 & 8 and CCP10 & 11)</Text>
                      </View>

                      {route?.isvalidDate && route?.assign && (
                        <ActivityBar
                          disable
                          direction="end"
                          showInfo
                          onAttachment={onlaunchGallery}
                          onScanCamera={onlaunchCamera}
                          onClickinfo={() => setShowInstruction(true)}
                          onActivity={() => {
                            setDisableSave(true)
                            setShowActivitylog(true)
                          }}
                        />
                      )}
                    </View>

                    <Divider style={{ marginVertical: 30, backgroundColor: "#A49B9B" }} />
                    <View style={{ rowGap: 25 }}>
                      <View style={$containerHorizon}>
                        <View style={$width}>
                          <View style={{ marginRight: 10 }}>
                            <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                              <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                              <Text style={{ marginRight: 5, fontSize: 16 }}>Water Pressure</Text>
                              <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>(&gt; 1.0 bar)</Text>
                              {parseFloat(waterPressure) < 1.0 ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                            </View>
                            <TextInput
                              value={waterPressure}
                              keyboardType="decimal-pad"
                              readOnly={!isEdit}
                              style={[styles.input, { width: '100%' }]}
                              placeholder="Please Enter"
                              onChangeText={(text) => {
                                setWaterPressure(text);
                              }}>
                            </TextInput>
                            {waterPressure == '' ?
                              <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ water pressure</Text>
                              : <></>}
                          </View>
                        </View>
                        <View style={$width}>
                          <View style={{ marginRight: 10 }}>
                            <View style={{ flexDirection: 'row', marginBottom: 15 }}>
                              <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                              <Text style={{ marginRight: 5, fontSize: 16 }}>Nozzles rinser</Text>
                              {(nozzlesRinser) == 0 ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                              <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
                                <Checkbox
                                  disabled={!route?.assign}
                                  status={
                                    nozzlesRinser === null
                                      ? "unchecked"
                                      : nozzlesRinser == 1
                                        ? "checked"
                                        : "unchecked"
                                  }
                                  onPress={() => {
                                    setNozzlesRinser(1)
                                  }}
                                  color="#0081F8"
                                />
                                <Text>Yes </Text>
                              </View>
                              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Checkbox
                                  disabled={!route?.assign}
                                  status={
                                    nozzlesRinser === null
                                      ? "unchecked"
                                      : nozzlesRinser == 0
                                        ? "checked"
                                        : "unchecked"
                                  }
                                  onPress={() => {
                                    setNozzlesRinser(0)
                                  }}
                                  color="#0081F8"
                                />
                                <Text>No </Text>
                              </View>

                            </View>
                            {nozzlesRinser == null ?
                              <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមជ្រើសរើស Nozzles rinser</Text>
                              : <></>}
                          </View>
                        </View>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text title3>Filling and Capping</Text>
                        <Text style={{ marginLeft: 15, fontSize: 15, color: 'gray' }}>(CCP12 & 13)</Text>
                      </View>
                      <Divider style={{ marginVertical: 5, backgroundColor: "#A49B9B" }} />

                      <View style={[$containerHorizon, { gap: 30 }]}>
                        <View style={$width}>
                          <View style={{ marginRight: 10 }}>
                            <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                              <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                              <Text style={{ marginRight: 5, fontSize: 16 }}>FG [ O3 ]</Text>
                              <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>(0.05-0.4 ppm)</Text>
                              {(parseFloat(fg) < 0.05 || parseFloat(fg) > 0.4) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}

                            </View>
                            <TextInput
                              value={fg}
                              keyboardType="decimal-pad"
                              readOnly={!isEdit}
                              style={[styles.input, { width: '100%' }]}
                              placeholder="Please Enter"
                              onChangeText={(text) => setFg(text)}>
                            </TextInput>
                            {fg == '' ?
                              <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ FG</Text>
                              : <></>}
                          </View>
                        </View>
                        <View style={$width}>
                          <View style={{ marginRight: 10 }}>
                            <View style={{ flexDirection: 'row', marginBottom: 15 }}>
                              <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                              <Text style={{ marginRight: 5, fontSize: 16 }}>Smell</Text>
                              {(smell) == 0 ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                              <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
                                <Checkbox
                                  disabled={!route?.assign}
                                  status={
                                    smell === null
                                      ? "unchecked"
                                      : smell == 1
                                        ? "checked"
                                        : "unchecked"
                                  }
                                  onPress={() => {
                                    setSmell(1)
                                  }}
                                  color="#0081F8"
                                />
                                <Text>Yes </Text>
                              </View>
                              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Checkbox
                                  disabled={!route?.assign}
                                  status={
                                    smell === null
                                      ? "unchecked"
                                      : smell == 0
                                        ? "checked"
                                        : "unchecked"
                                  }
                                  onPress={() => {
                                    setSmell(0)
                                  }}
                                  color="#0081F8"
                                />
                                <Text>No </Text>
                              </View>

                            </View>
                            {smell == null ?
                              <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមជ្រើសរើស Smell</Text>
                              : <></>}
                          </View>
                        </View>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text title3>Activity control when exceeding</Text>
                      </View>
                      <Divider style={{ marginVertical: 5, backgroundColor: "#A49B9B" }} />
                      <View style={$containerHorizon}>
                        <View style={$width}>
                          <View style={{ marginRight: 10 }}>
                            <View style={{ flexDirection: 'row', marginBottom: 15 }}>
                              <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                              <Text style={{ marginRight: 5, fontSize: 16 }}>Control</Text>
                              {(activities) == 0 ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                              <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
                                <Checkbox
                                  disabled={!route?.assign}
                                  status={
                                    activities === null
                                      ? "unchecked"
                                      : activities == 1
                                        ? "checked"
                                        : "unchecked"
                                  }
                                  onPress={() => {
                                    setActivities(1)
                                  }}
                                  color="#0081F8"
                                />
                                <Text>Under Control</Text>
                              </View>
                              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Checkbox
                                  disabled={!route?.assign}
                                  status={
                                    activities === null
                                      ? "unchecked"
                                      : activities == 0
                                        ? "checked"
                                        : "unchecked"
                                  }
                                  onPress={() => {
                                    setActivities(0)
                                  }}
                                  color="#0081F8"
                                />
                                <Text>Over Control</Text>
                              </View>

                            </View>
                            {activities == null ?
                              <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមជ្រើសរើស Control</Text>
                              : <></>}
                          </View>
                        </View>
                        <View style={$width}>
                          <View style={{ marginRight: 10 }}>
                            <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                              {takeAction == '' && (nozzlesRinser == 0 || smell == 0) ?
                                <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                : <></>}
                              <Text style={{ marginRight: 5, fontSize: 16 }}>Take action</Text>
                              <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>(Instruction 4)</Text>
                            </View>
                            <TextInput
                              value={takeAction}
                              readOnly={!isEdit}
                              style={[styles.input, { width: '100%' }]}
                              placeholder="Please Enter"
                              onChangeText={(text) => setTakeAction(text)}>
                            </TextInput>
                            {takeAction == '' && (nozzlesRinser == 0 || smell == 0) ?
                              <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Take Action</Text>
                              : <></>}
                          </View>
                        </View>
                      </View>
                      <View style={$width}>
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
                )}

                {[4, 5, 6].includes(+route?.line) && (
                  <>
                    <InstructionList
                      showinstruction={showinstruction}
                      handleToggle={onShowInstruction}
                      group_list="2"
                    />
                    {route?.isvalidDate && route?.assign && (
                      <ActivityBar
                        direction="end"
                        showInfo
                        disable
                        onAttachment={onlaunchGallery}
                        onScanCamera={onlaunchCamera}
                        onClickinfo={() => {
                          setShowActivitylog(true)
                        }}
                        onActivity={() => {
                          setDisableSave(true)
                          setShowActivitylog(true)
                        }}
                      />
                    )}

                    <View style={{ rowGap: 15 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <View style={{ width: '50%', flexDirection: 'row', alignItems: 'center' }}>
                          <Text title3>PET Inspection</Text>
                          <Text style={{ marginLeft: 15, fontSize: 15, color: 'gray' }}>(CCP10)</Text>
                        </View>
                        <View style={{ width: '50%', flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                          <Text title3>Preform interior blower</Text>
                          <Text style={{ marginLeft: 15, fontSize: 15, color: 'gray' }}>(oPRP7)</Text>
                        </View>
                      </View>
                      <Divider style={{ marginVertical: 5, backgroundColor: "#A49B9B" }} />
                      <View style={[$containerHorizon, { gap: 10 }]}>
                        <View style={$width}>
                          <View style={{ marginRight: 10 }}>
                            <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                              <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                              <Text style={{ marginRight: 5, fontSize: 16 }}>Side-wall</Text>
                              <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>(Sensitive 100-110%)</Text>
                              {(parseFloat(sideWall) < 100 || parseFloat(sideWall) > 110) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}

                            </View>
                            <TextInput
                              value={sideWall}
                              keyboardType="decimal-pad"
                              readOnly={!isEdit}
                              style={[styles.input, { width: '100%' }]}
                              placeholder="Please Enter"
                              onChangeText={(text) => setSideWall(text)}>
                            </TextInput>
                            {sideWall == '' ?
                              <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Side-wall</Text>
                              : <></>}
                          </View>
                        </View>
                        <View style={$width}>
                          <View style={{ marginRight: 10 }}>
                            <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                              <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                              <Text style={{ marginRight: 5, fontSize: 16 }}>Air Pressure</Text>
                              <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>(&gt; 1.5 bar)</Text>
                              {(parseFloat(airPressure) < 1.5) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}

                            </View>
                            <TextInput
                              value={airPressure}
                              keyboardType="decimal-pad"
                              readOnly={!isEdit}
                              style={[styles.input, { width: '100%' }]}
                              placeholder="Please Enter"
                              onChangeText={(text) => setAirPressure(text)}>
                            </TextInput>
                            {airPressure == '' ?
                              <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Air Pressure</Text>
                              : <></>}
                          </View>
                        </View>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <View style={{ width: '50%', flexDirection: 'row', alignItems: 'center' }}>
                          <Text title3>Preform heating module</Text>
                          <Text style={{ marginLeft: 15, fontSize: 15, color: 'gray' }}>(oPRP8)</Text>
                        </View>
                        <View style={{ width: '50%', flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                          <Text title3>Bottle Filling and Capping</Text>
                          <Text style={{ marginLeft: 15, fontSize: 15, color: 'gray' }}>(CCP12 & 13)</Text>
                        </View>
                      </View>
                      <Divider style={{ marginVertical: 5, backgroundColor: "#A49B9B" }} />

                      <View style={[$containerHorizon, { gap: 10 }]}>
                        <View style={$width}>
                          <View style={{ marginRight: 10 }}>
                            <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                              <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                              <Text style={{ marginRight: 5, fontSize: 16 }}>Temperature Preform</Text>
                              <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>(87-115 °C)</Text>
                              {(parseFloat(temperaturePreform) < 87 || parseFloat(temperaturePreform) > 115) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}

                            </View>
                            <TextInput
                              value={temperaturePreform}
                              keyboardType="decimal-pad"
                              readOnly={!isEdit}
                              style={[styles.input, { width: '100%' }]}
                              placeholder="Please Enter"
                              onChangeText={(text) => setTemperaturePreform(text)}>
                            </TextInput>
                            {temperaturePreform == '' ?
                              <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Temperature Preform</Text>
                              : <></>}
                          </View>
                        </View>
                        <View style={$width}>
                          <View style={{ marginRight: 10 }}>
                            <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                              <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                              <Text style={{ marginRight: 5, fontSize: 16 }}>FG [O₃]</Text>
                              <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>(0.05-0.4 ppm)</Text>
                              {(parseFloat(fg) < 0.05 || parseFloat(fg) > 0.4) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}

                            </View>
                            <TextInput
                              value={fg}
                              keyboardType="decimal-pad"
                              readOnly={!isEdit}
                              style={[styles.input, { width: '100%' }]}
                              placeholder="Please Enter"
                              onChangeText={(text) => setFg(text)}>
                            </TextInput>
                            {fg == '' ?
                              <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ FG</Text>
                              : <></>}
                          </View>
                        </View>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <Text title3>Cap rinsing</Text>
                        <Text style={{ marginLeft: 15, fontSize: 15, color: 'gray' }}>(CCP11 & oPRP9)</Text>
                      </View>
                      <Divider style={{ marginVertical: 5, backgroundColor: "#A49B9B" }} />

                      <View style={[$containerHorizon, { gap: 10 }]}>
                        <View style={$width}>
                          <View style={{ marginRight: 10 }}>
                            <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                              <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                              <Text style={{ marginRight: 5, fontSize: 16 }}>Treated water pressure/Flow scale</Text>
                              <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>(&gt; 1.5 bar / flow scale&gt;3)</Text>
                              {(parseFloat(treatedWaterPressure) < 1.5) ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}

                            </View>
                            <TextInput
                              value={treatedWaterPressure}
                              keyboardType="decimal-pad"
                              readOnly={!isEdit}
                              style={[styles.input, { width: '100%' }]}
                              placeholder="Please Enter"
                              onChangeText={(text) => setTreatedWaterPressure(text)}>
                            </TextInput>
                            {treatedWaterPressure == '' ?
                              <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Treated water pressure/Flow scale</Text>
                              : <></>}
                          </View>
                        </View>
                      </View>

                      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <Text title3>Activity control when exceeding critical limit</Text>
                      </View>
                      <Divider style={{ marginVertical: 5, backgroundColor: "#A49B9B" }} />

                      <View style={[$containerHorizon, { gap: 10 }]}>
                        <View style={$width}>
                          <View style={{ marginRight: 10 }}>
                            <View style={{ flexDirection: 'row', marginBottom: 15 }}>
                              <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                              <Text style={{ marginRight: 5, fontSize: 16 }}>Control</Text>
                              {(activities) == 0 ? <IconAntDesign name="exclamationcircle" color={'red'} size={18} style={{ marginBottom: 18 }} /> : <></>}
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                              <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
                                <Checkbox
                                  disabled={!route?.assign}
                                  status={
                                    activities === null
                                      ? "unchecked"
                                      : activities == 1
                                        ? "checked"
                                        : "unchecked"
                                  }
                                  onPress={() => {
                                    setActivities(1)
                                  }}
                                  color="#0081F8"
                                />
                                <Text>Under Control</Text>
                              </View>
                              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Checkbox
                                  disabled={!route?.assign}
                                  status={
                                    activities === null
                                      ? "unchecked"
                                      : activities == 0
                                        ? "checked"
                                        : "unchecked"
                                  }
                                  onPress={() => {
                                    setActivities(0)
                                  }}
                                  color="#0081F8"
                                />
                                <Text>Over Control</Text>
                              </View>

                            </View>
                            {activities == null ?
                              <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមជ្រើសរើស Control</Text>
                              : <></>}
                          </View>
                        </View>
                        <View style={$width}>
                          <View style={{ marginRight: 10 }}>
                            <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                              {/* {takeAction == '' && (nozzlesRinser == 0 || smell == 0) ?
                                <Text style={{ marginRight: 5, fontSize: 16, color: 'red' }}>*</Text>
                                : <></>} */}
                              <Text style={{ marginRight: 5, fontSize: 16 }}>Take action</Text>
                              <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>(Instruction 4)</Text>
                            </View>
                            <TextInput
                              value={takeAction}
                              readOnly={!isEdit}
                              style={[styles.input, { width: '100%' }]}
                              placeholder="Please Enter"
                              onChangeText={(text) => setTakeAction(text)}>
                            </TextInput>
                            {/* {takeAction == '' && (nozzlesRinser == 0 || smell == 0) ?
                              <Text style={{ marginRight: 5, fontSize: 12, color: 'red' }}>សូមបំពេញ Take Action</Text>
                              : <></>} */}
                          </View>
                        </View>
                      </View>
                      <View style={$containerHorizon}>
                        <View style={$width}>
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
                    </View>
                  </>
                )}
              </View>
            </ScrollView>

            <ActivityModal
              log={activityLogs}
              isVisible={showActivitylog}
              onClose={() => {
                setDisableSave(false)
                setShowActivitylog(false)
              }}
            />
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

const $outerContainer: ViewStyle = {
  marginHorizontal: 20,
  marginVertical: 15,
  marginBottom: 40,
}
const $width: ViewStyle = {
  flex: 1,
}
const $containerHorizon: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: 25,
}