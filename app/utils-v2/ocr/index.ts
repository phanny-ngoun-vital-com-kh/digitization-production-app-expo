/* eslint-disable no-useless-catch */
import * as ImagePicker from "expo-image-picker"
import { ImagePickerResult } from "react-native"

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

export const getResultImageGallery = async (): Promise<ImagePickerResult> => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      allowsMultipleSelection: false,
      base64: true,

      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    })
    if (!result.canceled) {
      // Set the selected image in state
      // performOCR(result.assets[0])
      // setImage(result.assets[0].uri)
      return result
    }
  } catch (error) {
    throw new Error(error?.message)
  }
}
export const getResultImageCamera = async (): Promise<ImagePickerResult> => {
  try {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      allowsMultipleSelection: false,
      base64: true,

      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    })
    if (!result.canceled) {
      // Set the selected image in state
      return result
      // performOCR(result.assets[0])
      // setImage(result.assets[0].uri)
    }
  } catch (error) {
    throw new Error(error?.message)
  }
}
