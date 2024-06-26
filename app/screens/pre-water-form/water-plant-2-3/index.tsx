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
} from "react-native"
import { Text } from "app/components/v2"
import ActivityBar from "app/components/v2/WaterTreatment/ActivityBar"
import { useNavigation, useRoute } from "@react-navigation/native"
import CustomInput from "app/components/v2/DailyPreWater/CustomInput"
import { Checkbox } from "react-native-paper"
import { useStores } from "app/models"
import { PreTreatmentListItemModel } from "app/models/pre-water-treatment/pre-water-treatment-model"
import { ALERT_TYPE, Dialog } from "react-native-alert-notification"
import ActivityModal from "app/components/v2/ActivitylogModal"
import { styles } from "../styles"
import BadgeWarning from "app/components/v2/Badgewarn"
import { ImagetoText, getResultImageCamera, getResultImageGallery } from "app/utils-v2/ocr"
import {translate} from "../../../i18n/translate"

interface PreWaterForm1ScreenProps extends AppStackScreenProps<"PreWaterForm1"> {}

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
    const [form, setForm] = useState({
      sf1: "",
      acf1: "",
      resin: "",
      raw_water: "",
      fiveMm: "",
      remarks: "",
      air_released: {
        sf: null,
        acf: null,
        resin: null,
      },
    })

    const [oldRoute, setRoute] = useState({})
    const [isEditable, setEditable] = useState(false)
    const [errors, setErrors] = useState({
      sf1: true,
      acf1: true,
      resin: true,
      raw_water: true,
      fiveMm: true,
      remarks: true,
      air_released: false,
    })
    const fetchUserActivity = async () => {
      const result = await preWaterTreatmentStore.getActivitiesList(
        route?.item?.id,
        route?.item?.pre_treatment_type,
      )
      setActivities(result.sort((a, b) => new Date(b.actionDate) - new Date(a.actionDate)))
    }

    const checkChanges = () => {
      const modifedForm = form
      // delete modifedForm?.remarks
      const arractions = []

      if (route?.type?.toLowerCase().includes("air")) {
        delete modifedForm.fiveMm
        delete modifedForm.raw_water
        delete modifedForm.resin
        delete modifedForm.acf1
        delete modifedForm.sf1
        // delete modifedForm?.remarks

        if (route?.item?.resin != null) {
          for (const key in form.air_released) {
            if (oldRoute?.air_released[key] != form?.air_released[key]) {
              arractions.push({
                name: key,
                oldValue: oldRoute?.air_released[key] ? "Yes" : "No",
                value: form?.air_released[key] ? "Yes" : "No",
              })
            }
          }
        }
      } else {
        delete modifedForm.air_released
        delete modifedForm?.remarks

        for (const key in modifedForm) {
          if (oldRoute[key] !== null) {
            // console.log("current Form", form[key], key)
            // console.log("old Route", oldRoute[key], key)
            if (form[key] != oldRoute[key]) {
              arractions.push({
                name: key,
                oldValue: oldRoute[key],
                value: form[key],
              })
            }
          }
        }
      }

      return arractions // Return false if no values have changed
    }
    const getActionUser = () => {
      const arrActions = checkChanges()
      const str = []

      for (const item of arrActions) {
        str.push("" + item.name.toUpperCase() + " from " + item.oldValue + " to " + item.value)
      }
      return !arrActions.length
        ? "has modified and completed this machine"
        : route?.item?.status !== null || route?.item?.status !== "pending"
        ? "has modified " + str.join(" , ")
        : "has modified this machine with no changes"
    }
    const checkWarningCount = () => {
      let warning = 0
      if (route?.type?.toLowerCase().includes("pressure")) {
        delete form.raw_water
        for (const key in form) {
          if (form[key] < 0.1 || form[key] > 0.3) {
            warning += 1
          }
        }
      }

      if (route?.type?.toLowerCase().includes("tds")) {
        for (const key in form) {
          if (form[key] > 300) {
            warning += 1
          }
        }
      }
      if (route?.type?.toLowerCase().includes("ph")) {
        for (const key in form) {
          if (form[key] < 6.5 || form[key] > 8.5) {
            warning += 1
          }
        }
      }

      return warning
    }
    const formvalidation = () => {
      let hasError = false
      const errlists = errors
      delete errlists?.remarks
      if (!route?.type?.toLowerCase().includes("air")) {
        delete errlists?.air_released

        if (!route?.type?.toLowerCase().includes("ph")) {
          // delete errlists?.raw_water
          delete errlists?.raw_water
        }
      } else {
        delete errlists?.fiveMm
        delete errlists?.acf1
        delete errlists?.sf1
        delete errlists?.resin
        delete errlists?.raw_water
        const airErrorLists = {
          sf: form.air_released?.sf,
          acf: form.air_released?.acf,
          resin: form.air_released?.resin,
        }
        for (const key in airErrorLists) {
          if (airErrorLists[key] === null) {
            hasError = true
          }
        }
      }

      for (const key in errlists) {
        if (errors[key] === true) {
          hasError = true
        }
      }

      return hasError
    }

    const getAirStatus = (): number => {
      const errlists = {
        sf: form.air_released?.sf,
        acf: form.air_released?.acf,
        resin: form.air_released?.resin,
      }
      const errs = []
      for (const key in errlists) {
        if (errlists[key] === true) {
          errs.push(key)
        }
      }
      return errs.length
    }
    const handleSubmit = async () => {
      try {
        if (route?.type?.toLowerCase().includes("air")) {
          setLoading(true)
          const modifiedForm = Object.assign({}, form)

          const actions = getActionUser()
          const payload = PreTreatmentListItemModel.create({
            pre_treatment_type: route?.item?.pre_treatment_type,
            id: route?.item?.id,
            pre_treatment_id: route?.item?.pre_treatment_id,
            action: actions,

            sf: form.air_released?.sf ? "1" : "0",
            acf: form.air_released?.acf ? "1" : "0",
            resin: form.air_released?.resin ? "1" : "0",
            status: getAirStatus() ? "warning" : "normal",
            remark: modifiedForm.remarks,
            warning_count: getAirStatus(),
          })

          setRoute({
            remarks: modifiedForm.remarks,
            air_released: {
              sf: form.air_released?.sf,
              acf: form.air_released?.acf,
              resin: form.air_released?.resin,
            },
          })

          await preWaterTreatmentStore.addPretreatments(payload).savePreWtp()
          fetchUserActivity()
          route?.onBack()

          Dialog.show({
            type: ALERT_TYPE.SUCCESS,
            title: "ជោគជ័យ",
            textBody: "រក្សាទុកបានជោគជ័យ",
            button: "close",
            autoClose: 500,
          })
        } else {
          setLoading(true)
          const actions = getActionUser()
          const getWarningcount = checkWarningCount()
          const payload = PreTreatmentListItemModel.create({
            pre_treatment_type: route?.item?.pre_treatment_type,
            id: route?.item?.id,
            pre_treatment_id: route?.item?.pre_treatment_id,
            action: actions,
            sf: form.sf1,
            acf: form.acf1,
            resin: form.resin,
            remark: form.remarks,
            raw_water: form.raw_water ?? null,
            um5: form.fiveMm,
            status: getWarningcount > 0 ? "warning" : "normal",
            warning_count: getWarningcount,
          })

          setRoute({
            sf1: form.sf1 ?? null,
            acf1: form.acf1 ?? null,
            resin: form.resin ?? null,
            raw_water: form.raw_water ?? null,
            fiveMm: form.fiveMm ?? null,
            remark: form.remarks ?? null,
          })

          setLoading(true)

          await preWaterTreatmentStore.addPretreatments(payload).savePreWtp()
          fetchUserActivity()
          route?.onBack()

          Dialog.show({
            type: ALERT_TYPE.SUCCESS,
            title: "ជោគជ័យ",
            textBody: "រក្សាទុកបានជោគជ័យ",
            button: "close",
            autoClose: 500,
          })
        }
      } catch (error) {
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
      if (route?.type?.toLowerCase().includes("air")) {
        return
      }
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
      if (route?.type?.toLowerCase().includes("ph")) {
        const [sf1, resin, acf1, mM5, raw_water] = numeric

        setForm({
          sf1: sf1,
          acf1: acf1,
          resin: resin,
          raw_water: raw_water,
          fiveMm: mM5,
        })
        setErrors({
          sf1: false,
          acf1: false,
          raw_water: false,
          resin: false,
          fiveMm: false,
        })
        return
      }
      const [sf1, resin, acf1, mM5] = numeric


      setForm({
        sf1: sf1,
        acf1: acf1,
        resin: resin,
        fiveMm: mM5,
      })
      setErrors({
        sf1: false,
        acf1: false,
        resin: false,
        fiveMm: false,
      })
    }

    const onlaunchGallery = async () => {
      try {
        const result = await getResultImageGallery()

        if (!result) {
          return
        }
        if (!result?.canceled) {
          performOCR(result?.assets[0])
          setImage(result?.assets[0]?.uri)
          // Set the selected image in state
        } else {
          console.log("Cancel scan")
        }
      } catch (error) {
        console.error(error.message)
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
        if (!result?.canceled) {
          performOCR(result?.assets[0])
          setImage(result?.assets[0]?.uri)
          // Set the selected image in state
        } else {
          console.log("Cancel scan")
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
      setScanning(true)

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
        if (route?.type?.toLowerCase().includes("ph")) {

          shouldIgnoreSequence = (sequence) => {
            const ignorePattern = ["*", "Warning", "Level", "(", "6.5", "-", "8.5", ")"]
            for (let i = 0; i < ignorePattern.length; i++) {
              if (sequence[i] !== ignorePattern[i]) {
                return false
              }
            }
            return true
          }
        } else {
          shouldIgnoreSequence = (sequence) => {
            const ignorePattern = ["*", "Warning", "Level", "(", "0.1", "-0.3", "Mpa", ")"]
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
      } finally {
        setScanning(false)
      }
    }

    const getCurrentUserName = async () => {
      const userinfo = await authStore.getUserInfo()
      const { login } = userinfo.data
      return login
    }
    const checkUserRole = async () => {
      // console.log("machine user assign to", route?.items?.assign_to_user)
      if (!route?.item?.assign_to_user) {
        setEditable(false)

        return
      }
      const currUser = await getCurrentUserName()
      const arrUsers = route?.item?.assign_to_user?.split(" ") as string[]
      if (arrUsers.includes(currUser)) {
        setEditable(true)
      } else {
        setEditable(false)
      }
    }
    useLayoutEffect(() => {
      navigation.setOptions({
        headerShown: true,
        title: route?.type,

        headerRight: () =>
          route?.isvalidDate && route?.item?.assign_to_user && route?.isValidShift ? (
            <TouchableOpacity
              style={$horizon}
              onPress={() => {
                // navigation.goBack()
                const hasError = formvalidation()
                if (!hasError) {
                  handleSubmit()
                }
              }}
            >
              <Icon name="checkmark-sharp" size={24} color={"#0081F8"} />
              <Text primaryColor body1 semibold>
                {translate('wtpcommon.save')}
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              <Text></Text>
            </>
          ),
      })
    }, [form, route, errors, oldRoute, isEditable])

    useEffect(() => {
      checkUserRole()
      fetchUserActivity()
      let airReleased
      if (route.item.sf == null) {
        airReleased = {
          sf: null,
          acf: null,
          resin: null,
        }
      } else {
        airReleased = {
          sf: route?.item?.sf == 1 ? true : false,
          acf: route?.item?.acf == 1 ? true : false,
          resin: route?.item?.resin == 1 ? true : false,
        }
      }

      setForm({
        sf1: route?.item?.sf,
        acf1: route?.item?.acf,
        resin: route?.item?.resin,
        fiveMm: route?.item?.um5,
        remarks: route?.item?.remark,
        raw_water: route?.item?.raw_water,
        air_released: airReleased,
      })
      setRoute({
        sf1: route?.item?.sf,
        acf1: route?.item?.acf,
        resin: route?.item?.resin,
        fiveMm: route?.item?.um5,
        remarks: route?.item?.remark,
        raw_water: route?.item?.raw_water,
        air_released: {
          sf: route?.item?.sf == 1 ? true : false ?? null,
          acf: route?.item?.acf == 1 ? true : false ?? null,
          resin: route?.item?.resin == 1 ? true : false ?? null,
        },
      })

      setErrors({
        sf1: !route?.item?.sf,
        acf1: !route?.item?.acf,
        resin: !route?.item?.resin,
        fiveMm: !route?.item?.um5,
        remarks: !route?.item?.remark,
        raw_water: !route?.item?.raw_water,
        air_released: false,
      })
    }, [route])

    return (
      <KeyboardAvoidingView behavior={"padding"} keyboardVerticalOffset={100} style={[$root]}>
        {isloading && (
          <View style={styles.overlay}>
            <ActivityIndicator color="#8CC8FF" size={35} />
            <View style={{ marginVertical: 15 }}></View>
            <Text whiteColor textAlign={"center"}>
              Scanning ...
            </Text>
          </View>
        )}
        {isScanning && (
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
              {route?.type?.toLowerCase().includes("air") ? (
                <></>
              ) : route?.type?.toLowerCase().includes("tds") ? (
                <Text errorColor semibold body1>
                  {`* ${translate('preWaterTreatment.warningLevel')} ( > 300 ppm ) `}
                </Text>
              ) : route?.type?.toLowerCase().includes("ph") ? (
                <Text errorColor semibold body1>
                  {`* ${translate('preWaterTreatment.warningLevel')}( 6.5 - 8.5  ) `}
                </Text>
              ) : (
                <Text errorColor semibold body1>
                  {`* ${translate('preWaterTreatment.warningLevel')}( 0.1 - 0.3 Mpa ) `}
                </Text>
              )}

              {route?.isvalidDate && route?.item?.assign_to_user && route?.isValidShift && (
                <ActivityBar
                  direction="end"
                  onScanCamera={onlaunchCamera}
                  onAttachment={onlaunchGallery}
                  onActivity={() => setShowlog(true)}
                />
              )}
            </View>

            {route?.type?.toLowerCase().includes("air") ? (
              <>
                <View style={{ gap: 15 }}>
                  <View style={[$horizon]}>
                    <View style={{ marginVertical: 25, flex: 1 }}>
                      <Text body1 semibold style={{ marginBottom: 15 }}>
                        Air Released SF
                        {form.air_released.sf && (
                          <View style={{ alignItems: "center" }}>
                            <BadgeWarning value={"!"} status="warning" />
                          </View>
                        )}
                      </Text>

                      <Text body1 semibold>
                        <Text errorColor>* </Text> SF
                      </Text>

                      <View style={[$horizon, { marginTop: 20 }]}>
                        <TouchableOpacity
                          disabled={!isEditable}
                          style={$horizon}
                          onPress={() => {
                            setForm((pre) => ({
                              ...pre,
                              air_released: { ...pre.air_released, sf: true },
                            }))
                          }}
                        >
                          <Checkbox
                            disabled={!isEditable}
                            status={
                              form?.air_released?.sf === null
                                ? "unchecked"
                                : form?.air_released?.sf === true
                                ? "checked"
                                : "unchecked"
                            }
                            onPress={() => {
                              setForm((pre) => ({
                                ...pre,
                                air_released: { ...pre.air_released, sf: true },
                              }))
                            }}
                            color="#0081F8"
                          />
                          <Text>Yes </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          disabled={!isEditable}
                          style={$horizon}
                          onPress={() => {
                            // setErrors((pre) => ({ ...pre, air_release: false }))
                            setForm((pre) => ({
                              ...pre,
                              air_released: { ...pre.air_released, sf: false },
                            }))
                          }}
                        >
                          <Checkbox
                            disabled={!isEditable}
                            status={
                              form?.air_released?.sf === null
                                ? "unchecked"
                                : form?.air_released?.sf === false
                                ? "checked"
                                : "unchecked"
                            }
                            onPress={() => {
                              setForm((pre) => ({
                                ...pre,
                                air_released: { ...pre.air_released, sf: false },
                              }))
                            }}
                            color="#0081F8"
                          />
                          <Text>No</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={{ marginVertical: 25, flex: 1 }}>
                      <Text body1 semibold style={{ marginBottom: 15 }}>
                        Air Released ACF
                        {form.air_released.acf && (
                          <View>
                            <BadgeWarning value={"!"} status="warning" />
                          </View>
                        )}
                      </Text>
                      <Text body1 semibold>
                        <Text errorColor>* </Text> ACF
                      </Text>

                      <View style={[$horizon, { marginTop: 20 }]}>
                        <TouchableOpacity
                          disabled={!isEditable}
                          style={$horizon}
                          onPress={() => {
                            setForm((pre) => ({
                              ...pre,
                              air_released: { ...pre.air_released, acf: true },
                            }))
                          }}
                        >
                          <Checkbox
                            disabled={!isEditable}
                            status={
                              form.air_released?.acf == null
                                ? "unchecked"
                                : form?.air_released?.acf === "true" ||
                                  form.air_released?.acf === true
                                ? "checked"
                                : "unchecked"
                            }
                            onPress={() => {
                              setForm((pre) => ({
                                ...pre,
                                air_released: { ...pre.air_released, acf: true },
                              }))
                            }}
                            color="#0081F8"
                          />
                          <Text>Yes </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          disabled={!isEditable}
                          style={$horizon}
                          onPress={() => {
                            // setErrors((pre) => ({ ...pre, air_release: false }))
                            setForm((pre) => ({
                              ...pre,
                              air_released: { ...pre.air_released, acf: false },
                            }))
                          }}
                        >
                          <Checkbox
                            disabled={!isEditable}
                            status={
                              form.air_released?.acf == null
                                ? "unchecked"
                                : form?.air_released?.acf === "false" ||
                                  form.air_released?.acf === false
                                ? "checked"
                                : "unchecked"
                            }
                            onPress={() => {
                              setForm((pre) => ({
                                ...pre,
                                air_released: { ...pre.air_released, acf: false },
                              }))
                            }}
                            color="#0081F8"
                          />
                          <Text>No</Text>
                        </TouchableOpacity>
                      </View>
                      {/* <View style={[$horizon, { marginVertical: 15 }]}>
                        <View style={{ width: 300 }}>
                          <CustomInput
                            showIcon={false}
                            onChangeText={(text) => {
                              setForm((pre) => ({ ...pre, remarks: text.toString() }))
                            }}
                            label="Remark"
                            errormessage={""}
                          />
                        </View>
                      </View> */}
                    </View>
                    <View style={{ marginVertical: 25, flex: 1 }}>
                      <Text body1 semibold style={{ marginBottom: 15 }}>
                        Air Released Resin
                        {form.air_released.resin && (
                          <View>
                            <BadgeWarning value={"!"} status="warning" />
                          </View>
                        )}
                      </Text>
                      <Text body1 semibold>
                        <Text errorColor>* </Text> Resin
                      </Text>

                      <View style={[$horizon, { marginTop: 20 }]}>
                        <TouchableOpacity
                          style={$horizon}
                          disabled={!isEditable}
                          onPress={() => {
                            setForm((pre) => ({
                              ...pre,
                              air_released: { ...pre.air_released, resin: true },
                            }))
                          }}
                        >
                          <Checkbox
                            disabled={!isEditable}
                            status={
                              form.air_released?.resin == null
                                ? "unchecked"
                                : form?.air_released?.resin === "true" ||
                                  form.air_released?.resin === true
                                ? "checked"
                                : "unchecked"
                            }
                            onPress={() => {
                              setForm((pre) => ({
                                ...pre,
                                air_released: { ...pre.air_released, resin: true },
                              }))
                            }}
                            color="#0081F8"
                          />
                          <Text>Yes </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={$horizon}
                          disabled={!isEditable}
                          onPress={() => {
                            // setErrors((pre) => ({ ...pre, air_release: false }))
                            setForm((pre) => ({
                              ...pre,
                              air_released: { ...pre.air_released, resin: false },
                            }))
                          }}
                        >
                          <Checkbox
                            disabled={!isEditable}
                            status={
                              form.air_released?.resin == null
                                ? "unchecked"
                                : form?.air_released?.resin === "false" ||
                                  form.air_released?.resin === false
                                ? "checked"
                                : "unchecked"
                            }
                            onPress={() => {
                              setForm((pre) => ({
                                ...pre,
                                air_released: { ...pre.air_released, resin: false },
                              }))
                            }}
                            color="#0081F8"
                          />
                          <Text>No</Text>
                        </TouchableOpacity>
                      </View>
                      {/* <View style={[$horizon, { marginVertical: 15 }]}>
                        <View style={{ width: 300 }}>
                          <CustomInput
                            showIcon={false}
                            onChangeText={(text) => {
                              setForm((pre) => ({ ...pre, remarks: text.toString() }))
                            }}
                            label="Remark"
                            errormessage={""}
                          />
                        </View>
                      </View> */}
                    </View>
                  </View>
                  <View style={$width}>
                    <CustomInput
                      disabled={isEditable}
                      showAsterick={false}
                      showIcon={false}
                      onChangeText={(text) => {
                        form.remarks !== ""
                          ? setErrors((pre) => ({ ...pre, remarks: false }))
                          : setErrors((pre) => ({ ...pre, remarks: true }))
                        setForm((pre) => ({ ...pre, remarks: text.toString() }))
                      }}
                      label="Remarks"
                      value={form.remarks}
                      errormessage={""}
                    />
                  </View>
                </View>
              </>
            ) : (
              <>
                <View style={$horizon}>
                  <View style={$width}>
                    <CustomInput
                      disabled={isEditable}
                      showIcon={false}
                      value={form.sf1?.toString()}
                      warning={
                        form.sf1 === null
                          ? false
                          : route?.type?.toLowerCase().includes("ph")
                          ? +form?.sf1 < 6.5 || +form?.sf1 > 8.5
                          : route?.type?.toLowerCase().includes("pressure")
                          ? +form.sf1 < 0.1 || +form?.sf1 > 0.3
                          : +form?.sf1 > 300
                      }
                      keyboardType="decimal-pad"
                      onChangeText={(text) => {
                        form.sf1 !== ""
                          ? setErrors((pre) => ({ ...pre, sf1: false }))
                          : setErrors((pre) => ({ ...pre, sf1: true }))

                        setForm((pre) => ({ ...pre, sf1: text.toString() }))
                      }}
                      onBlur={() => {
                        form.sf1 !== ""
                          ? setErrors((pre) => ({ ...pre, sf1: false }))
                          : setErrors((pre) => ({ ...pre, sf1: true }))
                      }}
                      label="SF"
                      errormessage={errors.sf1 ? "សូមជ្រើសរើស SF" : ""}
                    />
                  </View>
                  <View style={$width}>
                    <CustomInput
                      disabled={isEditable}
                      keyboardType="decimal-pad"
                      showIcon={false}
                      value={form.acf1}
                      warning={
                        form.acf1 === null
                          ? false
                          : route?.type?.toLowerCase().includes("ph")
                          ? +form?.acf1 < 6.5 || +form?.acf1 > 8.5
                          : route?.type?.toLowerCase().includes("pressure")
                          ? +form.acf1 < 0.1 || +form?.acf1 > 0.3
                          : +form?.acf1 > 300
                      }
                      onChangeText={(text) => {
                        form.acf1 !== ""
                          ? setErrors((pre) => ({ ...pre, acf1: false }))
                          : setErrors((pre) => ({ ...pre, acf1: true }))
                        setForm((pre) => ({ ...pre, acf1: text.toString() }))
                      }}
                      onBlur={() => {
                        form.acf1 !== ""
                          ? setErrors((pre) => ({ ...pre, acf1: false }))
                          : setErrors((pre) => ({ ...pre, acf1: true }))
                      }}
                      label="ACF"
                      errormessage={errors.acf1 ? "សូមជ្រើសរើស ACF" : ""}
                    />
                  </View>
                  {route?.type?.toLowerCase().includes("ph") && (
                    <View style={$width}>
                      <CustomInput
                        disabled={isEditable}
                        keyboardType="decimal-pad"
                        showIcon={false}
                        value={form.raw_water}
                        warning={
                          form.raw_water && route?.type?.toLowerCase().includes("ph")
                            ? +form?.raw_water < 6.5 || +form?.raw_water > 8.5
                            : route?.type?.toLowerCase().includes("pressure")
                            ? +form.raw_water < 0.1 || +form?.raw_water > 0.3
                            : +form?.raw_water > 300
                        }
                        onChangeText={(text) => {
                          form.raw_water !== ""
                            ? setErrors((pre) => ({ ...pre, raw_water: false }))
                            : setErrors((pre) => ({ ...pre, raw_water: true }))
                          setForm((pre) => ({ ...pre, raw_water: text.toString() }))
                        }}
                        onBlur={() => {
                          form.raw_water !== ""
                            ? setErrors((pre) => ({ ...pre, raw_water: false }))
                            : setErrors((pre) => ({ ...pre, raw_water: true }))
                        }}
                        label="Raw Water"
                        errormessage={errors.raw_water ? "សូមជ្រើសរើស Raw Water" : ""}
                      />
                    </View>
                  )}
                </View>

                <View style={$horizon}>
                  <View style={$width}>
                    <CustomInput
                      disabled={isEditable}
                      keyboardType="decimal-pad"
                      showIcon={false}
                      warning={
                        form.resin === null
                          ? false
                          : route?.type?.toLowerCase().includes("ph")
                          ? +form?.resin < 6.5 || +form?.resin > 8.5
                          : route?.type?.toLowerCase().includes("pressure")
                          ? +form.resin < 0.1 || +form?.resin > 0.3
                          : +form?.resin > 300
                      }
                      onChangeText={(text) => {
                        form.resin !== ""
                          ? setErrors((pre) => ({ ...pre, resin: false }))
                          : setErrors((pre) => ({ ...pre, resin: true }))
                        setForm((pre) => ({ ...pre, resin: text.toString() }))
                      }}
                      onBlur={() => {
                        form.resin !== ""
                          ? setErrors((pre) => ({ ...pre, resin: false }))
                          : setErrors((pre) => ({ ...pre, resin: true }))
                      }}
                      label="Resin"
                      value={form.resin}
                      errormessage={errors.resin ? "សូមជ្រើសរើស resin" : ""}
                    />
                  </View>
                  <View style={$width}>
                    <CustomInput
                      disabled={isEditable}
                      keyboardType="decimal-pad"
                      showIcon={false}
                      value={form.fiveMm}
                      onChangeText={(text) => {
                        form.fiveMm !== ""
                          ? setErrors((pre) => ({ ...pre, fiveMm: false }))
                          : setErrors((pre) => ({ ...pre, fiveMm: true }))
                        setForm((pre) => ({ ...pre, fiveMm: text.toString() }))
                      }}
                      onBlur={() => {
                        form.fiveMm !== ""
                          ? setErrors((pre) => ({ ...pre, fiveMm: false }))
                          : setErrors((pre) => ({ ...pre, fiveMm: true }))
                      }}
                      warning={
                        form.fiveMm === null
                          ? false
                          : route?.type?.toLowerCase().includes("ph")
                          ? +form?.fiveMm < 6.5 || +form?.fiveMm > 8.5
                          : route?.type?.toLowerCase().includes("pressure")
                          ? +form.fiveMm < 0.1 || +form?.fiveMm > 0.3
                          : +form?.fiveMm > 300
                      }
                      label="5Mm"
                      errormessage={errors.fiveMm ? "សូមជ្រើសរើស 5Mm" : ""}
                    />
                  </View>
                  {/* <View style={$width}>
                    <CustomInput
                      showIcon={false}
                      onChangeText={(text) => {
                        form.remarks !== ""
                          ? setErrors((pre) => ({ ...pre, remarks: false }))
                          : setErrors((pre) => ({ ...pre, remarks: true }))
                        setForm((pre) => ({ ...pre, remarks: text.toString() }))
                      }}
                      label="Remark"
                      value={form.remarks}
                      errormessage={""}
                    />
                  </View> */}
                </View>
              </>
            )}
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
