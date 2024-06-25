import { View } from "react-native"
import React from "react"
import { List } from "react-native-paper"
import { useTheme } from "app/theme-v2"
import {translate} from "../../../i18n/translate"
const InstructionList = ({
  showinstruction,
  handleToggle,
}: {
  showinstruction: boolean
  handleToggle: () => void
}) => {
  const { colors } = useTheme()
  const tasks = [
     translate("haccpMonitoring.instructionDetail.first"),
     translate("haccpMonitoring.instructionDetail.second"),
     translate("haccpMonitoring.instructionDetail.third"),
     translate("haccpMonitoring.instructionDetail.fourth")
  ]
  return (
    <View style={{ marginVertical: 25 }}>
      <List.Section title="" style={{ backgroundColor: "#F6F6F6" }}>
        <List.Accordion
          id={1}
          titleStyle={{ color: "white", fontSize: 16 }}
          title={translate("haccpMonitoring.instruction")}
          style={{ backgroundColor: colors.primary }}
          left={(props) => <List.Icon {...props} icon="folder" color="white" />}
          expanded={showinstruction}
          theme={{ colors: { text: "red" } }}
          right={(props) => (
            <List.Icon
              {...props}
              icon={showinstruction ? "chevron-up" : "chevron-down"}
              color="white"
            />
          )}
          onPress={handleToggle}
        >
          {tasks.map((task, index) => (
            <View key={index}>
              {/* <Text subhead>{index + 1} .</Text> */}

              <List.Item title={index + 1 + "/. " + task} />
            </View>
          ))}
        </List.Accordion>
      </List.Section>
    </View>
  )
}

export default InstructionList
