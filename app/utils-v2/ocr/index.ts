/* eslint-disable no-useless-catch */
export const ImagetoText = async (file: any) => {
  const myHeaders = new Headers()
  myHeaders.append("apikey", "FEmvQr5uj99ZUvk3essuYb6P5lLLBS20")
  myHeaders.append("Content-Type", "multipart/form-data")
  const requestOptions = {
    method: "POST",
    redirect: "follow",
    headers: myHeaders,
    body: file,
  }

  try {
    const res = await fetch("https://api.apilayer.com/image_to_text/upload", requestOptions)

    if (res.ok) {
      return await res.json()
    }
  } catch (error) {
    throw error
  }
}
