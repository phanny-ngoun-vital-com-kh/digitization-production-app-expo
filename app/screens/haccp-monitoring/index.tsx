import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import Icon from "react-native-vector-icons/Ionicons"
import { FlatList, StyleSheet, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Text } from "app/components/v2"
import HeaderBar from "app/components/v2/WaterTreatment/HeaderBar"
import { Divider, ProgressBar } from "react-native-paper"
import styles from "./styles"
import { TouchableOpacity } from "react-native-gesture-handler"
import { useNavigation } from "@react-navigation/native"
import LinePanel from "app/components/v2/HACCP/LinePanel"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface HccpMonitorScreenProps extends AppStackScreenProps<"HccpMonitor"> {}

export const HccpMonitorScreen: FC<HccpMonitorScreenProps> = observer(function HccpMonitorScreen() {
  const [datePicker, setDatePicker] = useState({
    show: false,
    value: null,
  })
  const lines = [
    {
      id: 1,
      name: "Line 1",
    },

    {
      id: 2,
      name: "Line 2",
    },
    {
      id: 3,
      name: "Line 3",
    },
    {
      id: 4,
      name: "Line 4",
    },
    {
      id: 5,
      name: "Line 5",
    },
    {
      id: 6,
      name: "Line 6",
    },
  ]
  const navigation = useNavigation()
  return (
    <View style={$root}>
      <View style={[$outerContainer]}>
        <View
          style={[
            $containerHorizon,
            {
              justifyContent: "space-between",
            },
          ]}
        >
          <HeaderBar
            onChangeDate={(e, v) => {
              console.log(e.nativeEvent.timestamp)
              setDatePicker((pre) => ({ show: false, value: v }))
            }}
            onPressdate={() => setDatePicker((pre) => ({ ...pre, show: true }))}
            dateValue={datePicker.value}
            showDate={datePicker.show}
            currDate={new Date(Date.now()).toLocaleDateString()}
          />
        </View>
        <Divider style={styles.divider_space} />

        <View style={{ marginTop: 15 }}>
          <FlatList
            columnWrapperStyle={{
              justifyContent: "center",
              gap: 0,
            }}
            numColumns={3}
            key={1}
            contentContainerStyle={{
              gap: 0,
            }}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              return (
                <LinePanel
                  item={item}
                  onClickPanel={() =>
                    navigation.navigate("DailyHaccpLineDetail", {
                      id: 1,
                    })
                  }
                />
              )
            }}
            data={lines}
          />
        </View>
      </View>
    </View>
  )
})

const $root: ViewStyle = {
  flex: 1,
  backgroundColor: "#fff",
}
const $containerHorizon: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: 5,
}
const $outerContainer: ViewStyle = {
  margin: 15,
  marginTop: 20,
  padding: 10,
}
