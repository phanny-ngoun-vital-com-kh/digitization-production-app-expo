import { View } from "react-native"
import React from "react"
import PieChartAlert from "./PieChartAlert"
import BadgeChart from "../Chart/BadgeChart"
import { Text } from "app/components/v2"
import styles from "./styles"
import { PieChart } from "react-native-gifted-charts"
import { getStatusPerformance } from "app/utils-v2/dashboard/getPerformance"
import { translate } from "../../../i18n/translate"
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
  return (
    <View
      style={[
        styles.shadowbox,
        {
          paddingVertical: 72,
          backgroundColor: "white",
        },
      ]}
    >
      <Text semibold body1 textAlign={"center"}>
        {translate("dashboard.PerformanceStatistic")}
      </Text>

      <View style={{ paddingHorizontal: 20, paddingVertical: 15, zIndex: 0 }}>
        <View
          style={{
            marginVertical: 20,
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <PieChart
            data={pieData}
            innerRadius={64}
            showText={!isloading && machineLength > 0 ? true : false}
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
            radius={120}
            textSize={14}
            fontStyle="oblique"
            // focusOnPress

            showValuesAsLabels
            showTextBackground
            textBackgroundRadius={15}
          />
        </View>

        <PieChartAlert
          visible={showPopup}
          onClose={() => setShowPopup(false)}
          data={popupData}
          label=""
        />
      </View>

      <View style={[styles.horicontainer, { justifyContent: "center", marginTop: 20, gap: 40 }]}>
        {percentages !== -1 ? (
          pieData?.map((data, index) => {
            const label =
              data?.color === "#145da0"
                ? "Normal"
                : data?.color === "#AED8FF"
                ? "Pending"
                : "Warning"
            return (
              <BadgeChart
                title={label}
                bgColor={data.color}
                key={index.toString()}
                value={data?.text + ""}
              />
            )
          })
        ) : (
          <>
            <BadgeChart title={"Normal"} bgColor={"#AED8FF"} value={0 + ""} />
            <BadgeChart title={"Pending"} bgColor={"#145da0"} value={0 + ""} />

            <BadgeChart title={"Warning"} bgColor={"#BF3131"} value={0 + ""} />
          </>
        )}
      </View>
    </View>
  )
}
