import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { FlatList, RefreshControl, Text, View, ViewStyle } from "react-native"
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
import { ALERT_TYPE, Dialog } from "react-native-alert-notification"
import { translate } from "../../i18n"
import { TouchableOpacity } from "react-native-gesture-handler"

interface HccpMonitorScreenProps extends AppStackScreenProps<"HccpMonitor"> {}

export const HccpMonitorScreen: FC<HccpMonitorScreenProps> = observer(function HccpMonitorScreen() {
  const [datePicker, setDatePicker] = useState({
    show: false,
    value: new Date(Date.now()),
  })
  const [isLoading, setLoading] = useState(false)
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
        dateValid={moment(Date.now()).format("LL") === moment(item?.createdDate).format("LL")}
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

  const buttonWorkfromhome = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("DailyHaccpLineDetail", {
            id: 1,
            title: "Line 1",
            assign: "Ra",
            line: [],
            isvalidDate: true,
            onRefresh: handleRefresh,
          })
        }}
      >
        <Text> Navigate</Text>
      </TouchableOpacity>
    )
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
          {/* {buttonWorkfromhome()} */}
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
                refreshing={isLoading}
                onRefresh={handleRefresh}
              />
            }
            ListEmptyComponent={
              <View style={{ marginTop: 150 }}>
                <EmptyFallback placeholder={translate("wtpcommon.noScheduleYet")} />
              </View>
            }
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
