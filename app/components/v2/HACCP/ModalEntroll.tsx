import { Dropdown } from "react-native-element-dropdown"
import * as React from "react"
import { View, ViewStyle } from "react-native"
import { Button, Text } from "app/components/v2"
import { Modal } from "react-native-paper"
const ModalEnroll = ({
  isVisible,
  showModal,
  hideModal,
  onComfirm,
  onCancel,
  times,
  onSelect,
}: {
  isVisible: boolean
  showModal?: () => void
  hideModal?: () => void
  onComfirm?: () => void
  onCancel?: () => void
  times: any[]
  onSelect?: () => void
}) => {
  return (
    <Modal visible={isVisible} onDismiss={hideModal} contentContainerStyle={$containerStyle}>
      <View
        style={{
          backgroundColor: "white",
          paddingVertical: 35,
          width: "30%",
          paddingHorizontal: 40,
          gap: 15,
        }}
      >
        <Text title3 semibold>
          Comfirmation
        </Text>
        <Text caption1>you will be assign to this line please comfirm again</Text>


        <View style={{ flexDirection: "row", gap: 15 }}>
          <Button style={{ height: 40, flex: 1 }} onPress={onComfirm}>
            <Text whiteColor body2>
              Comfirm
            </Text>
          </Button>
          <Button style={{ backgroundColor: "red", height: 40, flex: 1 }} onPress={onCancel}>
            <Text whiteColor body2>
              Cancel
            </Text>
          </Button>
        </View>
      </View>
    </Modal>
  )
}
const $containerStyle: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",

  //   width: "50%",
}
export default ModalEnroll
