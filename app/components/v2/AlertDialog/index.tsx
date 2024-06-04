import * as React from "react"
import { StyleSheet, View } from "react-native"
import { Dialog, Portal } from "react-native-paper"
import { Button, Text } from "app/components/v2"
import Icon from "react-native-vector-icons/FontAwesome6"

const AlertDialog = ({
  hideDialog,
  visible,
  onPositive,
  onNegative,
  content = " You're about to enroll this task. Click confirm to accept.",
}: {
  hideDialog: () => void
  visible: boolean
  onPositive?: () => void
  onNegative?: () => void
  content?: string
}) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog} style={styles.dialog}>
        <View style={styles.dialogContent}>
          <Icon name="circle-info" size={40} color={"#0081F8"} style={styles.icon} />
          <Dialog.Title style={styles.title}>Confirmation</Dialog.Title>
          <Dialog.Content style={styles.dialogContentNoElevation}>
            <Text style={styles.text} textAlign={"center"}>
              {content}
            </Text>
          </Dialog.Content>
          <Dialog.Actions style={styles.actions}>
            <Button style={styles.positiveButton} onPress={onPositive}>
              <Text whiteColor body2>
                Confirm
              </Text>
            </Button>
            <Button style={styles.negativeButton} onPress={onNegative}>
              <Text whiteColor body2>
                Cancel
              </Text>
            </Button>
          </Dialog.Actions>
        </View>
      </Dialog>
    </Portal>
  )
}

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: "transparent",
    alignItems: "center",
    elevation: 0,
    shadowColor: "transparent",
    shadowOpacity: 0,

    borderWidth: 0,
  },
  dialogContent: {
    width: "30%",
    backgroundColor: "white",
    borderWidth: 0,
    alignItems: "center",
    borderRadius: 8,
    padding: 20,
    elevation: 0,
  },
  dialogContentNoElevation: {
    elevation: 0,
  },
  icon: {
    marginBottom: 10,
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    marginBottom: 10,
  },
  text: {
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  positiveButton: {
    height: 40,
    flex: 1,
    marginRight: 10,
    backgroundColor: "#0081F8",
    justifyContent: "center",
  },
  negativeButton: {
    height: 40,
    flex: 1,
    backgroundColor: "red",
    justifyContent: "center",
  },
})

export default AlertDialog
