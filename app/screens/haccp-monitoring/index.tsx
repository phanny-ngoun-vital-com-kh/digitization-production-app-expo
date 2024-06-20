import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
  ViewStyle,
  Pressable,
} from "react-native"
import { AppStackScreenProps } from "app/navigators"
import HeaderBar from "app/components/v2/WaterTreatment/HeaderBar"
import { Divider } from "react-native-paper"
import styles from "./styles"
import { useNavigation } from "@react-navigation/native"
import LinePanel from "app/components/v2/HACCP/LinePanel"
import EmptyFallback from "app/components/EmptyFallback"
import moment from "moment"
import { useStores } from "app/models"
import { HaccpLines } from "app/models/haccp-monitoring/haccp-lines-store"
import { useTheme } from "app/theme-v2"
import { ALERT_TYPE, Dialog } from "react-native-alert-notification"
import { Text } from "app/components/v2"

interface HccpMonitorScreenProps extends AppStackScreenProps<"HccpMonitor"> {}

export const HccpMonitorScreen: FC<HccpMonitorScreenProps> = observer(function HccpMonitorScreen() {
  const [datePicker, setDatePicker] = useState({
    show: false,
    value: new Date(Date.now()),
  })
  const { colors } = useTheme()
  const [isLoading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedLine, setSelectedLine] = useState({ name: "", value: null })
  const [waterLines, setWaterLine] = useState<HaccpLines[]>([])
  const navigation = useNavigation()
  const [currUser, setCurrUser] = useState("")
  const { haccpLinesStore, authStore } = useStores()
  const getCurrentUser = async () => {
    try {
      const userinfo = await authStore?.getUserInfo()
      const { login } = userinfo?.data
      setCurrUser(login)
    } catch (error) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "បរាជ័យ",
        textBody: "បរាជ័យ",
        button: "បិទ",
      })
    } finally {
      setLoading(false)
    }
  }
  const renderItem = ({ item, index }: { item: HaccpLines; index: number }) => {
    return (
      <LinePanel
        item={item}
        dateValid ={moment(Date.now()).format("LL") === moment(item?.createdDate).format("LL")}
        currUser={currUser}
        onClickPanel={() =>
          navigation.navigate("DailyHaccpLineDetail", {
            id: item?.id,
            title: item?.line,
            assign: item.assign_to?.split(" ").includes(currUser ?? ""),
            line: item,
            isvalidDate: moment(Date.now()).format("LL") === moment(item?.createdDate).format("LL"),
            onRefresh: handleRefresh,
          })
        }
      />
    )
  }
  const invalidDate = (created_date: string) =>
    moment(Date.now()).format("LL") === moment(created_date).format("LL")

  const handleRefresh = () => {
    fetchHaccp()
  }
  const fetchHaccp = async () => {
    setLoading(true)

    try {
      getCurrentUser()
      const result = await haccpLinesStore.getHaccpLineDate(
        moment(datePicker.value).format("YYYY-MM-DD"),
      )
      setWaterLine(result!)
    } catch (error) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "បរាជ័យ",
        textBody: "បរាជ័យ",
        button: "បិទ",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (datePicker.value) {
      setLoading(true)
      fetchHaccp()
    }
    // haccpMonitoringStore.removeLines()
  }, [selectedLine, datePicker.value])

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

        {isLoading ? (
          <View style={{ marginTop: 250, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator color={colors.primary} size={40} />
          </View>
        ) : (
          <View style={{ marginTop: 15, alignItems: "center", justifyContent: "center" }}>
            <FlatList
              columnWrapperStyle={{
                gap: 10,
              }}
              numColumns={3}
              key={1}
              contentContainerStyle={{
                gap: 0,
                justifyContent: "center",
              }}
              refreshControl={
                <RefreshControl
                  colors={["#0081F8"]}
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                />
              }
              ListEmptyComponent={
                <View style={{ marginTop: 150 }}>
                  <EmptyFallback placeholder="No Schedule for this line !!!" />
                </View>
              }
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              data={waterLines}
            />
          </View>
        )}
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
