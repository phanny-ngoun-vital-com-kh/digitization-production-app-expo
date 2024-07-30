import React from "react"
import Icon from "react-native-vector-icons/Ionicons"
import { View, ViewStyle, TouchableOpacity } from "react-native"
import { Text } from "app/components/v2"
import { ProgressBar } from "react-native-paper"
import styles from "./styles"
import { translate } from "../../../i18n/translate"
import { HaccpLines } from "app/models/haccp-monitoring/haccp-lines-store"
import BadgeOutofdate from "../BadgePanel"
interface LinePanelProps {
  onClickPanel: () => void
  item: HaccpLines
  dateValid?: boolean
  currUser?: string
}
const LinePanel = ({ onClickPanel, item, currUser, dateValid }: LinePanelProps) => {
  // const totalWarning = item.lines.filter((item) => item.status === "warning")?.length
  const totalNormal = item.haccplist.filter(
    (item) => item.status === null || item.status === "normal",
  )?.length
  const warningCount = item.haccplist?.reduce(
    (total, item) => (total += item?.warning_count ?? 0),
    0,
  )

  const calculateProgress = (totalWarning: number, totalLength: number) => {
    return totalWarning / totalLength
  }
  const totalWarningPerline = () => item?.haccplist?.map((item) => item.warning_count)[0]

  const total = item?.haccplist?.length
  // const assignTo = "Prod1"
  return (
    <TouchableOpacity onPress={() => onClickPanel()} style={{ padding: 10 }}>
      <View
        style={[
          styles.linePanel,
          { position: "relative", overflow: "hidden" },
          !dateValid && {
            backgroundColor: "#EEEEEE",
          },
        ]}
      >
        {!dateValid && (
          <BadgeOutofdate
            placeholder={translate("wtpcommon.outDate")}
            top={-2}
            height={50}
            textMarginRight={13}
          />
        )}

        <View style={[$containerHorizon, { justifyContent: "space-between", marginBottom: 0 }]}>
          <Text semibold body1>
            {item.line}
          </Text>

          <View style={{ position: "absolute", right: 300, bottom: 20 }}>
            {/* {warningCount > 0 && <Badge>{warningCount}</Badge>} */}
          </View>

          <Icon name="arrow-forward-outline" size={25} color={"black"} />
        </View>
        <View style={{ marginVertical: 10 }}>
          {item.assign_to?.split(" ").includes(currUser ?? "") ? (
            <View style={[$containerHorizon, { gap: 10 }]}>
              <View style={[$containerHorizon, { gap: 0 }]}>
                <Icon name="checkmark-circle" size={18} color="green" />
                <Text semibold caption1 style={{ marginLeft: 5, color: "green" }}>
                  {translate("wtpcommon.youAreAssigned")}
                </Text>
              </View>
            </View>
          ) : (
            <View style={[$containerHorizon, { gap: 10 }]}>
              <View style={[$containerHorizon, { gap: 0 }]}>
                <Icon name="close-circle" size={18} color="#D32600" />
                <Text semibold caption1 style={{ marginLeft: 5, color: "#D32600" }}>
                  {translate("wtpcommon.youArenotAssigned")}
                </Text>
              </View>
            </View>
          )}
        </View>

        {totalWarningPerline() ? (
          <View style={{ marginBottom: 30 }}>
            <ProgressBar
              progress={calculateProgress(totalWarningPerline()!, total)}
              style={{ height: 8, backgroundColor: "#EA7C64" }}
              color={"#D32600"}
            />
            <View style={{ marginVertical: 3 }}></View>
            <Text semibold caption2 style={{ marginLeft: 5, color: "#D32600" }} textAlign={"right"}>
              {Math.floor(calculateProgress(totalWarningPerline()!, total) * 100)}% warning
            </Text>
          </View>
        ) : (
          <View style={{ marginBottom: 30 }}>
            <ProgressBar
              progress={1}
              style={{ height: 8, backgroundColor: "#0081F8" }}
              color={"#0081F8"}
            />
            <View style={{ marginVertical: 3 }}></View>
            <Text semibold caption2 style={{ marginLeft: 5, color: "#0081F8" }} textAlign={"right"}>
              100% normal
            </Text>
          </View>
        )}

        <View style={[$containerHorizon]}>
          <View style={$containerHorizon}>
            <View style={[styles.badge, { backgroundColor: "#0081F8" }]}></View>
            <Text caption2 semibold>
              {translate("haccpMonitoring.total")}

              <Text> : </Text>

              <Text style={{color:'#0081F8'}} semibold >{total}</Text>
            </Text>
          </View>
          <View style={$containerHorizon}>
            <View style={[styles.badge, { backgroundColor: "green" }]}></View>
            <Text caption2 semibold>
              {translate("haccpMonitoring.normalMachine")}
              <Text> : </Text>

              <Text style={{ color: "green" }} semibold>
                {totalNormal}
              </Text>
            </Text>
          </View>
          <View style={$containerHorizon}>
            <View style={styles.badge}></View>
            <Text caption2 semibold>
              {translate("haccpMonitoring.warningMachine")}
              <Text errorColor>
                <Text> : </Text>
                <Text semibold errorColor>
                  {totalWarningPerline() || 0}
                </Text>
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}
const $containerHorizon: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: 10,
}
export default LinePanel
