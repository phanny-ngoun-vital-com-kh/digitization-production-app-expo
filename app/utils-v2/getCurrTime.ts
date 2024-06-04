export const getCurrentTime = () => {
    const date = new Date()
    const hours = date.getHours()
    const minutes = date.getMinutes()

    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes

    return `${hours}:${formattedMinutes}`
  }

  export const convertToMinutes = (timeString) => {
    const [hour, minute] = timeString.split(':').map(Number);
    return hour * 60 + minute;
  };