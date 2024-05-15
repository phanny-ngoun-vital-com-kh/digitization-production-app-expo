import React, { FC, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { Checkbox } from "react-native-paper"
import { Platform, ScrollView, TouchableOpacity, View } from "react-native"
import { AppStackScreenProps, goBack } from "app/navigators"
import styles from "./styles"
import { useTheme } from "app/theme-v2"
// import { ActivitiesModel, ItemList, Warehouse } from "app/models/inventory-transfer-request/inventory-transfer-request-model"
import { ViewStyle } from "react-native"
import { TextInput } from ".."
import { Button } from "app/components/v2"
import { useStores } from "app/models"
import { WaterTreatmentModel } from "app/models/water-treatment/water-treatment-model"
import { ShiftModel } from "app/models/water-treatment/water-treatment-store"

const WaterTreatmentForm = ({
  data,
  handlePress,
  type,
}: {
  data: any
  handlePress: (item: any) => void
  type: string
}) => {
  const { waterTreatmentStore } = useStores()
  const { colors } = useTheme()
  // const [checked, setChecked] = useState(false)
  const [checked, setChecked] = useState({
    odor: false,
    taste: false,
    air: false,
  })
  const [validation, setValidation] = useState([])

  const [form, setForm] = useState({
    shift: null,
    time: null,
    type: "A",
    tsd_ppm: null,
    ph_level: null,
    temperature: null,
    checked_by: "Panhavorn",
    inspection_status: null,
    pressure: null,
    air_release: null,
    press_inlet: null,
    press_treat: null,
    press_drain: null,
    odor: null,
    taste: null,
    machines: "",
    other: null,
  })
  useEffect(() => {
    //clean up validation
    setValidation([])
  }, [form])

  useEffect(() => {
    setForm({ ...data })

    // return () =>
    //   setForm({
    //     shift: null,
    //     time: null,
    //     type: "A",
    //     tsd_ppm: null,
    //     ph_level: null,
    //     temperature: null,
    //     checked_by: "Panhavorn",
    //     inspection_status: null,
    //     pressure: null,
    //     air_release: null,
    //     press_inlet: null,
    //     press_treat: null,
    //     press_drain: null,
    //     odor: null,
    //     taste: null,
    //     machines: [],
    //     other: null,
    //   })
    //
  }, [])

  const validationForm = (form) => {
    let isvalid = true

    for (const key in form) {
      if (data.type === "A") {
        // For type A, only check tsd_ppm and ph_level for null or empty values
        if (
          (key === "tsd_ppm" || key === "ph_level" || key === "temperature") &&
          (!form[key] || form[key] === "" || form[key] === null)
        ) {
          setValidation((pre) => pre.concat({ error: key }))
          isvalid = false
        }
      } else if (!form[key] || form[key] === "" || form[key] === null) {
        // For other types, check all fields for null or empty values
        setValidation((pre) => pre.concat({ error: key }))
        isvalid = false
      }
    }

    return isvalid
  }
  const handleSubmit = () => {
    console.log(data.type)
    let payload

    // if (!validationForm(form)) {
    //   return
    // }
    if (data.type === "A") {
      payload = {
        ...form,
        tsd_ppm: Number(form.tsd_ppm),
        ph_level: Number(form.ph_level),
        temperature: Number(form.temperature),
        inspection_status: true,
        checked_by: "Vorn",
      }
    }
    if (data.type === "B") {
      payload = {
        ...form,
        inspection_status: true,
        tsd_ppm: Number(form.tsd_ppm),
        ph_level: Number(form.ph_level),
        temperature: Number(form.temperature),
        pressure: Number(form.pressure),
        checked_by: "Vorn",
        air_release: form.air_release,
      }
    }
    if (data.type === "C") {
      payload = {
        ...form,
        inspection_status: true,
        checked_by: "Vorn",
        tsd_ppm: Number(form.tsd_ppm),
        pressure: Number(form.pressure),
        temperature: Number(form.temperature),
        ph_level: Number(form.ph_level),
      }
    }
    if (data.type === "D") {
      payload = {
        ...form,
        inspection_status: true,
        checked_by: "Vorn",
        tsd_ppm: Number(form.tsd_ppm),
        pressure: Number(form.pressure),
        temperature: Number(form.temperature),
        ph_level: Number(form.ph_level),
        press_inlet: Number(form.press_inlet),
        press_treat: Number(form.press_treat),
        press_drain: Number(form.press_drain),
      }
    }
    handlePress(payload)
  }

  return (
    <View style={$root}>
      <View style={$containerHorizon}>
        <View style={{ width: "50%", marginRight: 10 }}>
          <View style={$containerHorizon}>
            <Text style={{ margin: 5, fontSize: 15 }}>TDS </Text>
            <Text style={{ margin: 0, fontSize: 15, color: "red" }}>{"*<= 300 ppm"} </Text>
          </View>
          <View style={$containerHorizon}>
            <Text style={{ margin: 0, fontSize: 15, color: "red" }}>
              {validation &&
              validation.map((validate) => validate.error).find((errors) => errors === "tsd_ppm")
                ? "សូមជ្រើសរើស TDS"
                : ""}

              {/* ទិន្នន័យមិនត្រឹមត្រូវ */}
            </Text>
          </View>
          <TextInput
            multiline={true}
            keyboardType="decimal-pad"
            value={form.tsd_ppm?.toString() ?? ""}
            style={[styles.input, { width: "100%" }]}
            placeholder="Please Enter"
            placeholderTextColor="gray"
            onChangeText={(text) => setForm((pre) => ({ ...pre, tsd_ppm: text }))}
          ></TextInput>
        </View>
        <View style={{ width: "50%", marginRight: 10 }}>
          <View style={$containerHorizon}>
            <Text style={{ margin: 5, fontSize: 15 }}>PH </Text>
            <Text style={{ margin: 0, fontSize: 15, color: "red" }}>{"( 6.5 - 8.5 )"} </Text>
          </View>
          <View style={$containerHorizon}>
            <Text style={{ margin: 0, fontSize: 15, color: "red" }}>
              {validation &&
              validation.map((validate) => validate.error).find((errors) => errors === "ph_level")
                ? "សូមជ្រើសរើស ph"
                : ""}
              {/* ទិន្នន័យមិនត្រឹមត្រូវ */}
            </Text>
          </View>
          <TextInput
            multiline={true}
            // value={remark}
            keyboardType="decimal-pad"
            value={form.ph_level?.toString() ?? ""}
            style={[styles.input, { width: "100%" }]}
            placeholder="Please Enter"
            placeholderTextColor="gray"
            onChangeText={(text) => setForm((pre) => ({ ...pre, ph_level: text }))}
          ></TextInput>
        </View>
      </View>

      {data?.type === "D" ? (
        <View style={$containerHorizon}>
          <View style={{ width: "24.2%", marginRight: 10 }}>
            <View>
              <Text style={{ margin: 5, fontSize: 15 }}>Press-inlet </Text>
              <Text style={{ margin: 0, fontSize: 15, color: "red" }}>{"( 0.01 - 1.5 Mpa )"}</Text>
            </View>

            <TextInput
              multiline={true}
              // value={remark}
              value={form?.press_inlet?.toString() ?? ""}
              keyboardType="decimal-pad"
              style={[styles.input, { width: "100%" }]}
              placeholder="Please Enter"
              placeholderTextColor="gray"
              onChangeText={(text) => {
                setForm((pre) => ({ ...pre, press_inlet: text }))
              }}
            ></TextInput>
            <View style={$containerHorizon}>
              <Text style={{ margin: 0, fontSize: 15, color: "red" }}>
                {validation &&
                validation
                  .map((validate) => validate.error)
                  .find((errors) => errors === "press_inlet")
                  ? "សូមជ្រើសរើស press inlet"
                  : ""}
                {/* ទិន្នន័យមិនត្រឹមត្រូវ */}
              </Text>
            </View>
          </View>
          <View style={{ width: "24.2%", marginRight: 10 }}>
            <View>
              <Text style={{ margin: 5, fontSize: 15 }}>Press-Treat </Text>
              <Text style={{ margin: 0, fontSize: 15, color: "red" }}>{"( 0.01 - 1.5 Mpa )"}</Text>
            </View>

            <TextInput
              multiline={true}
              // value={remark}
              value={form?.press_treat?.toString() ?? ""}
              keyboardType="decimal-pad"
              style={[styles.input, { width: "100%" }]}
              placeholder="Please Enter"
              placeholderTextColor="gray"
              onChangeText={(text) => {
                setForm((pre) => ({ ...pre, press_treat: text }))
              }}
            ></TextInput>
            <View style={$containerHorizon}>
              <Text style={{ margin: 0, fontSize: 15, color: "red" }}>
                {validation &&
                validation
                  .map((validate) => validate.error)
                  .find((errors) => errors === "press_treat")
                  ? "សូមជ្រើសរើស press treat"
                  : ""}
                {/* ទិន្នន័យមិនត្រឹមត្រូវ */}
              </Text>
            </View>
          </View>
          <View style={{ width: "24.2%", marginRight: 10 }}>
            <View>
              <Text style={{ margin: 5, fontSize: 15 }}>Press-Drain </Text>
              <Text style={{ margin: 0, fontSize: 15, color: "red" }}>{"( 0.01 - 1.5 Mpa )"}</Text>
            </View>

            <TextInput
              multiline={true}
              // value={remark}
              value={form?.press_drain?.toString() ?? ""}
              keyboardType="decimal-pad"
              style={[styles.input, { width: "100%" }]}
              placeholder="Please Enter"
              placeholderTextColor="gray"
              onChangeText={(text) => {
                setForm((pre) => ({ ...pre, press_drain: text }))
              }}
            ></TextInput>
            <View style={$containerHorizon}>
              <Text style={{ margin: 0, fontSize: 15, color: "red" }}>
                {validation &&
                validation
                  .map((validate) => validate.error)
                  .find((errors) => errors === "press_drain")
                  ? "សូមជ្រើសរើស press drain"
                  : ""}
                {/* ទិន្នន័យមិនត្រឹមត្រូវ */}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={$containerHorizon}>
          <View style={{ width: "50%", marginRight: 10 }}>
            <View style={$containerHorizon}>
              <Text style={{ margin: 5, fontSize: 15 }}>Temperature </Text>
              <Text style={{ margin: 0, fontSize: 15, color: "red" }}>{"( 24.2 - 35 ) °C"} </Text>
            </View>
            <View style={$containerHorizon}></View>
            <TextInput
              multiline={true}
              // value={remark}
              keyboardType="decimal-pad"
              value={form.temperature?.toString() ?? ""}
              style={[styles.input, { width: "100%" }]}
              placeholder="Please Enter"
              placeholderTextColor="gray"
              onChangeText={(text) => setForm((pre) => ({ ...pre, temperature: text }))}
            ></TextInput>
            <View style={$containerHorizon}>
              <Text style={{ margin: 0, fontSize: 15, color: "red" }}>
                {validation &&
                validation
                  .map((validate) => validate.error)
                  .find((errors) => errors === "temperature")
                  ? "សូមជ្រើសរើស temperature"
                  : ""}
                {/* ទិន្នន័យមិនត្រឹមត្រូវ */}
              </Text>
            </View>
          </View>
          <View style={{ width: "50%", marginRight: 10 }}>
            <View style={$containerHorizon}>
              <Text style={{ margin: 5, fontSize: 15 }}>Other </Text>
            </View>
            <View style={$containerHorizon}></View>
            <TextInput
              multiline={true}
              value={form?.other ?? ""}
              style={[styles.input, { width: "100%" }]}
              placeholder="Please Enter"
              placeholderTextColor="gray"
              onChangeText={(text) => setForm((pre) => ({ ...pre, other: text }))}
            ></TextInput>
            <View style={$containerHorizon}>
              <Text style={{ margin: 0, fontSize: 15, color: "red" }}></Text>
            </View>
          </View>
        </View>
      )}

      {data?.type === "B" && (
        <View style={$containerHorizon}>
          <View style={{ width: "50%", marginRight: 10 }}>
            <View style={$containerHorizon}>
              <Text style={{ margin: 5, fontSize: 15 }}>Pressure </Text>
              <Text style={{ margin: 0, fontSize: 15, color: "red" }}>{"( 24.2 - 35 ) °C"} </Text>
            </View>

            <TextInput
              multiline={true}
              // value={remark}
              keyboardType="decimal-pad"
              value={form.pressure?.toString() ?? ""}
              style={[styles.input, { width: "100%" }]}
              placeholder="Please Enter"
              placeholderTextColor="gray"
              onChangeText={(text) => {
                setForm((pre) => ({ ...pre, pressure: text }))
              }}
            ></TextInput>
            <View style={$containerHorizon}>
              <Text style={{ margin: 0, fontSize: 15, color: "red" }}>
                {validation &&
                validation.map((validate) => validate.error).find((errors) => errors === "pressure")
                  ? "សូមជ្រើសរើស pressure"
                  : ""}
                {/* ទិន្នន័យមិនត្រឹមត្រូវ */}
              </Text>
            </View>
          </View>
          <View style={{ width: "50%", marginRight: 10 }}>
            <View style={$containerHorizon}>
              <Text style={{ margin: 5, fontSize: 15 }}>Check List </Text>
            </View>
            <View style={{ transform: [{ scale: 1 }] }}>
              <Checkbox.Item
                label="Air Released"
                style={{ flexGrow: 1 }}
                color={colors.primary}
                status={form.air_release ? "checked" : "unchecked"}
                theme={{
                  animation: {
                    defaultAnimationDuration: 500,
                    scale: 1,
                  },
                }}
                onPress={() => {
                  // setChecked((pre) => ({ ...pre, air: !pre.air }))

                  setForm((pre) => ({ ...pre, air_release: !form.air_release }))
                }}
              />
            </View>
          </View>
        </View>
      )}
      {data?.type === "C" && (
        <View style={$containerHorizon}>
          <View style={{ width: "50%", marginRight: 10 }}>
            <View style={$containerHorizon}>
              <Text style={{ margin: 5, fontSize: 15 }}>Pressure </Text>
              <Text style={{ margin: 0, fontSize: 15, color: "red" }}>{"( 24.2 - 35 ) °C"} </Text>
            </View>

            <TextInput
              multiline={true}
              // value={remark}
              keyboardType="decimal-pad"
              value={form.pressure?.toString() ?? ""}
              style={[styles.input, { width: "100%" }]}
              placeholder="Please Enter"
              placeholderTextColor="gray"
              onChangeText={(text) => {
                setForm((pre) => ({ ...pre, pressure: text }))
              }}
            ></TextInput>
            <View style={$containerHorizon}>
              <Text style={{ margin: 0, fontSize: 15, color: "red" }}>
                {validation &&
                validation.map((validate) => validate.error).find((errors) => errors === "pressure")
                  ? "សូមជ្រើសរើស pressure"
                  : ""}
                {/* ទិន្នន័យមិនត្រឹមត្រូវ */}
              </Text>
            </View>
          </View>
        </View>
      )}

      {data?.type === "D" && (
        <View style={$containerHorizon}>
          <View style={{ width: "50%", marginRight: 10 }}>
            <Text style={{ margin: 5, fontSize: 15 }}>Check List </Text>

            <Checkbox.Item
              label="Odor"
              labelStyle={{ margin: 0, fontSize: 15 }}
              style={{ padding: 0, alignItems: "center", justifyContent: "center" }}
              color={colors.primary}
              status={form.odor ? "checked" : "unchecked"}
              theme={{
                animation: {
                  defaultAnimationDuration: 500,
                  scale: 1,
                },
              }}
              onPress={() => {
                setForm((pre) => ({ ...pre, odor: !form.odor }))
              }}
            />

            <Checkbox.Item
              label="Smell"
              style={{}}
              labelStyle={{ margin: 0, fontSize: 15 }}
              color={colors.primary}
              status={form.taste ? "checked" : "unchecked"}
              theme={{
                animation: {
                  defaultAnimationDuration: 500,
                  scale: 1,
                },
              }}
              onPress={() => {
                setForm((pre) => ({ ...pre, taste: !form.taste }))
              }}
            />
          </View>
        </View>
      )}
      <View
        style={{
          flexDirection: "row",

          justifyContent: "flex-end",
          marginRight: 0,
        }}
      >
        <Button style={{ width: "100%" }} onPress={handleSubmit}>
          Submit
        </Button>
      </View>
    </View>
  )
}

const $root: ViewStyle = {
  flex: 1,
  backgroundColor: "#fff",
}

const $outerContainer: ViewStyle = {
  margin: 15,
  marginTop: 20,
  padding: 10,
}

const $textHeader: TextStyle = {
  fontSize: 18,
  color: "black",
}
const $containerHorizon: ViewStyle = {
  flexDirection: "row",
  marginBottom: 10,
  alignItems: "center",
}
export default WaterTreatmentForm
