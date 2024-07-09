import { useWindowDimensions } from "react-native"
import React from "react"
import { LineChart } from "react-native-gifted-charts"
import { View } from "react-native"

export default function EmptyLineChart() {
  const { width: maxWidth } = useWindowDimensions()
  return (
    <View style={{ marginTop: 20 }}>
      <LineChart
        overflowTop={15}
        xAxisColor={"transparent"}
        yAxisColor={"transparent"}
        overflowBottom={30}
        data={[]}
        width={maxWidth * 0.5}
        height={320}
        maxValue={10}
        noOfSections={4}
        isAnimated={true}
        rulesType="dashed"
        thickness={1}
        endOpacity={0.1}
        spacing={150}
        endSpacing={55}
        indicatorColor="white"
        showScrollIndicator={true}
        initialSpacing={40}
        dataPointsHeight={5}
        dataPointsWidth={10}
        textShiftY={-3}
        adjustToWidth
        animateTogether
        textShiftX={-3}
        yAxisTextStyle={{
          fontSize: 13,
          fontWeight: "bold",
        }}
        textFontSize={12}
        curved
        // yAxisLabelSuffix="%"
        showXAxisIndices={true}
      />
    </View>
  )
}
