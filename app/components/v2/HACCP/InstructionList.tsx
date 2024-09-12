import { View,Text } from "react-native"
import React, { useEffect, useState } from "react"
import { List } from "react-native-paper"
import { useTheme } from "app/theme-v2"
import { translate } from "../../../i18n/translate"
import { useStores } from "app/models"

const InstructionList = ({
  showinstruction,
  handleToggle,
  group_list
}: {
  showinstruction: boolean
  handleToggle: () => void
  group_list: string
}) => {
  const { haccpLinesStore } = useStores()
  const { colors } = useTheme()
  // const tasks = [
  //    translate("haccpMonitoring.instructionDetail.first"),
  //    translate("haccpMonitoring.instructionDetail.second"),
  //    translate("haccpMonitoring.instructionDetail.third"),
  //    translate("haccpMonitoring.instructionDetail.fourth")
  // ]
  const [tasks, setTasks] = useState([])
  useEffect(() => {
    const getInstruction = async () => {
      const rs = await haccpLinesStore.getinstruction(group_list)
      setTasks(rs)
    }
    getInstruction()
  }, [])

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
              <Text style={{fontSize:17,marginTop:10,marginBottom:10}}>{index + 1} . {task.instruction}</Text>
              {/* <Text>{index + 1} .</Text> */}
              {/* <List.Item title={index + 1 + ". " + task.instruction} /> */}
            </View>
          ))}
        </List.Accordion>
      </List.Section>
    </View>
  )
}

export default InstructionList
