import { Text } from "app/components/v2"
import { DataPoint } from "app/screens/(dashboard)/daily-water/type"
import React from "react"
import { View, TouchableOpacity } from "react-native"
import { Divider } from "react-native-paper"
const PointerItem = ({
  dataPopup,
  label,
  selectedColors,
  indexFound,
  length,
  warning_count,
}: {
  dataPopup?: DataPoint[]
  label: string
  selectedColors:{ label: string; color: string }[]
  length: number
  indexFound: number
  warning_count: string
}) => {
  return (
    <TouchableOpacity>
      <View
        style={[
          {
            backgroundColor: "#EEF5FF",
            width: 250,
            position: "absolute",
            borderRadius: 15,
            zIndex: 0,
            // alignItems: "start",
            paddingHorizontal: 10,
            paddingVertical: 10,
          },

          length === 1 ? { left: 20 } : indexFound >= length - 1 ? { right: 0 } : { left: 0 },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 5,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text body2 semibold style={{ marginVertical: 5 }}>
            Date {label}
          </Text>
        </View>

        <Text errorColor bold body2 style={{ marginVertical: 10 }}>
          Warning State Percentages
        </Text>
        {dataPopup?.map((data, index) => {
          const lines = selectedColors.find((colors) => colors.color === data.textColor)
          return (
            <View key={index?.toString()}>
              <View key={index}>
                <Text body2>
                  <Text errorColor>
                    {lines?.label} count {data?.dataPointText}
                  </Text>
                </Text>
              </View>
            </View>
          )
        })}

        <Divider style={{ marginVertical: 15 }} />

        <Text body2 regular semibold style={{ marginVertical: 10 }} errorColor>
          Total Warning Count : {warning_count}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default PointerItem
