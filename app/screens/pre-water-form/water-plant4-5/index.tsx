import React, { FC, useLayoutEffect, useState } from "react"
import Icon from "react-native-vector-icons/Ionicons"
import { observer } from "mobx-react-lite"
import { AppStackScreenProps } from "app/navigators"
import { View, ViewStyle, TouchableOpacity } from "react-native"
import { Text } from "app/components/v2"
import ActivityBar from "app/components/v2/WaterTreatment/ActivityBar"
import { useNavigation, useRoute } from "@react-navigation/native"

import { ScrollView } from "react-native"
import { KeyboardAvoidingView } from "react-native"
import CustomInput from "app/components/v2/DailyPreWater/CustomInput"

interface PreWaterForm2ScreenProps extends AppStackScreenProps<"PreWaterForm2"> {}

export const PreWaterForm2Screen: FC<PreWaterForm2ScreenProps> = observer(
  function PreWaterForm2Screen() {
    const navigation = useNavigation()
    const route = useRoute().params
    const [showLog, setShowlog] = useState<boolean>(false)
    const [form, setForm] = useState({
      sf1: "",
      sf2: "",
      acf1: "",
      acf2: "",
      tenMm1: null,
      tenMm2: "",
      raw_water: "",
      buffer: "",
    })

    const [errors, setErrors] = useState({
      sf1: true,
      sf2: true,
      acf1: true,
      acf2: true,
      tenMm1: true,
      tenMm2: true,
      raw_water: true,
      buffer: true,
    })
    useLayoutEffect(() => {
      navigation.setOptions({
        headerShown: true,
        title: "Pressure drop",

        headerRight: () => (
          <TouchableOpacity
            style={$horizon}
            onPress={() => {
              if (route?.type?.toLowerCase()?.startsWith("pressure")) {
                let errorslist = errors
                delete errorslist.raw_water
                delete errorslist.buffer
                const isvalid = Object.values(errorslist).every((error) => error === false)
                if (!isvalid) {
                  return
                }
              } else {
                let errorslist = errors
                const isvalid = Object.values(errorslist).every((error) => error === false)
                if (!isvalid) {
                  return
                }
              }
              navigation.goBack()
            }}
          >
            <Icon name="checkmark-sharp" size={24} color={"#0081F8"} />
            <Text primaryColor body1 semibold>
              Save
            </Text>
          </TouchableOpacity>
        ),
      })
    }, [navigation, route, errors])
    return (
      <KeyboardAvoidingView behavior={"padding"} keyboardVerticalOffset={100} style={$root}>
        <ScrollView>
          <View style={$outerContainer}>
            <ActivityBar direction="end" onActivity={() => setShowlog(true)} />

            <View style={$horizon}>
              <View style={$width}>
                <CustomInput
                  keyboardType="decimal-pad"
                  showIcon={false}
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
                  hintLimit="0.2 - 0.5 bar"
                  errormessage={errors?.sf1 ? "សូមជ្រើសរើស SF1" : ""}
                />
              </View>
              <View style={$width}>
                <CustomInput
                  keyboardType="decimal-pad"
                  showIcon={false}
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
                  hintLimit="0.2 - 0.5 bar"
                  errormessage={errors?.sf2 ? "សូមជ្រើសរើស SF2" : ""}
                />
              </View>
            </View>
            <View style={$horizon}>
              <View style={$width}>
                <CustomInput
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
                  hintLimit="0.2 - 0.5 bar"
                  errormessage={errors?.acf1 ? "សូមជ្រើសរើស ACF1" : ""}
                />
              </View>
              <View style={$width}>
                <CustomInput
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
                  hintLimit="0.2 - 0.5 bar"
                  errormessage={errors?.acf2 ? "សូមជ្រើសរើស ACF2" : ""}
                />
              </View>
            </View>
            <View style={$horizon}>
              <View style={$width}>
                <CustomInput
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
                  hintLimit="1 < 2.5 bar"
                  errormessage={errors?.tenMm1 ? "សូមជ្រើសរើស 10Mm1" : ""}
                />
              </View>
              <View style={$width}>
                <CustomInput
                  value={form.tenMm2?.toString() || ""}
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
                  hintLimit="1 < 2.5 bar"
                  errormessage={errors?.tenMm2 ? "សូមជ្រើសរើស 10Mm2" : ""}
                />
              </View>
            </View>

            {!route?.type?.toLowerCase().startsWith("pressure") && (
              <View style={$horizon}>
                <View style={$width}>
                  <CustomInput
                    keyboardType="decimal-pad"
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
                    hintLimit="6.5 - 8.5"
                    errormessage={errors?.raw_water ? "សូមជ្រើសរើស Raw Water" : ""}
                  />
                </View>
                <View style={$width}>
                  <CustomInput
                    keyboardType="decimal-pad"
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
                    hintLimit="6.5 - 8.5"
                    errormessage={errors?.buffer ? "សូមជ្រើសរើស Buffer" : ""}
                  />
                </View>
              </View>
            )}
          </View>
        </ScrollView>
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
