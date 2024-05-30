import * as React from "react"
import { StyleSheet } from "react-native"
import { Dialog, Portal } from "react-native-paper"
import { Button, Text } from "app/components/v2"

const AlertDialog = ({
  hideDialog,
  visible,
  onPositive,
  onNegative,
}: {
  hideDialog: () => void
  visible: boolean
  onPositive?: () => void
  onNegative?: () => void
}) => {
  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={hideDialog}
        style={{ marginHorizontal: 490, backgroundColor: "white" }}
      >
        <Dialog.Icon icon="alert" size={40} color="red" />
        <Dialog.Title style={styles.title}>Are you sure?</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">You're about to enroll this task !!</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button style={{ height: 40 }} onPress={onPositive}>
            <Text whiteColor body2>OK</Text>
          </Button>
          <Button style={{ backgroundColor: "red", height: 40 }} onPress={onNegative}>
            <Text whiteColor body2>Cancel</Text>
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
  },
})

export default AlertDialog
