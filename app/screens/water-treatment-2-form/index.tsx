import React, { FC, useEffect, useLayoutEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import Icon from "react-native-vector-icons/Ionicons"
import {
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  View,
  ViewStyle,
  Platform,
  Alert,
} from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Text } from "app/components/v2"
import CustomInput from "app/components/v2/DailyPreWater/CustomInput"
import ActivityBar from "app/components/v2/WaterTreatment/ActivityBar"
import { Checkbox, useTheme } from "react-native-paper"
import ActivityModal from "app/components/v2/ActivitylogModal"
import { useStores } from "app/models"
import { TreatmentModel } from "app/models/water-treatment/water-treatment-model"
import { ALERT_TYPE, Dialog } from "react-native-alert-notification"

interface WaterTreatmentPlant2FormScreenProps
  extends AppStackScreenProps<"WaterTreatmentPlant2Form"> {}

export const WaterTreatmentPlant2FormScreen: FC<WaterTreatmentPlant2FormScreenProps> = observer(
  function WaterTreatmentPlant2FormScreen() {
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()

    // Pull in navigation via hook
    const navigation = useNavigation()
    const [showLog, setShowlog] = useState<boolean>(false)
    const [machineState, setMachineState] = useState({
      iswarning: false,
      warning_count: 0,
    })
    const route = useRoute().params
    const { waterTreatmentStore } = useStores()
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

    useLayoutEffect(() => {
      navigation.setOptions({
        headerShown: true,
        title: route?.type || "Raw Water",
        headerRight: () => (
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => validate()}
          >
            <Icon name="checkmark-sharp" size={24} color={"#0081F8"} />
            <Text primaryColor body1 semibold>
              Save
            </Text>
          </TouchableOpacity>
        ),
      })
      validateStateMachine()
    }, [errors, navigation, route, form])

    useEffect(() => {
      if (route?.items) {
        setForm({
          tds: route?.items?.tds,
          ph: route?.items?.ph,
          temperature: route?.items?.temperature,
          other: route?.items?.other,
          air_release: route?.items?.air_release,
          pressure: route?.items?.pressure,
          odor: route?.items?.odor,
          taste: route?.items?.taste,
          press_inlet: route?.items?.press_inlet,
          press_treat: route?.items?.press_treat,
          press_drain: route?.items?.press_drain,
        })
        setErrors({
          tds: !route?.items?.tds,
          ph: !route?.items?.ph,
          temperature: !route?.items?.temperature,
          other: false,
          air_release: !route?.items?.air_release,
          pressure: !route?.items?.pressure,
          odor: !route?.items?.odor,
          taste: !route?.items?.taste,
          press_inlet: !route?.items?.press_inlet,
          press_treat: !route?.items?.press_treat,
          press_drain: !route?.items?.press_drain,
        })
      }
    }, [route])

    const handleSubmit = async () => {
      try {
        const payload = TreatmentModel.create({
          tds: form?.tds?.toString(),
          ph: form?.ph?.toString(),
          temperature: form?.temperature?.toString(),
          other: form?.other,
          air_release: form?.air_release?.toString(),
          machine: route?.type + "",
          status: machineState.iswarning ? "warning" : "normal",
          press_drain: form?.press_drain,
          press_inlet: form?.press_inlet,
          press_treat: form?.press_treat,
          pressure: form?.pressure,
          taste: form?.taste ? "1" : "0",
          odor: form?.odor ? "1" : "0",
          id: Number(route?.items?.id),
        })
        await waterTreatmentStore.createWtpRequest(payload).saveWtp2()

        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: "ជោគជ័យ",
          textBody: "រក្សាទុកបានជោគជ័យ",
          button: "close",
          // autoClose: 500,
        })
      } catch (error) {
        console.log(error?.message)
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "បរាជ័យ",
          textBody: "បញ្ហាបច្ចេកទេសនៅលើ server",
          button: "បិទ",
        })
      }
    }

    const validate = () => {
      const rawWaterError = errors.tds || errors.temperature || errors.ph
      const filterError = errors.tds || errors.temperature || errors.ph || errors.air_release
      const microError = errors.tds || errors.temperature || errors.ph || errors.pressure
      const reversesError =
        errors.tds ||
        errors.ph ||
        errors.press_drain ||
        errors.press_inlet ||
        errors.press_treat ||
        (errors.odor && errors.taste)

      if (route?.type?.toLowerCase()?.startsWith("raw water stock")) {
        if (rawWaterError) return
      } else if (
        ["sand filter", "carbon filter", "resin filter"].includes(route?.type?.toLowerCase())
      ) {
        if (filterError) return
      } else if (route?.type?.toLowerCase()?.startsWith("micro")) {
        if (microError) {
          return
        }
      } else if (reversesError) {
        return
      }
      validateStateMachine()
      // valid every field =>  call handlesubmit form to server
      handleSubmit()
    }

    const validateStateMachine = () => {
      const restrictTD = +form?.tds > 300
      const restrictTemperature = +form?.temperature < 25 || +form?.temperature > 35
      const restrictPH = +form?.ph < 6.5 || +form?.ph > 8.5

      const restrictPressure = +form?.pressure > 300
      const restrictPress =
        +form?.press_inlet < 0.01 ||
        +form?.press_inlet > 0.3 ||
        +form?.press_treat < 0.01 ||
        +form?.press_treat > 0.3 ||
        +form?.press_drain < 0.01 ||
        +form?.press_drain > 0.3

      if (
        route?.type?.toLowerCase()?.startsWith("raw water stock") ||
        ["sand filter", "carbon filter", "resin filter"].includes(route?.type?.toLowerCase())
      ) {
        if (restrictTD || restrictTemperature || restrictPH) {
          setMachineState({
            iswarning: true,
            warning_count: 0,
          })
        } else {
          setMachineState({ iswarning: false, warning_count: 0 })
        }
      } else if (route?.type?.toLowerCase()?.startsWith("micro")) {
        if (restrictTD || restrictTemperature || restrictPH || restrictPressure) {
          console.log("tem is", restrictTemperature)
          console.log("td is", restrictTD)

          console.log("ph is", restrictPH)

          console.log("restrict", restrictPressure)
          setMachineState({
            iswarning: true,
            warning_count: 0,
          })
        } else {
          setMachineState({ iswarning: false, warning_count: 0 })
        }
      } else {
        if (restrictTD || restrictPH || restrictPress) {
          setMachineState({
            iswarning: true,
            warning_count: 0,
          })
        } else {
          setMachineState({ iswarning: false, warning_count: 0 })
        }
      }
    }

    console.log("is warning", machineState.iswarning)
    return (
      <KeyboardAvoidingView behavior={"padding"} keyboardVerticalOffset={100} style={$root}>
        <View>
          <ScrollView>
            <View style={$outer}>
              <ActivityBar direction="end" onActivity={() => setShowlog(true)} />

              <View style={[$containerHorizon, { marginBottom: 40, marginTop: 15 }]}>
                <View style={$width}>
                  <CustomInput
                    hintLimit="<=300 ppm"
                    showIcon={false}
                    label="TDS"
                    value={form.tds?.toString() || ""}
                    keyboardType="decimal-pad"
                    onBlur={() => {
                      form.tds !== ""
                        ? setErrors((pre) => ({ ...pre, tds: false }))
                        : setErrors((pre) => ({ ...pre, tds: true }))
                    }}
                    onChangeText={(text) => {
                      form.tds !== ""
                        ? setErrors((pre) => ({ ...pre, tds: false }))
                        : setErrors((pre) => ({ ...pre, tds: true }))

                      setForm((pre) => ({ ...pre, tds: text.trim() }))
                    }}
                    errormessage={errors?.tds ? "សូមជ្រើសរើស TDS" : ""}
                  />
                </View>
                {route?.type?.toLowerCase()?.startsWith("reverses") ? (
                  <View style={$width}>
                    <CustomInput
                      hintLimit="6.5 - 8.5"
                      keyboardType="decimal-pad"
                      showIcon={false}
                      value={form.ph?.toString() || ""}
                      onBlur={() => {
                        form.ph !== ""
                          ? setErrors((pre) => ({ ...pre, ph: false }))
                          : setErrors((pre) => ({ ...pre, ph: true }))
                      }}
                      onChangeText={(text) => {
                        form.ph !== ""
                          ? setErrors((pre) => ({ ...pre, ph: false }))
                          : setErrors((pre) => ({ ...pre, ph: true }))

                        setForm((pre) => ({ ...pre, ph: text.trim() }))
                      }}
                      label="PH"
                      errormessage={errors?.ph ? "សូមជ្រើសរើស PH" : ""}
                    />
                  </View>
                ) : (
                  <View style={$width}>
                    <CustomInput
                      hintLimit="25 - 35 °C"
                      keyboardType="decimal-pad"
                      value={form.temperature?.toString() || ""}
                      showIcon={false}
                      onBlur={() => {
                        form.temperature !== ""
                          ? setErrors((pre) => ({ ...pre, temperature: false }))
                          : setErrors((pre) => ({ ...pre, temperature: true }))
                      }}
                      onChangeText={(text) => {
                        form.temperature !== ""
                          ? setErrors((pre) => ({ ...pre, temperature: false }))
                          : setErrors((pre) => ({ ...pre, temperature: true }))

                        setForm((pre) => ({ ...pre, temperature: text.trim() }))
                      }}
                      label="Temperature"
                      errormessage={errors.temperature ? "សូមជ្រើសរើស temperature" : ""}
                    />
                  </View>
                )}
              </View>

              {!route?.type?.toLowerCase()?.startsWith("reverses") && (
                <View style={$containerHorizon}>
                  <View style={$width}>
                    <CustomInput
                      hintLimit="6.5 - 8.5"
                      showIcon={false}
                      keyboardType="decimal-pad"
                      value={form.ph?.toString() || ""}
                      onBlur={() => {
                        form.ph !== ""
                          ? setErrors((pre) => ({ ...pre, ph: false }))
                          : setErrors((pre) => ({ ...pre, ph: true }))
                      }}
                      onChangeText={(text) => {
                        form.ph !== ""
                          ? setErrors((pre) => ({ ...pre, ph: false }))
                          : setErrors((pre) => ({ ...pre, ph: true }))

                        setForm((pre) => ({ ...pre, ph: text.trim() }))
                      }}
                      label="PH"
                      errormessage={errors.ph ? "សូមជ្រើសរើស ph" : ""}
                    />
                  </View>
                  <View style={$width}>
                    <CustomInput
                      showIcon={false}
                      value={form.other?.toString() || ""}
                      onChangeText={(text) => {
                        setForm((pre) => ({ ...pre, other: text.trim() }))
                      }}
                      label="Other"
                      hintLimit="Optional"
                      errormessage={""}
                    />
                  </View>

                  {(route?.type?.toLowerCase() === "sand filter" ||
                    route?.type?.toLowerCase() === "carbon filter" ||
                    route?.type?.toLowerCase() === "resin filter") && (
                    <View style={$width}>
                      <Text style={{ margin: 5, fontSize: 18 }}>Air Released</Text>

                      <View style={[$containerHorizon, { marginTop: 10 }]}>
                        <TouchableOpacity
                          style={$containerHorizon}
                          onPress={() => {
                            setErrors((pre) => ({ ...pre, air_release: false }))
                            setForm((pre) => ({ ...pre, air_release: true }))
                          }}
                        >
                          <Checkbox
                            status={
                              form.air_release == null
                                ? "unchecked"
                                : form?.air_release === "true" || form.air_release === true
                                ? "checked"
                                : "unchecked"
                            }
                            onPress={() => {
                              setErrors((pre) => ({ ...pre, air_release: false }))
                              setForm((pre) => ({ ...pre, air_release: true }))
                            }}
                            color="#0081F8"
                          />
                          <Text>Yes </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={$containerHorizon}
                          onPress={() => {
                            setErrors((pre) => ({ ...pre, air_release: false }))
                            setForm((pre) => ({ ...pre, air_release: false }))
                          }}
                        >
                          <Checkbox
                            status={
                              form.air_release == null
                                ? "unchecked"
                                : form?.air_release === "false" || form.air_release === false
                                ? "checked"
                                : "unchecked"
                            }
                            onPress={() => {
                              setErrors((pre) => ({ ...pre, air_release: false }))
                              setForm((pre) => ({ ...pre, air_release: false }))
                            }}
                            color="#0081F8"
                          />
                          <Text>No</Text>
                        </TouchableOpacity>
                      </View>
                      <Text caption1 errorColor>
                        {errors?.air_release ? "*សូម​ត្រួតពិនិត្យ air release " : ""}
                      </Text>
                    </View>
                  )}
                </View>
              )}

              {route?.type?.toLowerCase()?.startsWith("micro") && (
                <View style={[$containerHorizon, { marginTop: 30 }]}>
                  <View style={{ flex: 0.5 }}>
                    <CustomInput
                      keyboardType="decimal-pad"
                      showIcon={false}
                      value={form?.pressure}
                      onBlur={() => {
                        form.pressure !== ""
                          ? setErrors((pre) => ({ ...pre, pressure: false }))
                          : setErrors((pre) => ({ ...pre, pressure: true }))
                      }}
                      onChangeText={(text) => {
                        form.pressure !== ""
                          ? setErrors((pre) => ({ ...pre, pressure: false }))
                          : setErrors((pre) => ({ ...pre, pressure: true }))

                        setForm((pre) => ({ ...pre, pressure: text.trim() }))
                      }}
                      label="Pressure"
                      hintLimit="<=300 ppm"
                      errormessage={errors.pressure ? "សូមជ្រើសរើស pressure" : ""}
                    />
                  </View>
                </View>
              )}
              {route?.type?.toLowerCase()?.startsWith("reverses") && (
                <View style={[$containerHorizon, { marginBottom: 40, marginTop: 15 }]}>
                  <View style={$width}>
                    <CustomInput
                      keyboardType="decimal-pad"
                      value={form.press_inlet?.toString() || ""}
                      showIcon={false}
                      onBlur={() => {
                        form.press_inlet !== ""
                          ? setErrors((pre) => ({ ...pre, press_inlet: false }))
                          : setErrors((pre) => ({ ...pre, press_inlet: true }))
                      }}
                      onChangeText={(text) => {
                        form.press_inlet !== ""
                          ? setErrors((pre) => ({ ...pre, press_inlet: false }))
                          : setErrors((pre) => ({ ...pre, press_inlet: true }))

                        setForm((pre) => ({ ...pre, press_inlet: text.trim() }))
                      }}
                      label="Press-inlet"
                      hintLimit="0.01 - 0.3 Mpa"
                      errormessage={errors.press_inlet ? "សូមជ្រើសរើស press-inlet" : ""}
                    />
                  </View>

                  <View style={$width}>
                    <CustomInput
                      keyboardType="decimal-pad"
                      value={form.press_treat?.toString() || ""}
                      hintLimit="0.01 - 0.3 Mpa"
                      showIcon={false}
                      onBlur={() => {
                        form.press_treat !== ""
                          ? setErrors((pre) => ({ ...pre, press_treat: false }))
                          : setErrors((pre) => ({ ...pre, press_treat: true }))
                      }}
                      onChangeText={(text) => {
                        form.press_treat !== ""
                          ? setErrors((pre) => ({ ...pre, press_treat: false }))
                          : setErrors((pre) => ({ ...pre, press_treat: true }))

                        setForm((pre) => ({ ...pre, press_treat: text.trim() }))
                      }}
                      label="Press-Treat"
                      errormessage={errors.press_treat ? "សូមជ្រើសរើស press-treat" : ""}
                    />
                  </View>
                  <View style={$width}>
                    <CustomInput
                      keyboardType="decimal-pad"
                      value={form.press_drain?.toString() || ""}
                      hintLimit="0.01 - 0.3 Mpa"
                      showIcon={false}
                      onBlur={() => {
                        form.press_drain !== ""
                          ? setErrors((pre) => ({ ...pre, press_drain: false }))
                          : setErrors((pre) => ({ ...pre, press_drain: true }))
                      }}
                      onChangeText={(text) => {
                        form.press_drain !== ""
                          ? setErrors((pre) => ({ ...pre, press_drain: false }))
                          : setErrors((pre) => ({ ...pre, press_drain: true }))

                        setForm((pre) => ({ ...pre, press_drain: text.trim() }))
                      }}
                      label="Press Dain"
                      errormessage={errors.press_drain ? "សូមជ្រើសរើស press-drain" : ""}
                    />
                  </View>
                </View>
              )}
              <View style={$containerHorizon}>
                {route?.type?.toLowerCase()?.startsWith("reverse") && (
                  <View style={[$width, { marginTop: 20 }]}>
                    <Text style={{ margin: 5, fontSize: 18 }}>Smell Check</Text>

                    <View style={[$containerHorizon, { marginTop: 10 }]}>
                      <TouchableOpacity
                        style={$containerHorizon}
                        onPress={() => {
                          if (!form.odor) {
                            setForm((pre) => ({ ...pre, odor: true }))
                          } else {
                            setForm((pre) => ({ ...pre, odor: !pre.odor }))
                          }

                          setErrors((pre) => ({ ...pre, odor: false }))
                        }}
                      >
                        <Checkbox
                          status={form?.odor || false ? "checked" : "unchecked"}
                          onPress={() => {
                            if (!form.odor) {
                              setForm((pre) => ({ ...pre, odor: true }))
                            } else {
                              setForm((pre) => ({ ...pre, odor: !pre.odor }))
                            }

                            setErrors((pre) => ({ ...pre, odor: false }))
                          }}
                          color="#0081F8"
                        />
                        <Text>Odor</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={$containerHorizon}
                        onPress={() => {
                          if (!form.taste) {
                            setForm((pre) => ({ ...pre, taste: true }))
                          } else {
                            setForm((pre) => ({ ...pre, taste: !pre.taste }))
                          }
                          setErrors((pre) => ({ ...pre, taste: false }))
                        }}
                      >
                        <Checkbox
                          status={form?.taste || false ? "checked" : "unchecked"}
                          onPress={() => {
                            if (!form.taste) {
                              setForm((pre) => ({ ...pre, taste: true }))
                            } else {
                              setForm((pre) => ({ ...pre, taste: !pre.taste }))
                            }
                            setErrors((pre) => ({ ...pre, taste: false }))
                          }}
                          color="#0081F8"
                        />
                        <Text>Taste</Text>
                      </TouchableOpacity>
                    </View>
                    <Text caption1 errorColor style={{ marginTop: 10 }}>
                      {errors?.odor && errors?.taste ? "*សូម​ត្រួតពិនិត្យ smell " : ""}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
          <ActivityModal onClose={() => setShowlog(false)} isVisible={showLog} />
        </View>
      </KeyboardAvoidingView>
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
