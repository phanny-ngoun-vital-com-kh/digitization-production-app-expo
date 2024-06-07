import React, { FC, useLayoutEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import Icon from "react-native-vector-icons/Ionicons"
import { AppStackScreenProps } from "app/navigators"
import { Text } from "app/components/v2"
import { View, ViewStyle, TouchableOpacity, KeyboardAvoidingView } from "react-native"
import ActivityBar from "app/components/v2/WaterTreatment/ActivityBar"
import CustomInput from "app/components/v2/DailyPreWater/CustomInput"
import { Checkbox, Divider, List } from "react-native-paper"
import { ScrollView } from "react-native-gesture-handler"
import { useNavigation, useRoute } from "@react-navigation/native"
import ActivityModal from "app/components/v2/ActivitylogModal"
import { useTheme } from "app/theme-v2"
import InstructionList from "app/components/v2/HACCP/InstructionList"
import {
  HaccpMonitoringModel,
  LinesItemModel,
} from "app/models/haccp-monitoring/haccp-monitoring-model"
import { getCurrentTime } from "app/utils-v2/getCurrTime"
import { useStores } from "app/models"
import { ALERT_TYPE, Dialog } from "react-native-alert-notification"
import { getResultImageCamera, getResultImageGallery } from "app/utils-v2/ocr"
interface HaccpLineFormScreenProps extends AppStackScreenProps<"HaccpLineForm"> {}
export const HaccpLineFormScreen: FC<HaccpLineFormScreenProps> = observer(
  function HaccpLineFormScreen() {
    const route = useRoute().params
    const { linesStore } = useStores()
    const { colors } = useTheme()
    const navigation = useNavigation()
    const [showinstruction, setShowInstruction] = useState(true)
    const [showActivitylog, setShowActivitylog] = useState(false)
    const [formLineA, setFormLineA] = useState({
      side_wall: "",
      air_pressure: "",
      tem_preform: "",
      tw_pressure: "",
      FG: "",
      over_control: null,
      under_control: null,
      instruction: "",
    })
    const [formLineB, setFormLineB] = useState({
      water_pressure: "",
      nozzie_rinser: "",
      FG: "",
      over_control: null,
      under_control: null,
      smell: null,
      instruction: "",
      other: "",
    })
    const [errorsLineB, setErrorsLineB] = useState({
      water_pressure: true,
      nozzie_rinser: true,
      FG: true,
      over_control: true,
      under_control: true,
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
      over_control: true,
      under_control: true,
      instruction: true,
    })

    const validateLineA = (errorsLineA) => {
      const errorlists = errorsLineA
      delete errorlists.instruction

      const notvalid = Object.values(errorlists).some((err) => err === true)

      if (notvalid) {
        return
      }
      // console.log("click")

      // console.log(formLineB, formLineA)
      // navigation.goBack()
    }

    const validateLineB = (errorsLineB) => {
      const errorlists = errorsLineB
      delete errorlists.instruction
      delete errorlists.other
      const notvalid = Object.values(errorlists).some((err) => err === true)
      if (notvalid) {
        return
      }
      const lineModel = LinesItemModel.create({
        id: Date.now(),
        side_wall: +formLineB.water_pressure,
        bottle_cap_rinsing: {
          nozzies_rinser: +formLineB.nozzie_rinser,
          water_pressure: +formLineB.water_pressure,
        },
        created_at: new Date(Date.now()).toISOString(),
        line: "line " + route?.line || "line 0",
        time: getCurrentTime(),
        filling_cap: {
          FG: +formLineB.FG,
          over_control: formLineB.over_control,
          under_control: formLineB.under_control,
          smell: formLineB.smell,
        },
        FG: +formLineB.FG,
        status: "normal",

        instruction: formLineB.instruction || "N/A",
        other: formLineB.other,
        activity_control: {
          over_control: formLineB.over_control,
          under_control: formLineB.under_control,
        },
      })
      // lineModel.reset()
      // console.log('reseting',lineModel)

      // const payload = HaccpMonitoringModel.create({
      //   date: new Date(Date.now()).toISOString(),
      //   id: 2,
      //   name: "line " + route?.line ?? "Line A",
      //   lines: [lineModel],
      // })

      console.log("adding line")
      // console.log('payload',payload)

      linesStore.add(2, "line " + route?.line ?? "Line A", date, lineModel)
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: "ជោគជ័យ",
        textBody: "រក្សាទុកបានជោគជ័យ",
        // button: 'close',
        autoClose: 200,
      })
      // navigation.goBack()
    }

    const onShowInstruction = () => {
      setShowInstruction((pre) => !pre)
    }
    const onlaunchGallery = async () => {
      try {
        const result = await getResultImageGallery()
        if (!result.canceled) {
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
        const result = await getResultImageCamera()
        if (!result.canceled) {
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
    useLayoutEffect(() => {
      navigation.setOptions({
        headerShown: true,
        title: "Line - " + route?.line?.toString(),
        headerRight: () => (
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
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
              Save
            </Text>
          </TouchableOpacity>
        ),
      })
    }, [route, navigation, errorsLineA, errorsLineB])

    return (
      <KeyboardAvoidingView behavior={"padding"} keyboardVerticalOffset={100} style={$root}>
        <ScrollView showsVerticalScrollIndicator persistentScrollbar stickyHeaderIndices={[]}>
          <View style={[$outerContainer]}>
            {[4, 5, 6].includes(+route?.line) && (
              <>
                <ActivityBar
                  direction="end"
                  showInfo
                  onAttachment={onlaunchGallery}
                  onScanCamera={onlaunchCamera}
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
                        value={formLineA.side_wall?.toString() || ""}
                        onBlur={() => {
                          formLineA.side_wall !== ""
                            ? setErrorsLineA((pre) => ({ ...pre, side_wall: false }))
                            : setErrorsLineA((pre) => ({ ...pre, side_wall: true }))
                        }}
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
                        keyboardType="decimal-pad"
                        hintLimit="> 1.5 Bar"
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
                        errormessage={errorsLineA?.air_pressure ? "សូមជ្រើសរើស Air Pressure" : ""}
                      />
                    </View>
                    <View style={$width}>
                      <CustomInput
                        keyboardType="decimal-pad"
                        hintLimit="100 - 110%"
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
                        keyboardType="decimal-pad"
                        value={formLineA.tw_pressure?.toString() || ""}
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
                        keyboardType="decimal-pad"
                        showIcon={false}
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
                        label="FG [ O3 ]"
                        errormessage={errorsLineA?.FG ? "សូមជ្រើសរើស FG [ O3 ]" : ""}
                      />
                    </View>
                    <View style={[$width, { marginTop: 20 }]}>
                      <Text style={{ margin: 0, fontSize: 18 }} semibold>
                        Activity Control
                      </Text>

                      <View style={$containerHorizon}>
                        <View>
                          <Text style={{ marginTop: 10 }} semibold body2>
                            <Text errorColor>*</Text> Under Control
                          </Text>
                          <View style={[$containerHorizon, { marginTop: 10, gap: 0 }]}>
                            <View style={[$containerHorizon, { marginTop: 10, margin: 0, gap: 0 }]}>
                              <TouchableOpacity
                                style={$containerHorizon}
                                onPress={() => {
                                  setErrorsLineA((pre) => ({ ...pre, under_control: false }))
                                  setFormLineA((pre) => ({
                                    ...pre,
                                    under_control: true,
                                  }))
                                }}
                              >
                                <Checkbox
                                  status={
                                    formLineA?.under_control === null
                                      ? "unchecked"
                                      : formLineA?.under_control
                                      ? "checked"
                                      : "unchecked"
                                  }
                                  onPress={() => {
                                    setErrorsLineA((pre) => ({ ...pre, under_control: false }))
                                    setFormLineA((pre) => ({
                                      ...pre,
                                      under_control: true,
                                    }))
                                  }}
                                  color="#0081F8"
                                />
                                <Text>Yes </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={$containerHorizon}
                                onPress={() => {
                                  setErrorsLineA((pre) => ({ ...pre, under_control: false }))
                                  setFormLineA((pre) => ({
                                    ...pre,
                                    under_control: false,
                                  }))
                                }}
                              >
                                <Checkbox
                                  status={
                                    formLineA?.under_control === null
                                      ? "unchecked"
                                      : !formLineA?.under_control
                                      ? "checked"
                                      : "unchecked"
                                  }
                                  onPress={() => {
                                    setErrorsLineA((pre) => ({ ...pre, under_control: false }))
                                    setFormLineA((pre) => ({
                                      ...pre,
                                      under_control: false,
                                    }))
                                  }}
                                  color="#0081F8"
                                />
                                <Text>No</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                        <View>
                          <Text style={{ marginTop: 10 }} semibold body2>
                            <Text errorColor>*</Text> Over Control
                          </Text>
                          <View style={[$containerHorizon, { marginTop: 10, gap: 0 }]}>
                            <View style={[$containerHorizon, { marginTop: 10, margin: 0, gap: 0 }]}>
                              <TouchableOpacity
                                style={$containerHorizon}
                                onPress={() => {
                                  setErrorsLineA((pre) => ({ ...pre, over_control: false }))
                                  setFormLineA((pre) => ({
                                    ...pre,
                                    over_control: true,
                                  }))
                                }}
                              >
                                <Checkbox
                                  status={
                                    formLineA?.over_control === null
                                      ? "unchecked"
                                      : formLineA?.over_control
                                      ? "checked"
                                      : "unchecked"
                                  }
                                  onPress={() => {
                                    setErrorsLineA((pre) => ({ ...pre, over_control: false }))
                                    setFormLineA((pre) => ({
                                      ...pre,
                                      over_control: true,
                                    }))
                                  }}
                                  color="#0081F8"
                                />
                                <Text>Yes </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={$containerHorizon}
                                onPress={() => {
                                  setErrorsLineA((pre) => ({ ...pre, over_control: false }))
                                  setFormLineA((pre) => ({
                                    ...pre,
                                    over_control: false,
                                  }))
                                }}
                              >
                                <Checkbox
                                  status={
                                    formLineA?.over_control === null
                                      ? "unchecked"
                                      : !formLineA?.over_control
                                      ? "checked"
                                      : "unchecked"
                                  }
                                  onPress={() => {
                                    setErrorsLineA((pre) => ({ ...pre, over_control: false }))
                                    setFormLineA((pre) => ({
                                      ...pre,
                                      over_control: false,
                                    }))
                                  }}
                                  color="#0081F8"
                                />
                                <Text>No</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      </View>
                      <Text errorColor caption1 style={{ marginTop: 10 }}>
                        {errorsLineA?.over_control && errorsLineA?.under_control
                          ? "*សូម​ត្រួតពិនិត្យ"
                          : ""}
                      </Text>
                    </View>
                  </View>

                  <View style={$containerHorizon}>
                    <View style={$width}>
                      <CustomInput
                        showIcon={false}
                        showAsterick={false}
                        onChangeText={(text) => {}}
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
                  <ActivityBar
                    direction="end"
                    showInfo
                    onAttachment={onlaunchGallery}
                    onScanCamera={onlaunchCamera}
                    onClickinfo={() => setShowInstruction(true)}
                    onActivity={() => setShowActivitylog(true)}
                  />
                </View>

                <Divider style={{ marginVertical: 30, backgroundColor: "#A49B9B" }} />
                <View style={{ rowGap: 25 }}>
                  <View style={$containerHorizon}>
                    <View style={$width}>
                      <CustomInput
                        showIcon={false}
                        keyboardType="decimal-pad"
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
                        showIcon={false}
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

                  <View style={[$containerHorizon, { gap: 0 }]}>
                    <View style={$width}>
                      <CustomInput
                        hintLimit="0.05 - 0.4 ppm"
                        showIcon={false}
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

                    <View style={[$width, { marginTop: 20 }]}>
                      <Text style={{ margin: 5, fontSize: 18 }} semibold>
                        Activity Control
                      </Text>

                      <View style={$containerHorizon}>
                        <View>
                          <Text style={{ marginTop: 10 }} semibold body2>
                            <Text errorColor>*</Text> Smell
                          </Text>
                          <View style={[$containerHorizon, { marginTop: 10, gap: 0 }]}>
                            <View style={[$containerHorizon, { marginTop: 10, margin: 0, gap: 0 }]}>
                              <TouchableOpacity
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
                                style={$containerHorizon}
                                onPress={() => {
                                  // console.log("change")
                                  setFormLineB((pre) => ({
                                    ...pre,
                                    smell: false,
                                  }))
                                }}
                              >
                                <Checkbox
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
                        </View>
                        <View>
                          <Text style={{ marginTop: 10 }} semibold body2>
                            <Text errorColor>*</Text> UnderConrol
                          </Text>
                          <View style={[$containerHorizon, { marginTop: 10, gap: 0 }]}>
                            <View style={[$containerHorizon, { marginTop: 10, margin: 0, gap: 0 }]}>
                              <TouchableOpacity
                                style={$containerHorizon}
                                onPress={() => {
                                  setErrorsLineB((pre) => ({ ...pre, under_control: false }))
                                  setFormLineB((pre) => ({
                                    ...pre,
                                    under_control: true,
                                  }))
                                }}
                              >
                                <Checkbox
                                  status={
                                    formLineB?.under_control === null
                                      ? "unchecked"
                                      : formLineB?.under_control
                                      ? "checked"
                                      : "unchecked"
                                  }
                                  onPress={() => {
                                    setErrorsLineB((pre) => ({ ...pre, under_control: false }))
                                    setFormLineB((pre) => ({
                                      ...pre,
                                      under_control: true,
                                    }))
                                  }}
                                  color="#0081F8"
                                />
                                <Text>Yes </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={$containerHorizon}
                                onPress={() => {
                                  // console.log("change")
                                  setFormLineB((pre) => ({
                                    ...pre,
                                    under_control: false,
                                  }))
                                }}
                              >
                                <Checkbox
                                  status={
                                    formLineB?.under_control === null
                                      ? "unchecked"
                                      : !formLineB?.under_control
                                      ? "checked"
                                      : "unchecked"
                                  }
                                  onPress={() => {
                                    setErrorsLineB((pre) => ({ ...pre, under_control: false }))
                                    setFormLineB((pre) => ({
                                      ...pre,
                                      under_control: false,
                                    }))
                                  }}
                                  color="#0081F8"
                                />
                                <Text>No</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>

                        <View>
                          <Text style={{ marginTop: 10 }} semibold body2>
                            <Text errorColor>*</Text> OverControl
                          </Text>
                          <View style={[$containerHorizon, { marginTop: 10, gap: 0 }]}>
                            <View style={[$containerHorizon, { marginTop: 10, margin: 0, gap: 0 }]}>
                              <TouchableOpacity
                                style={$containerHorizon}
                                onPress={() => {
                                  setErrorsLineB((pre) => ({ ...pre, over_control: false }))
                                  setFormLineB((pre) => ({
                                    ...pre,
                                    over_control: true,
                                  }))
                                }}
                              >
                                <Checkbox
                                  status={
                                    formLineB?.over_control === null
                                      ? "unchecked"
                                      : formLineB?.over_control
                                      ? "checked"
                                      : "unchecked"
                                  }
                                  onPress={() => {
                                    setErrorsLineB((pre) => ({ ...pre, over_control: false }))
                                    setFormLineB((pre) => ({
                                      ...pre,
                                      over_control: true,
                                    }))
                                  }}
                                  color="#0081F8"
                                />
                                <Text>Yes </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={$containerHorizon}
                                onPress={() => {
                                  // console.log("change")
                                  setFormLineB((pre) => ({
                                    ...pre,
                                    over_control: false,
                                  }))
                                }}
                              >
                                <Checkbox
                                  status={
                                    formLineB?.over_control != null && !formLineB?.over_control
                                      ? "checked"
                                      : "unchecked"
                                  }
                                  onPress={() => {
                                    setErrorsLineB((pre) => ({ ...pre, over_control: false }))
                                    setFormLineB((pre) => ({
                                      ...pre,
                                      over_control: false,
                                    }))
                                  }}
                                  color="#0081F8"
                                />
                                <Text>No</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      </View>

                      <Text errorColor caption1 style={{ marginTop: 10 }}>
                        {errorsLineB?.over_control &&
                        errorsLineB?.under_control &&
                        errorsLineB.smell
                          ? "*សូម​ត្រួតពិនិត្យ"
                          : ""}
                      </Text>
                    </View>
                  </View>

                  <View style={$containerHorizon}>
                    <View style={$width}>
                      <CustomInput
                        showIcon={false}
                        onChangeText={(text) => {}}
                        label="Take Action  "
                        showAsterick={false}
                        errormessage={""}
                      />
                    </View>
                    <View style={$width}>
                      <CustomInput
                        showIcon={false}
                        showAsterick={false}
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

            {/* <InstructionModal
              isVisible={showinstruction}
              key={Date.now().toString()}
              onClose={() => setShowInstruction(false)}
            /> */}
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
