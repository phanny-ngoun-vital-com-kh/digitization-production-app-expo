import React from "react"
import Icon from "react-native-vector-icons/Ionicons"
import { TouchableOpacity, View } from "react-native"
import styles from "./styles"

import { Button, Text } from "app/components/v2"
const ActivityBar = ({
  direction = "end",
  onActivity,
  onAttachment,
  onClickinfo,
  showInfo = false
}: {
  direction: "end" | "start "
  onActivity?: () => void
  onAttachment?: () => void
  showInfo?:boolean,
  onClickinfo?:()=>void
}) => {
  return (
    <View
      style={[
        $containerHorizon,
        { justifyContent: direction === "end" ? "flex-end" : "flex-start" },
      ]}
    >
      {
        showInfo && <TouchableOpacity onPress={onClickinfo}>
        <View style={styles.iconBorder}>
          <Icon name="help-circle-sharp" size={30} />
        </View>
      </TouchableOpacity>
      }
            
      <TouchableOpacity>
        <View style={styles.iconBorder}>
          <Icon name="scan-outline" size={30} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity>
        <View style={styles.iconBorder}>
          <Icon name="link-outline" size={30} />
        </View>
      </TouchableOpacity>

      <Button onPress={onActivity}>View Activity</Button>
    </View>
  )
}
const $containerHorizon: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: 25,
}
export default ActivityBar
