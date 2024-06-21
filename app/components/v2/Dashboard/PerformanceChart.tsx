import { Alert, View } from "react-native"
import React from "react"
import PieChartAlert from "./PieChartAlert"
import BadgeChart from "../Chart/BadgeChart"
import { Text } from "app/components/v2"
import styles from "./styles"
import { PieChart } from "react-native-gifted-charts"
import { getStatusPerformance } from "app/utils-v2/dashboard/getPerformance"

export default function PerformanceChart({
  pieData,
  showPopup,
  setPopupdata,
  setShowPopup,
  popupData,
  percentages,
  isloading,
  machineLength,
}: PerformanceChartProps) {
  console.log("Popuip", popupData?.total)
  return (
    <View style={[styles.activityPieChart]}>
      <Text semibold body1 textAlign={"center"}>
        Performance Statistic
      </Text>

      <View style={{ paddingHorizontal: 20, paddingVertical: 35, zIndex: 0 }}>
        <View
          style={{
            marginVertical: 20,
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <PieChart
            data={pieData}
            innerRadius={70}
            showText={isloading && machineLength > 0 ? true : false}
            textBackgroundColor="#EEEEEE"
            textColor="black"
            centerLabelComponent={() => {
              const { color, label } = getStatusPerformance(percentages)
              return (
                <View style={{ alignItems: "center" }}>
                  <Text style={{ color: color, fontSize: 22 }} semibold>
                    {percentages < 0 ? 0 : percentages} %
                  </Text>

                  <Text style={{ color: color, fontSize: 18 }}>
                    {percentages < 0 ? "N/A" : label}
                  </Text>
                </View>
              )
            }}
            onLabelPress={(item, index) => {
              setShowPopup(true)
              setPopupdata({
                total: machineLength + "",
                percentages: item?.text,
                index: index,

                label: item?.value,
              })
            }}
            onPress={(item, index) => {
              setShowPopup(false)
            }}
            radius={130}
            textSize={16}
            // focusOnPress

            showValuesAsLabels
            showTextBackground
            textBackgroundRadius={20}
          />
        </View>

        <View style={[styles.horicontainer, { justifyContent: "center" }]}>
          <BadgeChart title="Normal" bgColor="#145da0" />
          <BadgeChart title="Pending" bgColor="#0e86d4" />
          <BadgeChart title="Warning" bgColor="#BF3131" />
        </View>
        <PieChartAlert
          visible={showPopup}
          onClose={() => setShowPopup(false)}
          data={popupData}
          label=""
        />
      </View>
    </View>
  )
}
