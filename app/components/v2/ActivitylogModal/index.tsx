import React from "react"
import Icon from "react-native-vector-icons/AntDesign"
import styles from "./styles"
import { Text } from "app/components/v2"
import { View, Modal, ViewStyle, TouchableOpacity, ScrollView, FlatList } from "react-native"
import { Activities } from "app/models/water-treatment/water-treatment-model"
import moment from "moment"
import EmptyFallback from "app/components/EmptyFallback"
interface ActivityModalProps {
  isVisible: boolean
  onClose: () => void
  log: Activities[] | null
}
const ActivityModal = ({ isVisible = true, onClose, log = [] }: ActivityModalProps) => {
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

              <View style={[$hori, { gap: 20 }]}>
                <TouchableOpacity onPress={() => onClose()}>
                  <Icon size={22.5} name="close" color={"white"} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <FlatList
            data={log}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{
              paddingHorizontal:25
            }}
            ListEmptyComponent={<EmptyFallback placeholder="No Activity found for this Machine" />}
            renderItem={({ item, index }) => {
              return (
                <View
                  style={[
                    $hori,
                    { justifyContent: "flex-start", paddingHorizontal: 10, paddingVertical: 10 },
                  ]}
                  key={index.toString()}
                >
                  <Text title1>{`\u2022 `}</Text>
                  <Text body2>
                    {moment(item?.actionDate).format("LLL") ?? Date.now().toLocaleString()} :{" "}
                    {item?.actionBy} {item?.action}
                  </Text>
                </View>
              )
            }}
          />
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

export default ActivityModal
