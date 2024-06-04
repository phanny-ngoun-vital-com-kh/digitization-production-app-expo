import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { FlatList, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import HeaderBar from "app/components/v2/WaterTreatment/HeaderBar"
import { Divider } from "react-native-paper"
import styles from "./styles"
import { useNavigation } from "@react-navigation/native"
import LinePanel from "app/components/v2/HACCP/LinePanel"
import EmptyFallback from "app/components/EmptyFallback"
import linesDummy from "../../utils/dummy/haccp/index.json"
import moment from "moment"
import { useStores } from "app/models"

interface HccpMonitorScreenProps extends AppStackScreenProps<"HccpMonitor"> {}

export const HccpMonitorScreen: FC<HccpMonitorScreenProps> = observer(function HccpMonitorScreen() {
  const [datePicker, setDatePicker] = useState({
    show: false,
    value: null,
  })
  const [isLoading, setLoading] = useState(false)
  const [selectedLine, setSelectedLine] = useState({ name: "", value: null })
  const [waterLines, setWaterLine] = useState<ListWTPLines[] | []>([])
  const navigation = useNavigation()
  const {haccpMonitoringStore} = useStores()
  const renderItem = ({ item, index }: { item: ListWTPLines; index: number }) => {
    return (
      <LinePanel
        item={item}
        total={waterLines?.length ?? 0}
        onClickPanel={() =>
          navigation.navigate("DailyHaccpLineDetail", {
            id: item?.id,
            title: item?.name,
          })
        }
      />
    )
  }

  useEffect(() => {
    if (datePicker.value) {
      const result = linesDummy.lines
      const filterDate = result.filter(
        (item) => item.date === moment(datePicker.value).format("yyyy-MM-DD"),
      )

      setWaterLine(filterDate)
    }
    // haccpMonitoringStore.removeLines()
  }, [selectedLine, datePicker.value])

  console.log("Length is ",haccpMonitoringStore.haccpMonitoringList.length)

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
              setDatePicker((pre) => ({ show: false, value: v }))
            }}
            onSelectLine={(item) => {
              setSelectedLine(item)
            }}
            onPressdate={() => setDatePicker((pre) => ({ ...pre, show: true }))}
            dateValue={datePicker.value}
            showLine={false}
            showDate={datePicker.show}
            currDate={new Date(Date.now())}
          />
        </View>

        <Divider style={styles.divider_space} />

        <View style={{ marginTop: 15 }}>
          <FlatList
            columnWrapperStyle={{
              // justifyContent: "center",
              gap: 10,
              
            }}
            numColumns={3}
            key={1}
            contentContainerStyle={{
              gap: 0,
            }}
            ListEmptyComponent={<EmptyFallback placeholder="No Schedule for this line !!!" />}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            data={waterLines}
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
