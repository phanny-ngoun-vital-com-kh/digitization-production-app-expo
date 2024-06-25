import React from "react"
import Icon from "react-native-vector-icons/Ionicons"
import { TouchableOpacity, View, ViewStyle } from "react-native"
import styles from "./styles"
import { translate } from "../../../i18n/translate"

import { Button, Text } from "app/components/v2"
const ActivityBar = ({
  direction = "end",
  onActivity,
  onAttachment,
  onClickinfo,
  onScanCamera,
  showInfo = false,
}: {
  direction: "end" | "start "
  onActivity?: () => void
  onAttachment?: () => void
  showInfo?: boolean
  onClickinfo?: () => void
  onScanCamera?:()=>void
}) => {
  return (
    <View
      style={[
        $containerHorizon,
        { justifyContent: direction === "end" ? "flex-end" : "flex-start" },
      ]}
    >
 

      <TouchableOpacity onPress={onScanCamera}>
        <View style={styles.iconBorder}>
          <Icon name="scan-outline" size={30} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={onAttachment}>
        <View style={styles.iconBorder}>
          <Icon name="link-outline" size={30} />
        </View>
      </TouchableOpacity>

      <Button onPress={onActivity}>

        <Text whiteColor body2 >{translate("wtpcommon.viewActivity")}</Text>
      </Button>
    </View>
  )
}
const $containerHorizon: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: 25,
}
export default ActivityBar
