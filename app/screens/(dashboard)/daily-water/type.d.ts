import { lineDataItem } from "react-native-gifted-charts"

export interface DataSetProps {
    data: lineDataItem[]
    zIndex?: number
    thickness?: number
    strokeDashArray?: number[]
    areaChart?: boolean
    stepChart?: boolean
    startIndex?: number
    endIndex?: number
    color?: string
    hideDataPoints?: boolean
    dataPointsHeight?: number
    dataPointsWidth?: number
    dataPointsRadius?: number
    dataPointsColor?: string
    dataPointsShape?: string
    startFillColor?: string
    endFillColor?: string
    startOpacity?: number
    endOpacity?: number
    textFontSize?: number
    textColor?: string
    showArrow?: boolean
    arrowConfig?: arrowConfigType
    curved?: boolean
    curvature?: number
    curveType?: CurveType
    lineSegments?: LineSegment[]
    isSecondary?: boolean
  }
  