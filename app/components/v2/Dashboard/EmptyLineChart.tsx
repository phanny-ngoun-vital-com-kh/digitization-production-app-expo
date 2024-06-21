import { useWindowDimensions } from "react-native"
import React from "react"
import { LineChart } from "react-native-gifted-charts"

export default function EmptyLineChart() {
  const { width: maxWidth } = useWindowDimensions()
  const dummy = [
    {
      value: 0,

      label: "",
    },
    {
      value: 0,

      label: "",
    },
    {
      value: 0,

      label: "",
    },

    {
      value: 0,

      label: "",
    },
    {
      value: 0,

      label: "",
    },
    {
      value: 0,

      label: "",
    },
    {
      value: 0,

      label: "",
    },
  ]
  return (
    <LineChart
      overflowTop={15}
      overflowBottom={30}
      data={dummy}
      thickness={2}
      width={maxWidth * 0.65}
      maxValue={10}
      noOfSections={4}
      isAnimated={true}
      rulesType="solid"
      endOpacity={0.1}
      spacing={maxWidth / 5}
      endSpacing={55}
      
      indicatorColor="black"
      showScrollIndicator={true}
      initialSpacing={35}
      dataPointsHeight={10}
      dataPointsWidth={10}
      color=""
      textShiftY={-3}
      adjustToWidth
      animateTogether
      textShiftX={-3}
      yAxisTextStyle={{
        fontSize: 13,
        
        // fontWeight:"600"
      }}
      height={400}

      textFontSize={12}
      curved
    />
    //   <LineChart
    //   data={dummy}
    //   thickness={0.5}
    //   height={400}
    //   width={maxWidth *0.65}
    //   isAnimated
    //   noOfSections={4}
    //   // yAxisLabelSuffix="%"
    //   rulesType="solid"
    //   yAxisThickness={1}

    //   xAxisThickness={0}
    //   xAxisColor="transparent" // Disable the color of the X-axis lines
    //   endOpacity={0.1}
    //   spacing={maxWidth / 10}
    //   scrollAnimation
    //   showScrollIndicator={true}
    //   animationDuration={2000}
    //   maxValue={10}
    //   initialSpacing={30}
    //   dataPointsHeight={16}
    //   dataPointsWidth={16}

    //   textShiftY={-12}
    //   adjustToWidth
    //   animateTogether
    //   textShiftX={-3}
    //   yAxisTextStyle = {{
    //     fontSize:13,
    //     // fontWeight:"600"
    //   }}

    //   textFontSize={12}
    //   curved

    // />
  )
}
