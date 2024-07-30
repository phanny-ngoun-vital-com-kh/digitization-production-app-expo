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
interface HaccpLineFormScreenProps extends AppStackScreenProps<"HaccpLineForm"> {}
export const HaccpLineFormScreen: FC<HaccpLineFormScreenProps> = observer(
  function HaccpLineFormScreen() {
    const route = useRoute().params
    const { haccpLinesStore, authStore } = useStores()
    const [activityLogs, setActivityLogs] = useState<HaccpActionType[]>([])
    const navigation = useNavigation()
    const [showinstruction, setShowInstruction] = useState(true)
    const [disableSave, setDisableSave] = useState(false)
    const [showActivitylog, setShowActivitylog] = useState(false)
    const [currUser, setCurrUser] = useState("")
    const [isLoading, setLoading] = useState(false)
    const [isScanning, setScanning] = useState(false)
    const [image, setImage] = useState(null)

    const [formLineA, setFormLineA] = useState({
      side_wall: "",
      air_pressure: "",
      tem_preform: "",
      tw_pressure: "",
      FG: "",
      activity_control: null,
      instruction: "",
    })
    const [oldformLineA, setoldFormLineA] = useState({
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
      nozzie_rinser: "",
      FG: "",
      activity_control: null,
      smell: null,
      instruction: "",
      other: "",
    })
    const [oldformLineB, setoldFormLineB] = useState({
      water_pressure: "",
      nozzie_rinser: "",
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
      instruction: false,
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
    const getCurrentUserName = async () => {
      const userinfo = await authStore.getUserInfo()
      const { login } = userinfo.data

      setCurrUser(login)
    }

    const getWarningCount = (type: string) => {
      let count = 0
      if (type === "B") {
        const form = Object.entries(formLineB)

        for (const [key, value] of form) {
          switch (key) {
            case "FG":
              if (+value < 0.05 || +value > 0.4) {
                count += 1
              }

              break
            case "activity_control":
              if (!value) {
                count += 1
              }

              break
            case "nozzie_rinser":
              if (+value !== 32 && +value !== 40) {
                count += 1
              }

              break

            case "water_pressure":
              if (+value < 1) {
                count += 1
              }

              break

            default:
              break
          }
        }
      } else {
        const form = Object.entries(formLineA)

        for (const [key, value] of form) {
          switch (key) {
            case "side_wall":
              if (+value < 100 || +value > 110) {
                count += 1
              }

              break

            case "air_pressure":
              if (+value < 1.5) {
                count += 1
              }

              break

            case "tem_preform":
              if (+value < 100 || +value > 110) {
                count += 1
              }

              break
            case "tw_pressure":
              if (+value < 1.5) {
                count += 1
              }

              break
            case "FG":
              if (+value < 0.05 || +value > 0.4) {
                count += 1
              }

              break
            case "activity_control":
              if (!value) {
                count += 1
              }

              break
            default:
              break
          }
        }
      }

      return count
    }

    const getActions = (type: string) => {
      let actions = ""
      if (route?.haccp_id === null) {
        return ""
      }
      if (type === "B") {
        const form = Object.entries(formLineB)

        for (const [key, value] of form) {
          switch (key) {
            case "FG":
              if (+value !== +oldformLineB.FG)
                actions += ", " + `${key} from ${oldformLineB[key]} to ${formLineB[key]}`

              break
            case "activity_control":
              if (value !== !!oldformLineB.activity_control)
                actions +=
                  ", " +
                  `${key} from ${oldformLineB[key] ? "Under Control" : "Over Control"} to ${
                    formLineB[key] ? "Under Control" : "Over Control"
                  }`

              break
            case "nozzie_rinser":
              if (+value !== +oldformLineB.nozzie_rinser)
                actions += ", " + `${key} from ${oldformLineB[key]} to ${formLineB[key]}`

              break

            case "water_pressure":
              if (+value !== +oldformLineB.water_pressure)
                actions += ", " + `${key} from ${oldformLineB[key]} to ${formLineB[key]}`

              break

            default:
              break
          }
        }
      } else {
        const form = Object.entries(formLineA)

        for (const [key, value] of form) {
          switch (key) {
            case "side_wall":
              if (+value !== +oldformLineA.side_wall)
                actions += ", " + `${key} from ${oldformLineA[key]} to ${formLineA[key]}`

              break

            case "air_pressure":
              if (+value !== +oldformLineA.air_pressure)
                actions += ", " + `${key} from ${oldformLineA[key]} to ${formLineA[key]}`

              break

            case "tem_preform":
              if (+value !== +oldformLineA.tem_preform)
                actions += ", " + `${key} from ${oldformLineA[key]} to ${formLineA[key]}`

              break
            case "tw_pressure":
              if (+value !== +oldformLineA.tw_pressure)
                actions += ", " + `${key} from ${oldformLineA[key]} to ${formLineA[key]}`

              break
            case "FG":
              if (+value !== +oldformLineA.FG)
                actions += ", " + `${key} from ${oldformLineA[key]} to ${formLineA[key]}`

              break
            case "activity_control":
              if (value !== !!oldformLineA.activity_control)
                actions +=
                  ", " +
                  `${key} from ${oldformLineA[key] ? "Under Control" : "Over Control"} to ${
                    formLineA[key] ? "Under Control" : "Over Control"
                  }`

              break
            default:
              break
          }
        }
      }

      return actions
    }

    const validateLineA = async (errorsLineA) => {
      const errorlists = errorsLineA
      delete errorlists.instruction

      const notvalid = Object.values(errorlists).some((err) => err === true)
      const actions = getActions("A")
      const warning_count = getWarningCount("A")
      if (notvalid) {
        return
      }

      try {
        setLoading(true)
        const payload = LinesItemModel.create({
          id: route?.item?.id ?? null,
          line: "Line" + " " + route?.line?.toString(),
          activities: [
            {
              action: route?.item?.id
                ? actions
                  ? "has modified field" + actions?.trim()
                  : "modified the line without change fields"
                : "completed the line shift",
            },
          ],
          activity_control: formLineA.activity_control ? 1 : 0,
          done_by: currUser,
          fg: formLineA.FG,
          haccp_id: route?.haccp_id,
          side_wall: formLineA.side_wall,
          treated_water_pressure: formLineA.tw_pressure,
          temperature_preform: formLineA.tem_preform,
          take_action: formLineA.instruction,
          status: warning_count > 0 ? "warning" : "normal",
          warning_count: warning_count + "",
          air_pressure: formLineA.air_pressure,
        })
        setoldFormLineA({
          activity_control: formLineA?.activity_control ?? null,
          FG: formLineA?.FG ?? "",
          instruction: formLineA?.instruction ?? "",
          air_pressure: formLineA?.air_pressure ?? "",
          side_wall: formLineA?.side_wall ?? "",
          tem_preform: formLineA?.tem_preform ?? "",
          tw_pressure: formLineA?.tw_pressure ?? "",
        })
        await haccpLinesStore.addHaccpLines(payload).saveHaccpLine456()
        getActivities()
      } catch (error) {
        console.log(error)
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "មិនជោគជ័យ",
          textBody: "កំណត់ត្រាមិនត្រូវបានរក្សាទុកទេ។",
          // button: 'close',
          autoClose: 200,
        })
      } finally {
        setLoading(false)
        route?.onRefresh()
      }
    }

    console.log(formLineB)
    const validateLineB = async (errorsLineB) => {
      const errorlists = errorsLineB
      delete errorlists.instruction
      delete errorlists.other
      const actions = getActions("B")
      const warning_count = getWarningCount("B")
      const notvalid = Object.values(errorlists).some((err) => err === true)
      if (notvalid) {
        return
      }

      try {
        setLoading(true)

        const payload = LinesItemModel.create({
          line: "Line" + " " + route?.line?.toString(),
          id: route?.item?.id ?? null,
          activities: [
            {
              action: route?.item?.id
                ? actions
                  ? "has modified field" + actions?.trim()
                  : "modified the line without change fields"
                : "completed the line shift",
            },
          ],
          activity_control: formLineB.activity_control ? 1 : 0,
          done_by: currUser,
          fg: formLineB.FG,
          smell: formLineB?.smell === true ? 1 : 0,
          haccp_id: route?.haccp_id,
          nozzles_rinser: formLineB.nozzie_rinser,
          take_action: formLineB.instruction,
          other: formLineB.other,
          status: warning_count > 0 ? "warning" : "normal",
          warning_count: warning_count + "",
          water_pressure: formLineB.water_pressure,
        })

        await haccpLinesStore.addHaccpLines(payload).saveHaccpLine23()
        getActivities()
        setoldFormLineB({
          activity_control: formLineB?.activity_control ?? null,
          FG: formLineB?.FG ?? "",
          instruction: formLineB?.instruction ?? "",
          nozzie_rinser: formLineB?.nozzie_rinser ?? "",
          other: formLineB?.other ?? "",
          smell: formLineB?.smell ?? null,
          water_pressure: formLineB?.water_pressure ?? "",
        })
        // console.log(payload)
      } catch (error) {
        console.log(error)
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "មិនជោគជ័យ",
          textBody: "កំណត់ត្រាមិនត្រូវបានរក្សាទុកទេ។",
          // button: 'close',
          autoClose: 200,
        })
      } finally {
        setLoading(false)
        route?.onRefresh()
      }

      // navigation.goBack()
    }

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

    const getActivities = async () => {
      try {
        const rs = await haccpLinesStore.getActivitiesLog(route?.haccp_id, route?.item?.id)

        setActivityLogs(rs.sort((a, b) => b.id - a.id))
      } catch (error) {
        // setActivityLogs([])
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "បរាជ័យ",
          textBody: "សូម​ព្យាយាម​ម្តង​ទៀត",
          // button: 'close',
          autoClose: 100,
        })
      }
    }
    useLayoutEffect(() => {
      navigation.setOptions({
        headerShown: true,
        title: "Line - " + route?.line?.toString(),
        headerRight: () =>
          route?.isvalidDate && route?.assign ? (
            <TouchableOpacity
              disabled={disableSave}
              style={{
                flexDirection: "row",
                alignItems: "center",
                display: disableSave ? "none" : "flex",
              }}
              onPress={() => {
                if ([4, 5, 6].includes(+route?.line)) {
                  validateLineA(errorsLineA)
                }
                if ([2, 3].includes(+route?.line)) {
                  validateLineB(errorsLineB)
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
      })
    }, [route, navigation, errorsLineA, errorsLineB, currUser, disableSave])

    useEffect(() => {
      getCurrentUserName()
      if (route?.item?.id) {
        getActivities()
        if ([4, 5, 6].includes(+route?.line)) {
          setFormLineA({
            activity_control: !!route?.item?.activity_control ?? null,
            FG: route?.item?.fg ?? "",
            instruction: route?.item?.take_action ?? "",
            air_pressure: route?.item?.air_pressure ?? "",
            side_wall: route?.item?.side_wall ?? "",
            tem_preform: route?.item?.temperature_preform ?? "",
            tw_pressure: route?.item?.treated_water_pressure ?? "",
          })
          setoldFormLineA({
            activity_control: !!route?.item?.activity_control ?? null,
            FG: route?.item?.fg ?? "",
            instruction: route?.item?.take_action ?? "",
            air_pressure: route?.item?.air_pressure ?? "",
            side_wall: route?.item?.side_wall ?? "",
            tem_preform: route?.item?.temperature_preform ?? "",
            tw_pressure: route?.item?.treated_water_pressure ?? "",
          })
          setErrorsLineA({
            activity_control: false,
            FG: !route?.item?.fg ?? "",
            instruction: !route?.item?.take_action ?? "",
            air_pressure: !route?.item?.air_pressure ?? "",
            side_wall: !route?.item?.side_wall ?? "",
            tem_preform: !route?.item?.temperature_preform ?? "",
            tw_pressure: !route?.item?.treated_water_pressure ?? "",
          })
          // setErrorsLineA()
        }
        if ([2, 3].includes(+route?.line)) {
          setFormLineB({
            activity_control: !!route?.item?.activity_control ?? "",
            FG: route?.item?.fg ?? "",
            instruction: route?.item?.take_action ?? "",
            nozzie_rinser: route?.item?.nozzles_rinser ?? "",
            other: route?.item?.other ?? "",
            smell: route?.item?.smell ?? "",
            water_pressure: route?.item?.water_pressure ?? "",
          })
          setErrorsLineB({
            activity_control: false,
            FG: !route?.item?.fg ?? "",
            instruction: !route?.item?.take_action ?? "",
            nozzie_rinser: !route?.item?.nozzles_rinser ?? "",
            other: !route?.item?.other ?? "",
            smell: !route?.item?.smell ?? "",
            water_pressure: !route?.item?.water_pressure ?? "",
          })
          setoldFormLineB({
            activity_control: !!route?.item?.activity_control ?? "",
            FG: route?.item?.fg ?? "",
            instruction: route?.item?.take_action ?? "",
            nozzie_rinser: route?.item?.nozzles_rinser ?? "",
            other: route?.item?.other ?? "",
            smell: route?.item?.smell ?? "",
            water_pressure: route?.item?.water_pressure ?? "",
          })
        }
      }
    }, [route, navigation])

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
                {[4, 5, 6].includes(+route?.line) && (
                  <>
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

                    <Divider style={{ marginVertical: 30, backgroundColor: "#A49B9B" }} />
                    <View style={{ rowGap: 50 }}>
                      <View style={$containerHorizon}>
                        <View style={$width}>
                          <CustomInput
                            disabled={route?.assign && route?.isvalidDate}
                            keyboardType="decimal-pad"
                            hintLimit="100 - 110%"
                            showIcon={false}
                            value={formLineA.side_wall?.toString() || ""}
                            onBlur={() => {
                              formLineA.side_wall !== ""
                                ? setErrorsLineA((pre) => ({ ...pre, side_wall: false }))
                                : setErrorsLineA((pre) => ({ ...pre, side_wall: true }))
                            }}
                            warning={
                              (formLineA.side_wall && +formLineA?.side_wall < 100) ||
                              +formLineA.side_wall > 110
                            }
                            onChangeText={(text) => {
                              formLineA.side_wall !== ""
                                ? setErrorsLineA((pre) => ({ ...pre, side_wall: false }))
                                : setErrorsLineA((pre) => ({ ...pre, side_wall: true }))

                              setFormLineA((pre) => ({ ...pre, side_wall: text.trim() }))
                            }}
                            label="Side-wall"
                            errormessage={errorsLineA?.side_wall ? "សូមជ្រើសរើស side wall" : ""}
                          />
                        </View>
                        <View style={$width}>
                          <CustomInput
                            disabled={route?.assign && route?.isvalidDate}
                            keyboardType="decimal-pad"
                            hintLimit="> 1.5 Bar"
                            warning={formLineA.air_pressure && +formLineA?.air_pressure < 1.5}
                            value={formLineA.air_pressure?.toString() || ""}
                            showIcon={false}
                            onBlur={() => {
                              formLineA.air_pressure !== ""
                                ? setErrorsLineA((pre) => ({ ...pre, air_pressure: false }))
                                : setErrorsLineA((pre) => ({ ...pre, air_pressure: true }))
                            }}
                            onChangeText={(text) => {
                              formLineA.air_pressure !== ""
                                ? setErrorsLineA((pre) => ({ ...pre, air_pressure: false }))
                                : setErrorsLineA((pre) => ({ ...pre, air_pressure: true }))

                              setFormLineA((pre) => ({ ...pre, air_pressure: text.trim() }))
                            }}
                            label="Air Pressure"
                            errormessage={
                              errorsLineA?.air_pressure ? "សូមជ្រើសរើស Air Pressure" : ""
                            }
                          />
                        </View>
                        <View style={$width}>
                          <CustomInput
                            disabled={route?.assign && route?.isvalidDate}
                            keyboardType="decimal-pad"
                            hintLimit="100 - 110%"
                            warning={
                              (formLineA.tem_preform && +formLineA?.tem_preform < 100) ||
                              +formLineA?.tem_preform > 110
                            }
                            showIcon={false}
                            value={formLineA.tem_preform?.toString() || ""}
                            onBlur={() => {
                              formLineA.tem_preform !== ""
                                ? setErrorsLineA((pre) => ({ ...pre, tem_preform: false }))
                                : setErrorsLineA((pre) => ({ ...pre, tem_preform: true }))
                            }}
                            onChangeText={(text) => {
                              formLineA.tem_preform !== ""
                                ? setErrorsLineA((pre) => ({ ...pre, tem_preform: false }))
                                : setErrorsLineA((pre) => ({ ...pre, tem_preform: true }))

                              setFormLineA((pre) => ({ ...pre, tem_preform: text.trim() }))
                            }}
                            label="Temperature Preform"
                            errormessage={
                              errorsLineA?.tem_preform ? "សូមជ្រើសរើស Temperature Preform" : ""
                            }
                          />
                        </View>
                      </View>
                      <View style={$containerHorizon}>
                        <View style={$width}>
                          <CustomInput
                            disabled={route?.assign && route?.isvalidDate}
                            keyboardType="decimal-pad"
                            value={formLineA.tw_pressure?.toString() || ""}
                            warning={formLineA.tw_pressure && +formLineA?.tw_pressure < 1.5}
                            showIcon={false}
                            onBlur={() => {
                              formLineA.tw_pressure !== ""
                                ? setErrorsLineA((pre) => ({ ...pre, tw_pressure: false }))
                                : setErrorsLineA((pre) => ({ ...pre, tw_pressure: true }))
                            }}
                            onChangeText={(text) => {
                              formLineA.tw_pressure !== ""
                                ? setErrorsLineA((pre) => ({ ...pre, tw_pressure: false }))
                                : setErrorsLineA((pre) => ({ ...pre, tw_pressure: true }))

                              setFormLineA((pre) => ({ ...pre, tw_pressure: text.trim() }))
                            }}
                            hintLimit="> 1.5 bar / flow scale > 3"
                            label="Treated Water Pressure"
                            errormessage={
                              errorsLineA?.tw_pressure ? "សូមជ្រើសរើស Treated Water Pressure" : ""
                            }
                          />
                        </View>
                        <View style={$width}>
                          <CustomInput
                            disabled={route?.assign && route?.isvalidDate}
                            keyboardType="decimal-pad"
                            showIcon={false}
                            warning={
                              (formLineA.FG && +formLineA?.FG < 0.05) || +formLineA?.FG > 0.4
                            }
                            value={formLineA.FG?.toString() || ""}
                            hintLimit="0.05 - 0.4 ppm"
                            onBlur={() => {
                              formLineA.FG !== ""
                                ? setErrorsLineA((pre) => ({ ...pre, FG: false }))
                                : setErrorsLineA((pre) => ({ ...pre, FG: true }))
                            }}
                            onChangeText={(text) => {
                              formLineA.FG !== ""
                                ? setErrorsLineA((pre) => ({ ...pre, FG: false }))
                                : setErrorsLineA((pre) => ({ ...pre, FG: true }))

                              setFormLineA((pre) => ({ ...pre, FG: text.trim() }))
                            }}
                            label="FG [ O₃ ]"
                            errormessage={errorsLineA?.FG ? "សូមជ្រើសរើស FG [ O3 ]" : ""}
                          />
                        </View>
                        <View style={[$width, { marginTop: 1 }]}>
                          <View style={{ paddingBottom: 38 }}>
                            <Text style={{ margin: 0, fontSize: 15 }} semibold>
                              <Text errorColor style={{ fontSize: 20 }}>
                                *
                              </Text>
                              Activity Control     <View style={$containerHorizon}>
                            {formLineA?.activity_control != null && !formLineA?.activity_control ? (
                              <Badge size={22} style={{ backgroundColor: "#D32600",marginLeft:10,marginBottom:5 }}>
                                !
                              </Badge>
                            ) : null}
                          </View>
                          
                            </Text>
                        
                          </View>
                   

                          <View style={[$containerHorizon]}>
                            <View>
                              <View style={[$containerHorizon, { marginTop: 0, gap: 0 }]}>
                                <View
                                  style={[$containerHorizon, { marginTop: 10, margin: 0, gap: 0 }]}
                                >
                                  <TouchableOpacity
                                    disabled={!(route?.assign && route?.isvalidDate)}
                                    style={$containerHorizon}
                                    onPress={() => {
                                      setErrorsLineA((pre) => ({ ...pre, activity_control: false }))
                                      setFormLineA((pre) => ({
                                        ...pre,
                                        activity_control: true,
                                      }))
                                    }}
                                  >
                                    <Checkbox
                                      disabled={!(route?.assign && route?.isvalidDate)}
                                      status={
                                        formLineA?.activity_control === null
                                          ? "unchecked"
                                          : formLineA?.activity_control
                                          ? "checked"
                                          : "unchecked"
                                      }
                                      onPress={() => {
                                        setErrorsLineA((pre) => ({
                                          ...pre,
                                          activity_control: false,
                                        }))
                                        setFormLineA((pre) => ({
                                          ...pre,
                                          activity_control: true,
                                        }))
                                      }}
                                      color="#0081F8"
                                    />
                                    <Text>Under Control </Text>
                                  </TouchableOpacity>
                                </View>
                                <View
                                  style={[$containerHorizon, { marginTop: 10, margin: 0, gap: 0 }]}
                                >
                                  <TouchableOpacity
                                    disabled={!(route?.assign && route?.isvalidDate)}
                                    style={$containerHorizon}
                                    onPress={() => {
                                      setErrorsLineA((pre) => ({ ...pre, activity_control: false }))
                                      setFormLineA((pre) => ({
                                        ...pre,
                                        activity_control: false,
                                      }))
                                    }}
                                  >
                                    <Checkbox
                                      disabled={!(route?.assign && route?.isvalidDate)}
                                      status={
                                        formLineA?.activity_control === null
                                          ? "unchecked"
                                          : !formLineA?.activity_control
                                          ? "checked"
                                          : "unchecked"
                                      }
                                      onPress={() => {
                                        setErrorsLineA((pre) => ({
                                          ...pre,
                                          activity_control: false,
                                        }))
                                        setFormLineA((pre) => ({
                                          ...pre,
                                          activity_control: false,
                                        }))
                                      }}
                                      color="#0081F8"
                                    />
                                    <Text>Over Control </Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </View>
                          </View>
                          <Text errorColor caption1 style={{ marginTop: 10 }}>
                            {errorsLineA?.activity_control && errorsLineA?.activity_control
                              ? "*សូម​ត្រួតពិនិត្យ"
                              : ""}
                          </Text>
                        </View>
                      </View>

                      <View style={$containerHorizon}>
                        <View style={$width}>
                          <CustomInput
                            disabled={route?.assign && route?.isvalidDate}
                            value={formLineA?.instruction}
                            onBlur={() => {
                              formLineA.instruction !== ""
                                ? setErrorsLineA((pre) => ({ ...pre, instruction: false }))
                                : setErrorsLineA((pre) => ({ ...pre, instruction: true }))
                            }}
                            onChangeText={(text) => {
                              formLineA.instruction !== ""
                                ? setErrorsLineA((pre) => ({ ...pre, instruction: false }))
                                : setErrorsLineA((pre) => ({ ...pre, instruction: true }))

                              setFormLineA((pre) => ({ ...pre, instruction: text.trim() }))
                            }}
                            showIcon={false}
                            showAsterick={false}
                            label="Instruction "
                            errormessage={""}
                          />
                        </View>
                      </View>
                    </View>
                  </>
                )}

                {[2, 3].includes(+route?.line) && (
                  <>
                    <InstructionList
                      showinstruction={showinstruction}
                      handleToggle={onShowInstruction}
                    />

                    <View style={[$containerHorizon, { justifyContent: "space-between" }]}>
                      <Text title3>Bottle and Cap rinsing</Text>

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
                          <CustomInput
                            disabled={route?.assign && route?.isvalidDate}
                            showIcon={false}
                            keyboardType="decimal-pad"
                            warning={formLineB.water_pressure && +formLineB?.water_pressure < 1}
                            value={formLineB.water_pressure?.toString() || ""}
                            onBlur={() => {
                              formLineB.water_pressure !== ""
                                ? setErrorsLineB((pre) => ({ ...pre, water_pressure: false }))
                                : setErrorsLineB((pre) => ({ ...pre, water_pressure: true }))
                            }}
                            onChangeText={(text) => {
                              formLineB.water_pressure !== ""
                                ? setErrorsLineB((pre) => ({ ...pre, water_pressure: false }))
                                : setErrorsLineB((pre) => ({ ...pre, water_pressure: true }))

                              setFormLineB((pre) => ({ ...pre, water_pressure: text.trim() }))
                            }}
                            label="Water Pressure"
                            hintLimit="> 1.0 bar"
                            errormessage={
                              errorsLineB?.water_pressure ? "សូមជ្រើសរើស water pressure" : ""
                            }
                          />
                        </View>
                        <View style={$width}>
                          <CustomInput
                            disabled={route?.assign && route?.isvalidDate}
                            showIcon={false}
                            warning={
                              formLineB.nozzie_rinser &&
                              +formLineB?.nozzie_rinser !== 32 &&
                              +formLineB?.nozzie_rinser !== 40
                            }
                            keyboardType="decimal-pad"
                            value={formLineB.nozzie_rinser?.toString() || ""}
                            onBlur={() => {
                              formLineB.nozzie_rinser !== ""
                                ? setErrorsLineB((pre) => ({ ...pre, nozzie_rinser: false }))
                                : setErrorsLineB((pre) => ({ ...pre, nozzie_rinser: true }))
                            }}
                            onChangeText={(text) => {
                              formLineB.nozzie_rinser !== ""
                                ? setErrorsLineB((pre) => ({ ...pre, nozzie_rinser: false }))
                                : setErrorsLineB((pre) => ({ ...pre, nozzie_rinser: true }))

                              setFormLineB((pre) => ({ ...pre, nozzie_rinser: text.trim() }))
                            }}
                            hintLimit="No one clog of 32/40"
                            label="Nozzies rinser"
                            errormessage={
                              errorsLineB?.nozzie_rinser ? "សូមជ្រើសរើស Nozzies Rinser" : ""
                            }
                          />
                        </View>
                      </View>

                      <Text title3>Filling and Capping</Text>
                      <Divider style={{ marginVertical: 5, backgroundColor: "#A49B9B" }} />

                      <View style={[$containerHorizon, { gap: 30 }]}>
                        <View style={$width}>
                          <CustomInput
                            disabled={route?.assign && route?.isvalidDate}
                            hintLimit="0.05 - 0.4 ppm"
                            showIcon={false}
                            warning={
                              (formLineB.FG && +formLineB?.FG < 0.05) || +formLineB?.FG > 0.4
                            }
                            keyboardType="decimal-pad"
                            value={formLineB.FG?.toString() || ""}
                            onBlur={() => {
                              formLineB.FG !== ""
                                ? setErrorsLineB((pre) => ({ ...pre, FG: false }))
                                : setErrorsLineB((pre) => ({ ...pre, FG: true }))
                            }}
                            onChangeText={(text) => {
                              formLineB.FG !== ""
                                ? setErrorsLineB((pre) => ({ ...pre, FG: false }))
                                : setErrorsLineB((pre) => ({ ...pre, FG: true }))

                              setFormLineB((pre) => ({ ...pre, FG: text.trim() }))
                            }}
                            label="FG [ O3 ] "
                            errormessage={errorsLineB?.FG ? "សូមជ្រើសរើស FG" : ""}
                          />
                        </View>
                        <View style={$width}>
                          <Text style={{ marginTop: -10 }} semibold body2>
                            <Text errorColor>*</Text> Smell
                          </Text>
                          <View style={[$containerHorizon, { marginTop: 10, gap: 0 }]}>
                            <View style={[$containerHorizon, { marginTop: 10, margin: 0, gap: 0 }]}>
                              <TouchableOpacity
                                disabled={!route?.assign}
                                style={$containerHorizon}
                                onPress={() => {
                                  setErrorsLineB((pre) => ({ ...pre, smell: false }))
                                  setFormLineB((pre) => ({
                                    ...pre,
                                    smell: true,
                                  }))
                                }}
                              >
                                <Checkbox
                                  disabled={!route?.assign}
                                  status={
                                    formLineB?.smell === null
                                      ? "unchecked"
                                      : formLineB?.smell
                                      ? "checked"
                                      : "unchecked"
                                  }
                                  onPress={() => {
                                    setErrorsLineB((pre) => ({ ...pre, smell: false }))
                                    setFormLineB((pre) => ({
                                      ...pre,
                                      smell: true,
                                    }))
                                  }}
                                  color="#0081F8"
                                />
                                <Text>Yes </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                disabled={!route?.assign}
                                style={$containerHorizon}
                                onPress={() => {
                                  setFormLineB((pre) => ({
                                    ...pre,
                                    smell: false,
                                  }))
                                }}
                              >
                                <Checkbox
                                  disabled={!route?.assign}
                                  status={
                                    formLineB?.smell === null
                                      ? "unchecked"
                                      : !formLineB?.smell
                                      ? "checked"
                                      : "unchecked"
                                  }
                                  onPress={() => {
                                    setErrorsLineB((pre) => ({ ...pre, smell: false }))
                                    setFormLineB((pre) => ({
                                      ...pre,
                                      smell: false,
                                    }))
                                  }}
                                  color="#0081F8"
                                />
                                <Text>No</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                          <Text errorColor caption1 style={{ marginTop: 10 }}>
                            {formLineB.smell=== null && "*សូម​ត្រួតពិនិត្យ"}
                          </Text>
                        </View>
                        <View style={$width}>
                          <View style={[{ marginBottom: 5 }]}>
                            <View style={[$containerHorizon, { marginBottom: 20 }]}>
                              <View style={{ paddingBottom: 0 }}>
                                <Text style={{ margin: 0, fontSize: 15 }} semibold>
                                  <Text errorColor style={{ fontSize: 20 }}>
                                    *
                                  </Text>
                                  Activity Control
                                </Text>
                              </View>
                              {formLineB?.activity_control != null &&
                              !formLineB?.activity_control ? (
                                <Badge size={22} style={{ backgroundColor: "#D32600" }}>
                                  !
                                </Badge>
                              ) : null}
                            </View>

                            <View style={$containerHorizon}>
                              <View style={[$containerHorizon, { paddingBottom: 20, gap: 0 }]}>
                                <View
                                  style={[$containerHorizon, { marginTop: 0, margin: 0, gap: 0 }]}
                                >
                                  <TouchableOpacity
                                    disabled={!(route?.assign && route?.isvalidDate)}
                                    style={$containerHorizon}
                                    onPress={() => {
                                      setErrorsLineB((pre) => ({ ...pre, activity_control: false }))
                                      setFormLineB((pre) => ({
                                        ...pre,
                                        activity_control: true,
                                      }))
                                    }}
                                  >
                                    <Checkbox
                                      disabled={!(route?.assign && route?.isvalidDate)}
                                      status={
                                        formLineB?.activity_control === null
                                          ? "unchecked"
                                          : formLineB?.activity_control
                                          ? "checked"
                                          : "unchecked"
                                      }
                                      onPress={() => {
                                        setErrorsLineB((pre) => ({
                                          ...pre,
                                          activity_control: false,
                                        }))
                                        setFormLineB((pre) => ({
                                          ...pre,
                                          activity_control: true,
                                        }))
                                      }}
                                      color="#0081F8"
                                    />
                                    <Text>Under Control </Text>
                                  </TouchableOpacity>
                                  
                                </View>
                                
                                <View
                                  style={[$containerHorizon, { marginTop: 0, margin: 0, gap: 0 }]}
                                >
                                  <TouchableOpacity
                                    disabled={!(route?.assign && route?.isvalidDate)}
                                    style={$containerHorizon}
                                    onPress={() => {
                                      setErrorsLineB((pre) => ({ ...pre, activity_control: false }))
                                      setFormLineB((pre) => ({
                                        ...pre,
                                        activity_control: false,
                                      }))
                                    }}
                                  >
                                    <Checkbox
                                      disabled={!(route?.assign && route?.isvalidDate)}
                                      status={
                                        formLineB?.activity_control === null
                                          ? "unchecked"
                                          : !formLineB?.activity_control
                                          ? "checked"
                                          : "unchecked"
                                      }
                                      onPress={() => {
                                        setErrorsLineB((pre) => ({
                                          ...pre,
                                          activity_control: false,
                                        }))
                                        setFormLineB((pre) => ({
                                          ...pre,
                                          activity_control: false,
                                        }))
                                      }}
                                      color="#0081F8"
                                    />
                                    <Text>Over Control </Text>
                                  </TouchableOpacity>
                                </View>
                                
                                {/* <Text errorColor caption1 style={{ marginTop: 0 }}>
                                  {errorsLineB?.activity_control && errorsLineB?.activity_control
                                    ? "*សូម​ត្រួតពិនិត្យ"
                                    : ""}
                                </Text> */}
                              </View>
                      
                            </View>
                            <Text errorColor caption1 style={{ marginTop: 0 }}>
                                {errorsLineB?.activity_control && errorsLineB?.activity_control
                                  ? "*សូម​ត្រួតពិនិត្យ"
                                  : ""}
                              </Text>
                          </View>
                        </View>

                        {/* <View style={[$width, { marginBottom: 0 }]}>
                          <View style={[$containerHorizon, { marginBottom: 80 }]}>
                            <View style={{ paddingBottom: 0 }}>
                              <Text style={{ margin: 0, fontSize: 15 }} semibold>
                                <Text errorColor style={{ fontSize: 20 }}>
                                  *
                                </Text>
                                Activity Control
                              </Text>
                            </View>
                            {formLineB?.activity_control != null && !formLineB?.activity_control ? (
                              <Badge size={22} style={{ backgroundColor: "#D32600" }}>
                                !
                              </Badge>
                            ) : null}
                          </View>

                          <View style={$containerHorizon}>
                            <View style={[$containerHorizon, { paddingBottom: 20, gap: 0 }]}>
                              <View
                                style={[$containerHorizon, { marginTop: 0, margin: 0, gap: 0 }]}
                              >
                                <TouchableOpacity
                                  disabled={!(route?.assign && route?.isvalidDate)}
                                  style={$containerHorizon}
                                  onPress={() => {
                                    setErrorsLineB((pre) => ({ ...pre, activity_control: false }))
                                    setFormLineB((pre) => ({
                                      ...pre,
                                      activity_control: true,
                                    }))
                                  }}
                                >
                                  <Checkbox
                                    disabled={!(route?.assign && route?.isvalidDate)}
                                    status={
                                      formLineB?.activity_control === null
                                        ? "unchecked"
                                        : formLineB?.activity_control
                                          ? "checked"
                                          : "unchecked"
                                    }
                                    onPress={() => {
                                      setErrorsLineB((pre) => ({
                                        ...pre,
                                        activity_control: false,
                                      }))
                                      setFormLineB((pre) => ({
                                        ...pre,
                                        activity_control: true,
                                      }))
                                    }}
                                    color="#0081F8"
                                  />
                                  <Text>Under Control </Text>
                                </TouchableOpacity>
                              </View>
                              <View
                                style={[$containerHorizon, { marginTop: 0, margin: 0, gap: 0 }]}
                              >
                                <TouchableOpacity
                                  disabled={!(route?.assign && route?.isvalidDate)}
                                  style={$containerHorizon}
                                  onPress={() => {
                                    setErrorsLineB((pre) => ({ ...pre, activity_control: false }))
                                    setFormLineB((pre) => ({
                                      ...pre,
                                      activity_control: false,
                                    }))
                                  }}
                                >
                                  <Checkbox
                                    disabled={!(route?.assign && route?.isvalidDate)}
                                    status={
                                      formLineB?.activity_control === null
                                        ? "unchecked"
                                        : !formLineB?.activity_control
                                          ? "checked"
                                          : "unchecked"
                                    }
                                    onPress={() => {
                                      setErrorsLineB((pre) => ({
                                        ...pre,
                                        activity_control: false,
                                      }))
                                      setFormLineB((pre) => ({
                                        ...pre,
                                        activity_control: false,
                                      }))
                                    }}
                                    color="#0081F8"
                                  />
                                  <Text>Over Control </Text>
                                </TouchableOpacity>
                              </View>
                              <Text errorColor caption1 style={{ marginTop: 0 }}>
                                {errorsLineB?.activity_control && errorsLineB?.activity_control
                                  ? "*សូម​ត្រួតពិនិត្យ"
                                  : ""}
                              </Text>
                            </View>

                          </View>

                        </View> */}
                      </View>

                      <View style={$containerHorizon}>
                        <View style={$width}>
                          <CustomInput
                            disabled={route?.assign && route?.isvalidDate}
                            showIcon={false}
                            onBlur={() => {
                              formLineB.instruction !== ""
                                ? setErrorsLineB((pre) => ({ ...pre, instruction: false }))
                                : setErrorsLineB((pre) => ({ ...pre, instruction: true }))
                            }}
                            onChangeText={(text) => {
                              formLineB.instruction !== ""
                                ? setErrorsLineB((pre) => ({ ...pre, instruction: false }))
                                : setErrorsLineB((pre) => ({ ...pre, instruction: true }))

                              setFormLineB((pre) => ({ ...pre, instruction: text.trim() }))
                            }}
                            label="Take Action  "
                            value={formLineB.instruction}
                            showAsterick={false}
                            errormessage={""}
                          />
                        </View>
                        <View style={$width}>
                          <CustomInput
                            disabled={route?.assign && route?.isvalidDate}
                            value={formLineB.other}
                            showIcon={false}
                            showAsterick={false}
                            onBlur={() => {
                              formLineB.other !== ""
                                ? setErrorsLineB((pre) => ({ ...pre, other: false }))
                                : setErrorsLineB((pre) => ({ ...pre, other: true }))
                            }}
                            onChangeText={(text) => {
                              formLineB.other !== ""
                                ? setErrorsLineB((pre) => ({ ...pre, other: false }))
                                : setErrorsLineB((pre) => ({ ...pre, other: true }))

                              setFormLineB((pre) => ({ ...pre, other: text.trim() }))
                            }}
                            label="Other "
                            errormessage={""}
                          />
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
