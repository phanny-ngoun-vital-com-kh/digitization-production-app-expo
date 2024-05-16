import React from "react"
import { TouchableOpacity, View } from "react-native"
import { ProgressBar } from "react-native-paper"
import { Text } from "app/components/v2"
import { TimePanelProps } from "./type"
import { black } from "react-native-paper/lib/typescript/styles/themes/v2/colors"
const TimePanel = ({
  time = "  7: 00",
  progressValue = 1,
  isSelected = false,
  bgColor = "#0081F8",
  color = "#8CC8FF",
  onPress,
}: TimePanelProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          padding: 40,
          backgroundColor: isSelected ? "#0081F8" : "white",
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.27,
          shadowRadius: 4.65,
          elevation: 1,
          marginBottom: 5,
        }}
      >
        <Text
          style={{ marginBottom: 20 }}
          whiteColor={isSelected}
          semibold
          headline
          textAlign={"center"}
        >
          {time}
        </Text>

        {progressValue && (
          <View>
            <ProgressBar
              progress={progressValue}
              style={{ height: 10 }}
              color={"#8CC8FF"}
              backgroundColor={"#8CC8FF"}
              animated={false}
            />
            {/* <Text>80%</Text> */}
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}

export default TimePanel
