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
const ActivityModal = ({ isVisible = true, onClose }: ActivityModalProps) => {
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
              <Text title3 whiteColor regular>
                Activity Log
              </Text>

              <View style={[$hori,{gap:20}]}>
                <TouchableOpacity>
                  <Icon size={22.5} name="calendar" color={"white"} />
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>onClose()}>
                  <Icon size={22.5} name="close" color={"white"} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {Array.from({ length: 15 }, (item, index) => (
            <View style={[$hori, { justifyContent: "flex-start", padding: 10 }]} key={index.toString()}>
              <Text title1>{`\u2022 `}</Text>
              <Text body2>2024-05-11 08:00AM: Darith has created the form</Text>
            </View>
          ))}
        </View>
      </View>
    </Modal>
  )
}

const $hori: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  gap:10
}

export default ActivityModal
