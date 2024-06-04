import { View, Text } from "react-native"
import React from "react"
import { List } from "react-native-paper"
import { useTheme } from "app/theme-v2"

const InstructionList = ({
  showinstruction,
  handleToggle,
}: {
  showinstruction: boolean
  handleToggle: () => void
}) => {
  const { colors } = useTheme()
  const tasks = [
    "Check the treated water pressure for bottle rinsing from pressure gauge every 2 hours by Line Leader",
    "Check 32/40 nozzles to verify they are not clog if there is no clogged tick ✔ ",
    "Smell test of ozone after capping with bottling every 2 hours and Verify ozone concenstration with QC every 4 hours",
    "In case, ozone concentration or pressure is smaller than critical limit or there is one of them clogged, Line Leader must stop to find root cause and take action",
  ]
  return (
    <View style={{ marginVertical: 25 }}>
      <List.Section title="" style={{ backgroundColor: "#F6F6F6" }}>
        <List.Accordion
          id={1}
          titleStyle={{ color: "white", fontSize: 16 }}
          title="Instruction"
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
