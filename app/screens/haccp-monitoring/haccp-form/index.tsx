import React, { FC, useLayoutEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import Icon from "react-native-vector-icons/Ionicons"
import { AppStackScreenProps } from "app/navigators"
import { Text } from "app/components/v2"
import { View, ViewStyle, TouchableOpacity } from "react-native"
import ActivityBar from "app/components/v2/WaterTreatment/ActivityBar"
import CustomInput from "app/components/v2/DailyPreWater/CustomInput"
import { Checkbox, Divider } from "react-native-paper"
import { ScrollView } from "react-native-gesture-handler"
import { useNavigation, useRoute } from "@react-navigation/native"
import InstructionModal from "app/components/v2/InstructionModal"
import ActivityModal from "app/components/v2/ActivitylogModal"
import { KeyboardAvoidingView } from "react-native"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface HaccpLineFormScreenProps extends AppStackScreenProps<"HaccpLineForm"> {}

export const HaccpLineFormScreen: FC<HaccpLineFormScreenProps> = observer(
  function HaccpLineFormScreen() {
    const route = useRoute().params
    const navigation = useNavigation()
    const [showinstruction, setShowInstruction] = useState(true)
    const [showActivitylog, setShowActivitylog] = useState(false)
    const [form, setForm] = useState({
      side_wall: "",
      air_pressure: "",
      tem_preform: "",
      tw_pressure: "",
      FG: "",
      over_control: null,
      under_control: null,
      instruction: "",
    })

    const [errors, setErrors] = useState({
      side_wall: true,
      air_pressure: true,
      tem_preform: true,
      tw_pressure: true,
      FG: true,
      over_control: true,
      under_control: true,
      instruction: true,
    })
    useLayoutEffect(() => {
      navigation.setOptions({
        headerShown: true,
        title: "Line - " + route?.line?.toString(),
        headerRight: () => (
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => {
              const errorlists = errors

              const notValid = Object.values(errorlists).some((err) => err === false)

              if (notValid) {
                return
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
    }, [route, navigation, errors])

    return (
      <KeyboardAvoidingView behavior={"padding"} keyboardVerticalOffset={100} style={$root}>
        <ScrollView>
          <View style={[$outerContainer]}>
            {[4, 5, 6].includes(route?.line) && (
              <>
                <ActivityBar
                  direction="end"
                  showInfo
                  onClickinfo={() => setShowInstruction(true)}
                  onActivity={() => setShowActivitylog(true)}
                />
                <Divider style={{ marginVertical: 30, backgroundColor: "#A49B9B" }} />
                <View style={{ rowGap: 50 }}>
                  <View style={$containerHorizon}>
                    <View style={$width}>
                      <CustomInput
                        keyboardType="decimal-pad"
                        hintLimit="100 - 110%"
                        showIcon={false}
                        value={form.side_wall?.toString() || ""}
                        onBlur={() => {
                          form.side_wall !== ""
                            ? setErrors((pre) => ({ ...pre, side_wall: false }))
                            : setErrors((pre) => ({ ...pre, side_wall: true }))
                        }}
                        onChangeText={(text) => {
                          form.side_wall !== ""
                            ? setErrors((pre) => ({ ...pre, side_wall: false }))
                            : setErrors((pre) => ({ ...pre, side_wall: true }))

                          setForm((pre) => ({ ...pre, side_wall: text.trim() }))
                        }}
                        label="Side-wall"
                        errormessage={errors?.side_wall ? "សូមជ្រើសរើស side wall" : ""}
                      />
                    </View>
                    <View style={$width}>
                      <CustomInput
                        keyboardType="decimal-pad"
                        hintLimit="> 1.5 Bar"
                        value={form.air_pressure?.toString() || ""}
                        showIcon={false}
                        onBlur={() => {
                          form.air_pressure !== ""
                            ? setErrors((pre) => ({ ...pre, air_pressure: false }))
                            : setErrors((pre) => ({ ...pre, air_pressure: true }))
                        }}
                        onChangeText={(text) => {
                          form.air_pressure !== ""
                            ? setErrors((pre) => ({ ...pre, air_pressure: false }))
                            : setErrors((pre) => ({ ...pre, air_pressure: true }))

                          setForm((pre) => ({ ...pre, air_pressure: text.trim() }))
                        }}
                        label="Air Pressure"
                        errormessage={errors?.air_pressure ? "សូមជ្រើសរើស Air Pressure" : ""}
                      />
                    </View>
                    <View style={$width}>
                      <CustomInput
                        keyboardType="decimal-pad"
                        hintLimit="100 - 110%"
                        showIcon={false}
                        value={form.tem_preform?.toString() || ""}
                        onBlur={() => {
                          form.tem_preform !== ""
                            ? setErrors((pre) => ({ ...pre, tem_preform: false }))
                            : setErrors((pre) => ({ ...pre, tem_preform: true }))
                        }}
                        onChangeText={(text) => {
                          form.tem_preform !== ""
                            ? setErrors((pre) => ({ ...pre, tem_preform: false }))
                            : setErrors((pre) => ({ ...pre, tem_preform: true }))

                          setForm((pre) => ({ ...pre, tem_preform: text.trim() }))
                        }}
                        label="Temperature Preform"
                        errormessage={errors?.tem_preform ? "សូមជ្រើសរើស Temperature Preform" : ""}
                      />
                    </View>
                  </View>
                  <View style={$containerHorizon}>
                    <View style={$width}>
                      <CustomInput
                        keyboardType="decimal-pad"
                        value={form.tw_pressure?.toString() || ""}
                        showIcon={false}
                        onBlur={() => {
                          form.tw_pressure !== ""
                            ? setErrors((pre) => ({ ...pre, tw_pressure: false }))
                            : setErrors((pre) => ({ ...pre, tw_pressure: true }))
                        }}
                        onChangeText={(text) => {
                          form.tw_pressure !== ""
                            ? setErrors((pre) => ({ ...pre, tw_pressure: false }))
                            : setErrors((pre) => ({ ...pre, tw_pressure: true }))

                          setForm((pre) => ({ ...pre, tw_pressure: text.trim() }))
                        }}
                        hintLimit="> 1.5 bar / flow scale > 3"
                        label="Treated Water Pressure"
                        errormessage={
                          errors?.tw_pressure ? "សូមជ្រើសរើស Treated Water Pressure" : ""
                        }
                      />
                    </View>
                    <View style={$width}>
                      <CustomInput
                        keyboardType="decimal-pad"
                        showIcon={false}
                        value={form.FG?.toString() || ""}
                        hintLimit="0.05 - 0.4 ppm"
                        onBlur={() => {
                          form.FG !== ""
                            ? setErrors((pre) => ({ ...pre, FG: false }))
                            : setErrors((pre) => ({ ...pre, FG: true }))
                        }}
                        onChangeText={(text) => {
                          form.FG !== ""
                            ? setErrors((pre) => ({ ...pre, FG: false }))
                            : setErrors((pre) => ({ ...pre, FG: true }))

                          setForm((pre) => ({ ...pre, FG: text.trim() }))
                        }}
                        label="FG [ O3 ]"
                        errormessage={errors?.FG ? "សូមជ្រើសរើស FG [ O3 ]" : ""}
                      />
                    </View>
                    <View style={[$width, { marginTop: 20 }]}>
                      <Text style={{ margin: 0, fontSize: 18 }}>Activity Control</Text>

                      <View style={[$containerHorizon, { marginTop: 10 }]}>
                        <TouchableOpacity
                          style={$containerHorizon}
                          onPress={() => {
                            if (!form.over_control) {
                              setForm((pre) => ({
                                ...pre,
                                over_control: true,
                                under_control: false,
                              }))
                            } else {
                              setForm((pre) => ({
                                ...pre,
                                over_control: true,
                                under_control: false,
                              }))
                            }

                            setErrors((pre) => ({ ...pre, over_control: false }))
                          }}
                        >
                          <Checkbox
                            status={
                              !form?.over_control
                                ? false
                                : form?.over_control
                                ? "checked"
                                : "unchecked"
                            }
                            onPress={() => {
                              if (!form.over_control) {
                                setForm((pre) => ({
                                  ...pre,
                                  over_control: true,
                                  under_control: false,
                                }))
                              } else {
                                setForm((pre) => ({
                                  ...pre,
                                  over_control: true,
                                  under_control: false,
                                }))
                              }

                              setErrors((pre) => ({ ...pre, over_control: false }))
                            }}
                            color="#0081F8"
                          />
                          <Text>Overcontrol</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={$containerHorizon}
                          onPress={() => {
                            if (!form.under_control) {
                              setForm((pre) => ({
                                ...pre,
                                under_control: true,
                                over_control: false,
                              }))
                            } else {
                              setForm((pre) => ({
                                ...pre,
                                under_control: true,
                                over_control: false,
                              }))
                            }

                            setErrors((pre) => ({ ...pre, under_control: false }))
                          }}
                        >
                          <Checkbox
                            status={
                              !form?.under_control
                                ? false
                                : form?.under_control
                                ? "checked"
                                : "unchecked"
                            }
                            onPress={() => {
                              if (!form.under_control) {
                                setForm((pre) => ({
                                  ...pre,
                                  under_control: true,
                                  over_control: false,
                                }))
                              } else {
                                setForm((pre) => ({
                                  ...pre,
                                  under_control: true,
                                  over_control: false,
                                }))
                              }

                              setErrors((pre) => ({ ...pre, under_control: false }))
                            }}
                            color="#0081F8"
                          />
                          <Text>UnderControl</Text>
                        </TouchableOpacity>
                      </View>
                      <Text errorColor caption1 style={{ marginTop: 10 }}>
                        {errors?.over_control && errors?.under_control ? "*សូម​ត្រួតពិនិត្យ" : ""}
                      </Text>
                    </View>
                  </View>

                  <View style={$containerHorizon}>
                    <View style={$width}>
                      <CustomInput
                        showIcon={false}
                        onChangeText={(text) => {}}
                        label="Instruction "
                        errormessage={""}
                      />
                    </View>
                  </View>
                </View>
              </>
            )}

            {[2, 3].includes(route?.line) && (
              <>
                <ActivityBar
                  direction="end"
                  showInfo
                  onClickinfo={() => setShowInstruction(true)}
                  onActivity={() => setShowActivitylog(true)}
                />

                <Text title3>Bottle and Cap rinsing</Text>
                <Divider style={{ marginVertical: 30, backgroundColor: "#A49B9B" }} />
                <View style={{ rowGap: 25 }}>
                  <View style={$containerHorizon}>
                    <View style={$width}>
                      <CustomInput
                        showIcon={false}
                        onChangeText={(text) => {}}
                        label="Water Pressure"
                        hintLimit="> 1.0 bar"
                        errormessage={"សូមជ្រើសរើស water pressure"}
                      />
                    </View>
                    <View style={$width}>
                      <CustomInput
                        showIcon={false}
                        onChangeText={(text) => {}}
                        hintLimit="No one clog of 32/40"
                        label="Nozzies rinser"
                        errormessage={"សូមជ្រើសរើស nozzies rinser"}
                      />
                    </View>
                  </View>

                  <Text title3>Filling and Capping</Text>
                  <Divider style={{ marginVertical: 5, backgroundColor: "#A49B9B" }} />

                  <View style={$containerHorizon}>
                    <View style={$width}>
                      <CustomInput
                        hintLimit="0.05 - 0.4 ppm"
                        showIcon={false}
                        onChangeText={(text) => {}}
                        label="FG [ O3 ] "
                        errormessage={"សូមជ្រើសរើស FG"}
                      />
                    </View>

                    <View style={[$width, { marginTop: 20 }]}>
                      <Text style={{ margin: 5, fontSize: 18 }}>Activity Control</Text>

                      <View style={[$containerHorizon, { marginTop: 10 }]}>
                        <TouchableOpacity style={$containerHorizon} onPress={() => {}}>
                          <Checkbox status={"unchecked"} onPress={() => {}} color="#0081F8" />
                          <Text>Smell</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={$containerHorizon} onPress={() => {}}>
                          <Checkbox status={"unchecked"} onPress={() => {}} color="#0081F8" />
                          <Text>Overcontrol</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={$containerHorizon} onPress={() => {}}>
                          <Checkbox status={"unchecked"} onPress={() => {}} color="#0081F8" />
                          <Text>UnderControl</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  <View style={$containerHorizon}>
                    <View style={$width}>
                      <CustomInput
                        showIcon={false}
                        onChangeText={(text) => {}}
                        label="Take Action  "
                        errormessage={""}
                      />
                    </View>
                    <View style={$width}>
                      <CustomInput
                        showIcon={false}
                        onChangeText={(text) => {}}
                        label="Other "
                        errormessage={""}
                      />
                    </View>
                  </View>
                </View>
              </>
            )}

            <ActivityModal isVisible={showActivitylog} onClose={() => setShowActivitylog(false)} />
            <InstructionModal
              isVisible={showinstruction}
              key={Date.now().toString()}
              onClose={() => setShowInstruction(false)}
            />
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
