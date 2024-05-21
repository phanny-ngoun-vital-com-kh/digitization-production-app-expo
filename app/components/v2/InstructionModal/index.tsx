import React from "react"
import Icon from "react-native-vector-icons/AntDesign"
import styles from "./styles"
import { Text } from "app/components/v2"
import { View, TextInput, Modal, ViewStyle, TouchableOpacity } from "react-native"
import Button from "../Button"
interface ActivityModalProps {
  isVisible: boolean
  onClose: () => void
}
const InstructionModal = ({ isVisible = true, onClose }: ActivityModalProps) => {
  const tasks = [
    "Check the treated water pressure for bottle rinsing from pressure gauge every 2 hours by Line Leader",
    "Check 32/40 nozzles to verify they are not clog if there is no clogged tick ✔ ",
    "Smell test of ozone after capping with bottling every 2 hours and Verify ozone concenstration with QC every 4 hours",
    "In case, ozone concentration or pressure is smaller than critical limit or there is one of them clogged, Line Leader must stop to find root cause and take action",
  ]
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => {
        onClose()
      }}
    >
      <View style={styles.container}>
        <View style={styles.model}>
          <View style={{ backgroundColor: "#0081F8", padding: 10 }}>
            <View style={$hori}>
              <View style={$hori}>
                <TouchableOpacity>
                  <Icon size={20.5} name="infocirlce" color={"white"} />
                </TouchableOpacity>
                <Text title3 whiteColor regular>
                  instruction
                </Text>
              </View>

              <View style={[$hori, { gap: 20 }]}>
                <TouchableOpacity onPress={() => onClose()}>
                  <Icon size={22.5} name="close" color={"white"} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={{paddingHorizontal:30,paddingVertical:25}}>
            {tasks.map((item, index) => (
              <View
                key={index.toString()}
                style={[$hori, { justifyContent: "flex-start", padding:0, paddingTop: 20 }]}
              >
                <Text subhead>{index + 1} .</Text>
                <Text subhead>{item}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  )
}

const $hori: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 10,
}

export default InstructionModal
