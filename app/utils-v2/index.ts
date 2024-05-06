import {
  Platform,
  UIManager,
  LayoutAnimation,
  PixelRatio,
  Dimensions,
  I18nManager,
} from "react-native"
import RNRestart from "react-native-restart"
import { TRANSPARENCIES } from "./transparencies"
import "intl"
import "intl/locale-data/jsonp/en"
import { ALERT_TYPE, Toast } from "react-native-alert-notification"
import moment from "moment"

const scaleValue = PixelRatio.get() / 2

export const setupLayoutAnimation = () => {
  if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true)
    }
  }
}

export const enableExperimental = () => {
  if (Platform.OS === "android") {
    UIManager.setLayoutAnimationEnabledExperimental(true)
  }
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
}

export const scaleWithPixel = (size, limitScale = 1.2) => {
  /* setting default upto 20% when resolution device upto 20% with defalt iPhone 7 */
  const value = scaleValue > limitScale ? limitScale : scaleValue
  return size * value
}

export const heightHeader = () => {
  const width = Dimensions.get("window").width
  const height = Dimensions.get("window").height
  const landscape = width > height

  if (Platform.OS === "android") return 45
  // if (Platform.isPad) return 65;
  switch (height) {
    case 375:
    case 414:
    case 812:
    case 896:
      return landscape ? 45 : 88
    default:
      return landscape ? 45 : 65
  }
}

export const heightTabView = () => {
  const height = Dimensions.get("window").height
  let size = height - heightHeader()
  switch (height) {
    case 375:
    case 414:
    case 812:
    case 896:
      size -= 30
      break
    default:
      break
  }

  return size
}

export const getWidthDevice = () => {
  return Dimensions.get("window").width
}

export const getHeightDevice = () => {
  return Dimensions.get("window").height
}

export const scrollEnabled = (contentWidth, contentHeight) => {
  return contentHeight > Dimensions.get("window").height - heightHeader()
}


export const duration = (start: moment.Moment, end: moment.Moment, format?: string) => {
  const duration = moment.duration(moment(end).diff(start));
  return moment.utc(duration.asMilliseconds()).format( format || "HH:mm:ss")
}

export const formateDateTime = (data: moment.Moment) => {
  return data.format("YYYY-MM-DD H:mm")
}

export const formateTime = (data: moment.Moment) => {
  return data.format("HH:mm")
}

export const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
})


export const currencyFormatterKh = new Intl.NumberFormat("km-KH", {
  style: "currency",
  currency: "KHR",
  minimumFractionDigits: 2,
})

export const numberFormatter = new Intl.NumberFormat("en-US", {
  style: "decimal",
})

export const languageFromCode = (code) => {
  switch (code) {
    case "en":
      return "English"
    case "vi":
      return "Vietnamese"
    case "ar":
      return "Arabic"
    case "da":
      return "Danish"
    case "de":
      return "German"
    case "el":
      return "Greek"
    case "fr":
      return "French"
    case "he":
      return "Hebrew"
    case "id":
      return "Indonesian"
    case "ja":
      return "Japanese"
    case "ko":
      return "Korean"
    case "lo":
      return "Lao"
    case "nl":
      return "Dutch"
    case "zh":
      return "Chinese"
    case "fa":
      return "Iran"
    case "km":
      return "Cambodian"
    case "ku":
      return "Kurdish"
    default:
      return "Unknown"
  }
}

export const isLanguageRTL = (code) => {
  switch (code) {
    case "ar":
    case "he":
      return true
    default:
      return false
  }
}

export const reloadLocale = (oldLanguage, newLanguage) => {
  const oldStyle = isLanguageRTL(oldLanguage)
  const newStyle = isLanguageRTL(newLanguage)
  if (oldStyle !== newStyle) {
    I18nManager.forceRTL(newStyle)
    RNRestart.Restart()
  }
}

export const parseHexTransparency = (hexColor = "#ffffff", transparency = 0) => {
  return `${hexColor}${TRANSPARENCIES?.[transparency] ?? "00"}`
}

export const haveChildren = (parent = "", children = "") => {
  const parentNew = parent?.toLowerCase?.()
  const childrenNew = children?.toLowerCase?.()
  return parentNew?.includes(childrenNew)
}

export const logData = (data: any, name?: string) => {
  if (!__DEV__) return
  name &&
    console.debug(
      `#############################%c ${name}####################################`,
      "color: yellow; font-style: italic; background-color: blue;padding: 2px",
    )
  console.debug(data)
}

export const connectionCheck = (isConnected?: boolean) => {
  !isConnected &&
    Toast.show({
      type: ALERT_TYPE.WARNING,
      title: "No Connection",
      textBody: "System is offline. Please check service and network .",
    })
}

export const showErrorMessage  = (title: string, textBody: string) => {
  Toast.show({
    type: ALERT_TYPE.DANGER,
    title: title,
    textBody: textBody,
  })
}

export const showWarningMessage  = (title: string, textBody: string) => {
  Toast.show({
    type: ALERT_TYPE.WARNING,
    title: title,
    textBody: textBody,
  })
}


export const showOffineMessage = (isData = true) => {
  Toast.show({
    type: ALERT_TYPE.WARNING,
    title: "No Connection",
    textBody: isData?"Data is saving offline. Please make sure to upload data later when system is back online.": "System is offline. Please check service and network ",
  })
}