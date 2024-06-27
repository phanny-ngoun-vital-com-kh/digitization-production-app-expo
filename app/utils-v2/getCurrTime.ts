export const getCurrentTime = () => {
  const date = new Date()
  let hours = date.getHours()
  const minutes = date.getMinutes()

  if (hours < 10) {

    hours = "0" + hours
  }
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes

  return `${hours?.toString()}:${formattedMinutes}`
}

export const convertToMinutes = (timeString: string) => {
  const [hour, minute] = timeString.split(":").map(Number)
  return hour * 60 + minute
}

export function cleanTimeString(timeString: string) {
  const cleanedTime = timeString.replace(/[()]/g, "")

  const timePattern = /^(0?[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/

  if (timePattern.test(cleanedTime)) {
    if (cleanedTime.length <= 4) {
      const time = +cleanedTime[0] + 6

      return time + ":" + "00"
    }

    const time = +(cleanedTime[0] + cleanedTime[1])
    if (time === 13) {
      return "18:00"
    }
    if (time === 18) {
      return "22:00"
    }

    if (time === 22) {
      return "23:59"
    }
    return cleanedTime
  } else {
    throw new Error("Invalid time format. Please use '(HH:MM)' or '(H:MM)'.")
  }
}
export function cleanTimePreWtp(timeString: string) {
  const cleanedTime = timeString.replace(/[()]/g, "")

  const timePattern = /^(0?[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/

  if (timePattern.test(cleanedTime)) {
    if (cleanedTime.length <= 4) {
      const time = +cleanedTime[0] + 6

      return time + ":" + "00"
    }

    const time = +(cleanedTime[0] + cleanedTime[1])

    if (time === 7) {
      return "11:00"
    }
    if (time === 11) {
      return "15:00"
    }
    if (time === 15) {
      return "19:00"
    }

    if (time === 19) {
      return "23:00"
    }
    if (time === 23) {
      return "3:00"
    }
    if (time === 3) {
      return "7:00"
    }

    return cleanedTime
  } else {
    throw new Error("Invalid time format. Please use '(HH:MM)' or '(H:MM)'.")
  }
}

export function cleanTimeCurrent(timeString: string) {
  const cleanedTime = timeString?.replace(/[()]/g, "")

  const timePattern = /^(0?[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/

  if (timePattern.test(cleanedTime)) {
    if (cleanedTime.length <= 4) {
      return "0" + cleanedTime
    }

    return cleanedTime
  } else {
    throw new Error("Invalid time format. Please use '(HH:MM)' or '(H:MM)'.")
  }
}
