import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { Text, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import HeaderBar from "app/components/v2/WaterTreatment/HeaderBar"
import { Card, Divider, Paragraph, Title } from "react-native-paper"
import styles from "./styles"
import { useNavigation } from "@react-navigation/native"
import moment from "moment"
import { useStores } from "app/models"
import { HaccpLines } from "app/models/haccp-monitoring/haccp-lines-store"
import { ALERT_TYPE, Dialog } from "react-native-alert-notification"
import ProgressBar from "react-native-animated-progress";

interface HccpMonitorScreenProps extends AppStackScreenProps<"HccpMonitor"> { }

export const HccpMonitorScreen: FC<HccpMonitorScreenProps> = observer(function HccpMonitorScreen() {
  const [datePicker, setDatePicker] = useState({
    show: false,
    value: new Date(Date.now()),
  })
  const [isLoading, setLoading] = useState(false)
  const [selectedLine, setSelectedLine] = useState({ name: "", value: null })
  const [waterLines, setWaterLine] = useState<HaccpLines[]>([])
  const navigation = useNavigation()
  const [cancelDate, setCancelDate] = useState(false)
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

  const line = [
    // {
    //   name: 'Line 1'
    // },
    {
      name: 'Line 2'
    },
    {
      name: 'Line 3'
    },
    {
      name: 'Line 4'
    },
    {
      name: 'Line 5'
    },
    {
      name: 'Line 6'
    }
  ]

  const handleRefresh = () => {
    fetchHaccp()
  }
  const fetchHaccp = async () => {
    setLoading(true)
    try {
      getCurrentUser()
      const result = await haccpLinesStore.getHaccpLineDate(moment(datePicker.value).format("YYYY-MM-DD"))
      setWaterLine(result)
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
    if (datePicker.value && !cancelDate) {
      setLoading(true)
      fetchHaccp()
    }
    // haccpMonitoringStore.removeLines()
  }, [selectedLine, datePicker.value, cancelDate])

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
              if (e.type == "set") {
                setDatePicker({ show: false, value: v })
                setCancelDate(false)
              } else {
                setCancelDate(true)
              }
            }}
            onSelectLine={(item) => {
              setSelectedLine(item)
            }}
            onPressdate={() => {
              setCancelDate(true)
              setDatePicker((pre) => ({ ...pre, show: true }))
            }}
            dateValue={datePicker.value}
            showLine={false}
            showDate={datePicker.show}
            currDate={new Date(Date.now())}
          />
        </View>

        <Divider style={styles.divider_space} />
        <View style={{ marginTop: 15, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
          {line.map((it, index) => {
            const filteredData = waterLines.filter(i => i.line === it.name);
            const total = filteredData[0]?.haccplist.length || 0;
            const warningStatus = (filteredData[0]?.haccplist || []).filter(item => item.status === 'warning').length;
            const normalStatus = (filteredData[0]?.haccplist || []).filter(item => item.status === 'normal').length;
            const percentage = total > 0 ? ((normalStatus / total) * 100).toFixed(2) : '0.00';

            return (
              <View
                key={index}
                style={{
                  width: '30%', // Fixed width to fit 3 items in the first row
                  margin: 10,
                }}
              >
                <Card
                  style={{
                    marginTop: 40,
                    borderStyle: 'solid',
                    backgroundColor: 'white',
                    height: '38%',
                    borderWidth: 3,
                    borderColor: filteredData[0] !== undefined ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0)',
                    shadowColor: filteredData[0] !== undefined ? 'green' : '',
                    shadowOffset: { width: 0, height: 15 },
                    shadowOpacity: 0.9,
                    shadowRadius: 20,
                    elevation: 25,
                  }}
                  onPress={() => {
                    if (filteredData[0] !== undefined) {
                      navigation.navigate("DailyHaccpLineDetail", {
                        id: filteredData[0]?.id,
                        title: filteredData[0]?.line,
                        assign: filteredData[0].assign_to?.split(" ").includes(currUser ?? ""),
                        line: filteredData[0],
                        isvalidDate: moment(Date.now()).format("YYYY-MM-DD") == moment.utc(filteredData[0]?.assign_date).format("YYYY-MM-DD"),
                        onRefresh: handleRefresh,
                      })
                    }
                  }
                  }
                >
                  <Card.Content>
                    <Title>Production {it.name}</Title>
                    <View style={[styles.divider_space, { borderWidth: 0.5, borderColor: '#f1f1f1' }]} />
                    <View style={{ marginTop: 20 }}>
                      <ProgressBar

                        progress={parseFloat(percentage)}
                        backgroundColor={parseFloat(percentage) == 100 ? 'green' : "#2292EE"}
                        animated={false}
                        height={3}
                      />
                      <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 14, textAlign: 'right' }}>
                        {percentage}%
                      </Text>
                    </View>
                    <Text style={{ marginBottom: 20 }}>Assign To: {filteredData[0]?.assign_to || 'N/A'}</Text>

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginVertical: 10,
                      }}
                    >
                      <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', }}>
                        <View style={[styles.dot, { backgroundColor: 'green', marginRight: 10 }]}></View>
                        <Paragraph>Total: {total}</Paragraph>
                      </View>
                      <View style={{ height: '80%', width: 1, backgroundColor: '#ccc', marginHorizontal: 10, }} />
                      <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
                        <View style={[styles.dot, { backgroundColor: 'red', marginRight: 10 }]}></View>
                        <Paragraph>Warnings: {warningStatus}</Paragraph>
                      </View>
                      <View style={{ height: '80%', width: 1, backgroundColor: '#ccc', marginHorizontal: 10 }} />
                      <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', }}>
                        <View style={[styles.dot, { backgroundColor: '#2292EE', marginRight: 10 }]}></View>
                        <Paragraph>Normal: {normalStatus}</Paragraph>
                      </View>
                    </View>
                  </Card.Content>
                </Card>
              </View>
            );
          })}

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
