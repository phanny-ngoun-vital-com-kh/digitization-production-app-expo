import React, { FC, useLayoutEffect, useState } from "react"
import Icon from "react-native-vector-icons/Ionicons"
import { observer } from "mobx-react-lite"
import { AppStackScreenProps } from "app/navigators"
import { View, ViewStyle, TouchableOpacity} from "react-native"
import { Text } from "app/components/v2"
import ActivityBar from "app/components/v2/WaterTreatment/ActivityBar"
import { useNavigation, useRoute } from "@react-navigation/native"
import CustomInput from "app/components/v2/DailyPreWater/CustomInput"
import { Checkbox } from "react-native-paper"
import { KeyboardAvoidingView } from "react-native"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface PreWaterForm1ScreenProps extends AppStackScreenProps<"PreWaterForm1"> {}

export const PreWaterForm1Screen: FC<PreWaterForm1ScreenProps> = observer(
  function PreWaterForm1Screen() {
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
    })

    const [errors, setErrors] = useState({
      sf1: true,
      sf2: true,
      acf1: true,
      acf2: true,
      tenMm1: true,
      tenMm2: true,
    })
    useLayoutEffect(() => {
      navigation.setOptions({
        headerShown: true,
        title: "PH",

        headerRight: () => (
          <TouchableOpacity
            style={$horizon}
            onPress={() => {
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
    }, [])
    return (
      <KeyboardAvoidingView behavior= {"padding"}
      keyboardVerticalOffset={100}
      
      
      style={$root}>
        <View style={$outerContainer}>
          <ActivityBar direction="end" onActivity={() => setShowlog(true)} />

          {route?.type?.toLowerCase().includes("air") ? (
            <>
              <View style={{gap:15}}>
                <View style={[ { marginVertical:15 }]}>
                  <Text body1 regular>
                    Air Release Y / N
                  </Text>

                  <View style={[$horizon,{marginTop:20}]}>
                    <TouchableOpacity style={$horizon} onPress={() => {}}>
                      <View style={{ transform: [{ scale: 1.5 }] }}>
                        <Checkbox status={"unchecked"} onPress={() => {}} color="#0081F8" />
                      </View>
                      <Text body2>SF</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={$horizon} onPress={() => {}}>
                      <View style={{ transform: [{ scale: 1.5 }] }}>
                        <Checkbox status={"unchecked"} onPress={() => {}} color="#0081F8" />
                      </View>

                      <Text body2>ACF</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={$horizon} onPress={() => {}}>
                      <View style={{ transform: [{ scale: 1.5 }] }}>
                        <Checkbox status={"unchecked"} onPress={() => {}} color="#0081F8" />
                      </View>
                      <Text body2>Resin</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={$horizon}>
                  <View style={{flex:0.5}}>
                    <CustomInput
                      showIcon={false}
                      onChangeText={(text) => {}}
                      label="Remark"
                      errormessage={"សូមជ្រើសរើស Remark"}
                      />
                  </View>
                </View>
             
              </View>
            </>
          ) : (
            <>
              <View style={$horizon}>
                <View style={$width}>
                  <CustomInput
                    showIcon={false}
                    onChangeText={(text) => {}}
                    label="SF"
                    errormessage={"សូមជ្រើសរើស SF"}
                  />
                </View>
                <View style={$width}>
                  <CustomInput
                    showIcon={false}
                    onChangeText={(text) => {}}
                    label="SF"
                    errormessage={"សូមជ្រើសរើស SF"}
                  />
                </View>
              </View>

              <View style={$horizon}>
                <View style={$width}>
                  <CustomInput
                    showIcon={false}
                    onChangeText={(text) => {}}
                    label="Resin"
                    errormessage={"សូមជ្រើសរើស resin"}
                  />
                </View>
                <View style={$width}>
                  <CustomInput
                    showIcon={false}
                    onChangeText={(text) => {}}
                    label="5Mm"
                    errormessage={"សូមជ្រើសរើស 5Mm"}
                  />
                </View>
                <View style={$width}>
                  <CustomInput
                    showIcon={false}
                    onChangeText={(text) => {}}
                    label="Remark"
                    errormessage={"សូមជ្រើសរើស Remark"}
                  />
                </View>
              </View>
            </>
          )}
        </View>
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
