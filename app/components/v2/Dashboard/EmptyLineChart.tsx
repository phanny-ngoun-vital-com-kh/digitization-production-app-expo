import { useWindowDimensions } from "react-native"
import React from "react"
import { LineChart } from "react-native-gifted-charts"

export default function EmptyLineChart() {
  const { width: maxWidth } = useWindowDimensions()
  const dummy = [
    {
      value: 0,

      label: "Mon",
    },
    {
      value: 0,

      label: "Tues",
    },
    {
      value: 0,

      label: "Wed",
    },

    {
      value: 0,

      label: "Thurs",
    },
    {
      value: 0,

      label: "Fri",
    },
    {
      value: 0,

      label: "Sat",
    },
    {
      value: 0,

      label: "Sun",
    },
  ]
  return (
    <LineChart
    data={dummy}     
    thickness={0.5}
    height={400}
    width={maxWidth *0.65}
    isAnimated
    noOfSections={4}
    yAxisLabelSuffix="%"
    rulesType="solid"
    yAxisThickness={1}


    xAxisThickness={0}
    xAxisColor="transparent" // Disable the color of the X-axis lines
    endOpacity={0.1}
    spacing={maxWidth / 10}
    scrollAnimation
    showScrollIndicator={true}
    animationDuration={2000}
    maxValue={100}
    initialSpacing={20}
    dataPointsHeight={16}
    dataPointsWidth={16}
       
    textShiftY={-12}
    adjustToWidth
    animateTogether
    textShiftX={-3}
    yAxisTextStyle = {{
      fontSize:13,
      // fontWeight:"600"
    }}
 
    textFontSize={12}
    curved

  />
  )
}
