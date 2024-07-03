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

interface PreWaterForm2ScreenProps extends AppStackScreenProps<"PreWaterForm2"> {}

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
    const [form, setForm] = useState({
      sf1: "",
      sf2: "",
      acf1: "",
      acf2: "",
      tenMm1: "",
      tenMm2: "",
      raw_water: "",
      remarks: "",
      buffer: "",
    })

    const [isEditable, setEditable] = useState(false)
    const [errors, setErrors] = useState({
      sf1: true,
      sf2: true,
      acf1: true,
      acf2: true,
      tenMm1: true,
      tenMm2: true,
      remarks: true,
      raw_water: true,
      buffer: true,
    })

    const getWarningcount = () => {
      const restrictSf1 = +form.sf1 < 0.2 || +form.sf1 > 0.5

      const restrictSf2 = +form.sf2 < 0.2 || +form.sf2 > 0.5

      const restrictAf1 = +form.acf1 < 0.2 || +form.acf1 > 0.5

      const restrictAf2 = +form.acf2 < 0.2 || +form.acf2 > 0.5

      const restricttenMm1 = +form?.tenMm1 > 2.5 || +form?.tenMm1 < 1

      const restrictenMm2 = +form?.tenMm2 > 2.5 || +form?.tenMm2 < 1

      const restrictRawater = +form?.raw_water > 8.5 || +form?.raw_water < 6.5
      const restrictBuffer = +form?.buffer > 8.5 || +form?.buffer < 6.5

      let warningcount = 0
      if (route?.type?.toLowerCase()?.startsWith("pressure")) {
        if (restrictSf1 || restrictSf2 || restrictAf1 || restrictAf2) {
          warningcount += +restrictSf1 + +restrictSf2 + +restrictAf1 + +restrictAf2
        }

        if (restricttenMm1 || restrictenMm2) {
          warningcount += +restricttenMm1 + +restrictenMm2
        }
      } else {
        if (restrictSf1 || restrictSf2 || restrictAf1 || restrictAf2) {
          warningcount += +restrictSf1 + +restrictSf2 + +restrictAf1 + +restrictAf2
        }

        if (restrictRawater || restrictBuffer) {
          warningcount += +restrictRawater + +restrictBuffer
        }
      }

      return warningcount
    }

    const handleSubmitting = async () => {
      try {
        const payload = PreTreatmentListItemModel.create({
          id: route?.item?.id,
          control: route?.type,
          pre_treatment_id: route?.item?.pre_treatment_id ?? "",
          pre_treatment_type: route?.item?.pre_treatment_type ?? "",
          action:
            route.item?.status === "pending" ? " has created the form" : " has modified the form",
          sf1: form.sf1,
          sf2: form.sf2,
          acf1: form.acf2,

          acf2: form.acf2,
          um101: form.tenMm1,

          um102: form.tenMm2,
          raw_water: form.raw_water,
          buffer_st002: form.buffer,
          status: getWarningcount() > 0 ? "warning" : "normal",
          warning_count: getWarningcount(),
          remark: form.remarks,
        })
        setLoading(true)

        await preWaterTreatmentStore.addPretreatments(payload).savePreWtp4()
        fetchUserActivity()
        route?.onBack()

        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: "ជោគជ័យ",
          textBody: "រក្សាទុកបានជោគជ័យ",
          button: "close",
          autoClose: 500,
        })
      } catch (error) {
        console.log(error.message)
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "បរាជ័យ",
          textBody: "បញ្ហាបច្ចេកទេសនៅលើ server",
          button: "បិទ",
          autoClose: 500,
        })
      } finally {
        setLoading(false)
      }
    }

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
          tenMm1: mM101 ?? "",
          tenMm2: mM102 ?? "",
          sf1: sf1 ?? "",
          sf2: sf2 ?? "",
        })
        setErrors({
          acf1: !!acf1,
          acf2: !!acf2,
          tenMm1: !!mM101,
          tenMm2: !!mM102,
          sf1: !!sf1,
          sf2: !!sf2,
        })
      }

      if (route?.type?.toLowerCase().startsWith("tds")) {
        // const [sf1, sf2, acf1, acf2, mM101, mM102,raw_water,buffer] = numeric

        const num = numeric.filter((item) => Number(item) > 2)
        const [sf1, acf1, sf2, acf2, mM101, mM102, raw_water, buffer] = num
        setForm({
          raw_water: raw_water,
          sf1: sf1,
          sf2: sf2,
          acf1: acf1,
          acf2: acf2,
          tenMm1: mM101,
          tenMm2: mM102,
          buffer: buffer,
        })
        setErrors({
          raw_water: !!raw_water,
          sf1: !!sf1,
          sf2: !!sf2,
          acf1: !!acf1,
          acf2: !!acf2,
          tenMm1: !!mM101,
          tenMm2: !!mM102,
          buffer: !!buffer,
        })
      }
      if (route?.type?.toLowerCase().startsWith("ph")) {
        const num = numeric.filter((item) => Number(item) > 2)
        const [sf1, sf2, acf1, acf2, mM101, mM102, raw_water, buffer] = num
        setForm({
          raw_water: raw_water,
          sf1: sf1,
          sf2: sf2,
          acf1: acf1,
          acf2: acf2,
          tenMm1: mM101,
          tenMm2: mM102,
          buffer: buffer,
        })
        setErrors({
          raw_water: !!raw_water,
          sf1: !!sf1,
          sf2: !!sf2,
          acf1: !!acf1,
          acf2: !!acf2,
          tenMm1: !!mM101,
          tenMm2: !!mM102,
          buffer: !!buffer,
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
    const getCurrentUserName = async () => {
      const userinfo = await authStore.getUserInfo()
      const { login } = userinfo.data
      return login
    }
    const checkUserRole = async () => {
      // console.log("machine user assign to", route?.items?.assign_to_user)
      setEditable(route?.isvalidDate && route?.item?.assign_to_user && route?.isValidShift)
    }
    useLayoutEffect(() => {
      navigation.setOptions({
        headerShown: true,
        title: route?.type,

        headerRight: () =>
          route?.isvalidDate && route?.item?.assign_to_user ? (
            <TouchableOpacity
              style={$horizon}
              disabled={isScanning}
              onPress={() => {
                if (route?.type?.toLowerCase()?.startsWith("pressure")) {
                  let errorslist = errors
                  delete errorslist.raw_water
                  delete errorslist.buffer
                  delete errorslist.remarks

                  const isvalid = Object.values(errorslist).every((error) => error === false)
                  if (!isvalid) {
                    return
                  }
                } else {
                  let errorslist = errors
                  delete errorslist.remarks

                  const isvalid = Object.values(errorslist).every((error) => error === false)
                  if (!isvalid) {
                    return
                  }
                }

                // navigation.goBack()

                handleSubmitting()
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
    }, [navigation, route, errors, form, isEditable, isScanning])

    useEffect(() => {
      checkUserRole()
      setForm({
        sf1: route?.item?.sf1,
        sf2: route?.item?.sf2,
        acf1: route?.item?.acf1,
        acf2: route?.item?.acf2,
        tenMm1: route?.item?.um101,
        tenMm2: route?.item?.um102,
        raw_water: route?.item?.raw_water,
        remarks: route?.item?.remark,
        buffer: route?.item?.buffer_st002,
      })
      fetchUserActivity()
      setErrors({
        sf1: !route?.item?.sf1,
        sf2: !route?.item?.sf2,
        acf1: !route?.item?.acf1,
        acf2: !route?.item?.acf2,
        tenMm1: !route?.item?.um101,
        tenMm2: !route?.item?.um102,
        raw_water: !route?.item?.raw_water,
        remarks: !route?.item?.remark,
        buffer: !route?.item?.buffer_st002,
      })
    }, [route])
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
              Saving record ...
            </Text>
          </View>
        )}
        <ScrollView>
          <View style={$outerContainer}>
            <View style={[$horizon, { justifyContent: "space-between" }]}>
              {route?.type?.toLowerCase().includes("pressure") ? (
                <>
                  <Text></Text>
                </>
              ) : route?.type?.toLowerCase().includes("ph") ? (
                <Text errorColor semibold body1>
                  {`${translate("wtpcommon.level")} PH 6.5 - 8.5`}
                </Text>
              ) : (
                <Text errorColor semibold body1>
                  {`${translate("wtpcommon.level")} TDS < 300 mg/l`}
                </Text>
              )}
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

            <View style={$horizon}>
              <View style={$width}>
                <CustomInput
                  disabled={isEditable}
                  keyboardType="decimal-pad"
                  showIcon={false}
                  warning={(form.sf1 && +form.sf1 < 0.2) || +form.sf1 > 0.5}
                  value={form.sf1?.toString() || ""}
                  onBlur={() => {
                    form.sf1 !== ""
                      ? setErrors((pre) => ({ ...pre, sf1: false }))
                      : setErrors((pre) => ({ ...pre, sf1: true }))
                  }}
                  onChangeText={(text) => {
                    form.sf1 !== ""
                      ? setErrors((pre) => ({ ...pre, sf1: false }))
                      : setErrors((pre) => ({ ...pre, sf1: true }))

                    setForm((pre) => ({ ...pre, sf1: text.trim() }))
                  }}
                  label="SF 1"
                  hintLimit={route?.type?.toLowerCase()?.startsWith("pressure ") && "0.2 - 0.5 bar"}
                  errormessage={errors?.sf1 ? "សូមជ្រើសរើស SF1" : ""}
                />
              </View>
              <View style={$width}>
                <CustomInput
                  disabled={isEditable}
                  keyboardType="decimal-pad"
                  showIcon={false}
                  warning={(form.sf2 && +form.sf2 < 0.2) || +form.sf2 > 0.5}
                  value={form.sf2?.toString() || ""}
                  onBlur={() => {
                    form.sf2 !== ""
                      ? setErrors((pre) => ({ ...pre, sf2: false }))
                      : setErrors((pre) => ({ ...pre, sf2: true }))
                  }}
                  onChangeText={(text) => {
                    form.sf2 !== ""
                      ? setErrors((pre) => ({ ...pre, sf2: false }))
                      : setErrors((pre) => ({ ...pre, sf2: true }))

                    setForm((pre) => ({ ...pre, sf2: text.trim() }))
                  }}
                  label="SF 2"
                  hintLimit={route?.type?.toLowerCase()?.startsWith("pressure ") && "0.2 - 0.5 bar"}
                  errormessage={errors?.sf2 ? "សូមជ្រើសរើស SF2" : ""}
                />
              </View>
            </View>
            <View style={$horizon}>
              <View style={$width}>
                <CustomInput
                  disabled={isEditable}
                  warning={(form.acf1 && +form.acf1 < 0.2) || +form.acf1 > 0.5}
                  value={form.acf1?.toString() || ""}
                  keyboardType="decimal-pad"
                  showIcon={false}
                  onBlur={() => {
                    form.acf1 !== ""
                      ? setErrors((pre) => ({ ...pre, acf1: false }))
                      : setErrors((pre) => ({ ...pre, acf1: true }))
                  }}
                  onChangeText={(text) => {
                    form.acf1 !== ""
                      ? setErrors((pre) => ({ ...pre, acf1: false }))
                      : setErrors((pre) => ({ ...pre, acf1: true }))

                    setForm((pre) => ({ ...pre, acf1: text.trim() }))
                  }}
                  label="ACF 1"
                  hintLimit={route?.type?.toLowerCase()?.startsWith("pressure ") && "0.2 - 0.5 bar"}
                  errormessage={errors?.acf1 ? "សូមជ្រើសរើស ACF1" : ""}
                />
              </View>
              <View style={$width}>
                <CustomInput
                  disabled={isEditable}
                  warning={(form.acf2 && +form.acf2 < 0.2) || +form.acf2 > 0.5}
                  value={form.acf2?.toString() || ""}
                  keyboardType="decimal-pad"
                  showIcon={false}
                  onBlur={() => {
                    form.acf2 !== ""
                      ? setErrors((pre) => ({ ...pre, acf2: false }))
                      : setErrors((pre) => ({ ...pre, acf2: true }))
                  }}
                  onChangeText={(text) => {
                    form.acf2 !== ""
                      ? setErrors((pre) => ({ ...pre, acf2: false }))
                      : setErrors((pre) => ({ ...pre, acf2: true }))

                    setForm((pre) => ({ ...pre, acf2: text.trim() }))
                  }}
                  label="ACF 2"
                  hintLimit={route?.type?.toLowerCase()?.startsWith("pressure ") && "0.2 - 0.5 bar"}
                  errormessage={errors?.acf2 ? "សូមជ្រើសរើស ACF2" : ""}
                />
              </View>
            </View>
            <View style={$horizon}>
              <View style={$width}>
                <CustomInput
                  disabled={isEditable}
                  warning={(form?.tenMm1 && +form.tenMm1 < 1) || +form?.tenMm1 > 2.5}
                  value={form.tenMm1?.toString() || ""}
                  keyboardType="decimal-pad"
                  showIcon={false}
                  onBlur={() => {
                    form.tenMm1 !== ""
                      ? setErrors((pre) => ({ ...pre, acf1: false }))
                      : setErrors((pre) => ({ ...pre, acf1: true }))
                  }}
                  onChangeText={(text) => {
                    form.tenMm1 !== ""
                      ? setErrors((pre) => ({ ...pre, tenMm1: false }))
                      : setErrors((pre) => ({ ...pre, tenMm1: true }))

                    setForm((pre) => ({ ...pre, tenMm1: text.trim() }))
                  }}
                  label="10Mm 1"
                  hintLimit={route?.type?.toLowerCase()?.startsWith("pressure ") && "1 < 2.5 bar"}
                  errormessage={errors?.tenMm1 ? "សូមជ្រើសរើស 10Mm1" : ""}
                />
              </View>
              <View style={$width}>
                <CustomInput
                  disabled={isEditable}
                  value={form.tenMm2?.toString() || ""}
                  warning={(form?.tenMm2 && +form.tenMm2 < 1) || +form?.tenMm2 > 2.5}
                  keyboardType="decimal-pad"
                  showIcon={false}
                  onBlur={() => {
                    form.tenMm2 !== ""
                      ? setErrors((pre) => ({ ...pre, tenMm2: false }))
                      : setErrors((pre) => ({ ...pre, tenMm2: true }))
                  }}
                  onChangeText={(text) => {
                    form.tenMm2 !== ""
                      ? setErrors((pre) => ({ ...pre, tenMm2: false }))
                      : setErrors((pre) => ({ ...pre, tenMm2: true }))

                    setForm((pre) => ({ ...pre, tenMm2: text.trim() }))
                  }}
                  label="10Mm 2"
                  hintLimit={route?.type?.toLowerCase()?.startsWith("pressure ") && "1 < 2.5 bar"}
                  errormessage={errors?.tenMm2 ? "សូមជ្រើសរើស 10Mm2" : ""}
                />
              </View>
            </View>

            {!route?.type?.toLowerCase().startsWith("pressure") && (
              <View style={$horizon}>
                <View style={$width}>
                  <CustomInput
                    disabled={isEditable}
                    keyboardType="decimal-pad"
                    value={form?.raw_water ?? ""}
                    showIcon={false}
                    onBlur={() => {
                      form.raw_water !== ""
                        ? setErrors((pre) => ({ ...pre, raw_water: false }))
                        : setErrors((pre) => ({ ...pre, raw_water: true }))
                    }}
                    onChangeText={(text) => {
                      form.raw_water !== ""
                        ? setErrors((pre) => ({ ...pre, raw_water: false }))
                        : setErrors((pre) => ({ ...pre, raw_water: true }))

                      setForm((pre) => ({ ...pre, raw_water: text.trim() }))
                    }}
                    label="Raw Water"
                    hintLimit={route?.type?.toLowerCase()?.startsWith("pressure ") && "6.5 - 8.5"}
                    warning={(form?.raw_water && +form.raw_water < 6.5) || +form?.raw_water > 8.5}
                    errormessage={errors?.raw_water ? "សូមជ្រើសរើស Raw Water" : ""}
                  />
                </View>
                <View style={$width}>
                  <CustomInput
                    disabled={isEditable}
                    keyboardType="decimal-pad"
                    value={form?.buffer ?? ""}
                    showIcon={false}
                    onBlur={() => {
                      form.buffer !== ""
                        ? setErrors((pre) => ({ ...pre, buffer: false }))
                        : setErrors((pre) => ({ ...pre, buffer: true }))
                    }}
                    onChangeText={(text) => {
                      form.buffer !== ""
                        ? setErrors((pre) => ({ ...pre, buffer: false }))
                        : setErrors((pre) => ({ ...pre, buffer: true }))

                      setForm((pre) => ({ ...pre, buffer: text.trim() }))
                    }}
                    label="Buffer ST0002"
                    hintLimit={route?.type?.toLowerCase()?.startsWith("pressure ") && "6.5 - 8.5"}
                    warning={(form?.buffer && +form.buffer < 6.5) || +form?.buffer > 8.5}
                    errormessage={errors?.buffer ? "សូមជ្រើសរើស Buffer" : ""}
                  />
                </View>
              </View>
            )}
          </View>
        </ScrollView>
        <ActivityModal log={[]} onClose={() => setShowlog(false)} isVisible={showLog} />
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
