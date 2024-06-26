import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { KeyboardAvoidingView, ScrollView, SectionList, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Text } from "app/components/v2"
import { translate } from "../../i18n/translate"
import * as ImagePicker from "expo-image-picker"
import { View } from "react-native"
import ActivityBar from "app/components/v2/WaterTreatment/ActivityBar"
import { ImagetoText, getResultImageCamera, getResultImageGallery } from "app/utils-v2/ocr"
import { ALERT_TYPE, Dialog } from "react-native-alert-notification"
import { FlatList } from "react-native"
import LoadingIndicator from "app/components/v2/SavingIndicator"
import TotalSection from "app/components/v2/Scan/TotalSection"
import AutomaticSection from "app/components/v2/Scan/AutomaticSection"
import ManualContainerSection from "app/components/v2/Scan/ManualContainer"
import ContainerRejection from "app/components/v2/Scan/ContainerRejection"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface ScanMachineScreenProps extends AppStackScreenProps<"ScanMachine"> {}

export const ScanMachineScreen: FC<ScanMachineScreenProps> = observer(function ScanMachineScreen() {
  const [isScanning, setScanning] = useState(false)
  const [imageResult, setImageResult] = useState<
    {
      title: string
      data: any[]
    }[]
  >([])

  const [form, setForm] = useState<ProductionCounterType>({
    automaticContainerRejection: {
      atStartEndOfGap: 0,
      dueToDangerousGap: 0,
      dueToFaultOnNextMachine: 0,
      dueToFaultyBlowingProcess: 0,
      dueToIncorrectFillLevel: 0,
      dueToLabelFault: 0,
      dueToLackOfBlowAirPres: 0,
      dueToMachineMalfunctionWhileInOperation: 0,
      dueToMachineStop: 0,
      dueToTempTooHighLow: 0,
      throughContainerGap: 0,
      totalRejectedContainers: 0,
    },
    containerRejectionByPETView: {
      bottles: 0,
    },
    manualContainerRejection: {
      dueToLabeller: 0,
      dueToServiceRejection: 0,
      dueToStationDisconnection: 0,
      inBlowingWheelDischarge: 0,
      inBlowingWheelInfeed: 0,
      throughFiller: 0,
    },
    total: {
      bottleDischarge: 0,
      preformInfeed: 0,
    },
  })

  const onlaunchCamera = async () => {
    try {
      const result = await getResultImageCamera()
      if (!result) {
        return
      }
      if (!result?.canceled) {
        performOCR(result?.assets[0])

        // Set the selected image in state
      } else {
        console.log("Cancel scan")
      }
    } catch (error) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "បរាជ័យ",
        textBody: "សូម​ព្យាយាម​ម្តង​ទៀត",
        // button: 'close',
        autoClose: 100,
      })
    }
  }
  const onlaunchGallery = async () => {
    try {
      setScanning(true)
      const result = await getResultImageGallery()
      if (!result) {
        setScanning(false)
        return
      }
      if (!result.canceled) {
        performOCR(result?.assets[0])
        // Set the selected image in state
      }
    } catch (error) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "បរាជ័យ",
        textBody: "សូម​ព្យាយាម​ម្តង​ទៀត",
        // button: 'close',
        autoClose: 100,
      })
    }
  }
  const performOCR = async (file: ImagePicker.ImagePickerAsset) => {
    setScanning(true)

    try {
      const result = await ImagetoText(file)
      if (!result) {
        Dialog.show({
          type: ALERT_TYPE.WARNING,
          title: "រក​មិនឃើញ",
          autoClose: 500,
          textBody: "យើងមិនអាចស្រង់ចេញបានទេ។",
        })
        setScanning(false)
        return
      }

      const allText: string[] = result["annotations"]

      let preformIndex: number[] = []
      // const data = {
      //   total: {
      //     preformInfeed: 0,
      //     bottleDischarge: 0,
      //   },
      //   automaticContainerRejection: {
      //     dueToTempTooHighLow: 0,
      //     dueToFaultyBlowingProcess: 0,
      //     dueToLackOfBlowAirPres: 0,
      //     dueToMachineMalfunctionWhileInOperation: 0,
      //     dueToFaultOnNextMachine: 0,
      //     dueToMachineStop: 0,
      //     atStartEndOfGap: 0,
      //     dueToDangerousGap: 0,
      //     throughContainerGap: 0,
      //     dueToLabelFault: 0,
      //     dueToIncorrectFillLevel: 0,
      //     totalRejectedContainers: 0,
      //   },
      //   manualContainerRejection: {
      //     inBlowingWheelInfeed: 0,
      //     dueToStationDisconnection: 0,
      //     dueToServiceRejection: 0,
      //     inBlowingWheelDischarge: 0,
      //     dueToLabeller: 0,
      //     throughFiller: 0,
      //   },
      //   containerRejectionByPETView: {
      //     bottles: 0,
      //   },
      // }
      const data = {
        total: {
          preformInfeed: 0,
          bottleDischarge: 0,
        },
        automaticContainerRejection: {
          dueToTempTooHighLow: 0,
          dueToFaultyBlowingProcess: 0,
          dueToLackOfBlowAirPres: 0,
          dueToMachineMalfunctionWhileInOperation: 0,
          dueToFaultOnNextMachine: 0,
          dueToMachineStop: 0,
          atStartEndOfGap: 0,
          dueToDangerousGap: 0,
          throughContainerGap: 0,
          dueToLabelFault: 0,
          dueToIncorrectFillLevel: 0,
          totalRejectedContainers: 0,
        },
        manualContainerRejection: {
          inBlowingWheelInfeed: 0,
          dueToStationDisconnection: 0,
          dueToServiceRejection: 0,
          inBlowingWheelDischarge: 0,
          dueToLabeller: 0,
          throughFiller: 0,
        },
        containerRejectionByPETView: {
          bottles: 0,
        },
      }
      allText?.forEach((text, index) => {
        // console.log(index, text)
        if (text.toLowerCase() === "preform") {
          preformIndex.push(index)
          if (allText[index + 1].toLowerCase() === "infeed") {
            // console.log("found index 1 ",index, )
            const value = +allText[index + 2]

            data.total.preformInfeed = typeof value === "number" ? value : 0
          }
        }
        if (text.toLowerCase() === "bottle") {
          if (allText[index + 1].toLowerCase() === "discharge") {
            // console.log("found index 1 ",index, )
            const value = +allText[index + 2]

            data.total.bottleDischarge = typeof value === "number" ? value : 0
          }
        }
        if (text.toLowerCase() === "high/low") {
          if (allText[index + 1].toLowerCase() === "low") {
            // console.log("found index 1 ",index, )
            const value = +allText[index + 2]

            data.automaticContainerRejection.dueToTempTooHighLow =
              typeof value === "number" ? value : 0
          }
        }
        if (text.toLowerCase() === "blowing") {
          if (allText[index + 1].toLowerCase() === "process") {
            // console.log("found index 1 ",index, )
            const value = +allText[index + 2]

            data.automaticContainerRejection.dueToFaultyBlowingProcess =
              typeof value === "number" ? value : 0
          }
        }
        if (text.toLowerCase() === "in") {
          if (allText[index + 1].toLowerCase() === "operation") {
            // console.log("found index 1 ",index, )
            const value = +allText[index + 2]

            data.automaticContainerRejection.dueToLackOfBlowAirPres =
              typeof value === "number" ? value : 0
          }
        }
        if (text.toLowerCase() === "next") {
          if (allText[index + 1].toLowerCase() === "machine") {
            // console.log("found index 1 ",index, )
            const value = +allText[index + 2]

            data.automaticContainerRejection.dueToMachineMalfunctionWhileInOperation =
              typeof value === "number" ? value : 0
          }
        }
        if (text.toLowerCase() === "machine") {
          if (allText[index + 1].toLowerCase() === "stop") {
            // console.log("found index 1 ",index, )
            const value = +allText[index + 2]

            data.automaticContainerRejection.dueToMachineStop =
              typeof value === "number" ? value : 0
          }
        }
        if (text.toLowerCase() === "of") {
          if (allText[index + 1].toLowerCase() === "gap") {
            // console.log("found index 1 ",index, )
            const value = +allText[index + 2]

            data.automaticContainerRejection.atStartEndOfGap = typeof value === "number" ? value : 0
          }
        }
        if (text.toLowerCase() === "dangerous") {
          if (allText[index + 1].toLowerCase() === "gap") {
            // console.log("found index 1 ",index, )
            const value = +allText[index + 2]

            data.automaticContainerRejection.dueToDangerousGap =
              typeof value === "number" ? value : 0
          }
        }
        if (text.toLowerCase() === "container") {
          if (allText[index + 1].toLowerCase() === "gap") {
            // console.log("found index 1 ",index, )
            const value = +allText[index + 2]

            data.automaticContainerRejection.throughContainerGap =
              typeof value === "number" ? value : 0
          }
        }
        if (text.toLowerCase() === "label") {
          if (allText[index + 1].toLowerCase() === "fault") {
            // console.log("found index 1 ",index, )
            const value = +allText[index + 2]

            data.automaticContainerRejection.dueToLabelFault = typeof value === "number" ? value : 0
          }
        }
        if (text.toLowerCase() === "fill") {
          if (allText[index + 1].toLowerCase() === "level") {
            // console.log("found index 1 ",index, )
            const value = +allText[index + 2]

            data.automaticContainerRejection.dueToIncorrectFillLevel =
              typeof value === "number" ? value : 0
          }
        }
        if (text.toLowerCase() === "rejected") {
          if (allText[index + 1].toLowerCase() === "containers") {
            // console.log("found index 1 ",index, )
            const value = +allText[index + 2]

            data.automaticContainerRejection.totalRejectedContainers =
              typeof value === "number" ? value : 0
          }
        }

        if (text.toLowerCase() === "wheel") {
          if (allText[index + 1].toLowerCase() === "infeed") {
            // console.log("found index 1 ",index, )
            const value = +allText[index + 2]

            data.manualContainerRejection.inBlowingWheelDischarge =
              typeof value === "number" ? value : 0
          }
        }
        if (text.toLowerCase() === "station") {
          if (allText[index + 1].toLowerCase() === "disconnection") {
            // console.log("found index 1 ",index, )
            const value = +allText[index + 2]

            data.manualContainerRejection.dueToStationDisconnection =
              typeof value === "number" ? value : 0
          }
        }
        if (text.toLowerCase() === "service") {
          if (allText[index + 1].toLowerCase() === "rejection") {
            // console.log("found index 1 ",index, )
            const value = +allText[index + 2]

            data.manualContainerRejection.dueToServiceRejection =
              typeof value === "number" ? value : 0
          }
        }

        if (text.toLowerCase() === "wheel") {
          if (allText[index + 1].toLowerCase() === "discharge") {
            // console.log("found index 1 ",index, )
            const value = +allText[index + 2]

            data.manualContainerRejection.inBlowingWheelDischarge =
              typeof value === "number" ? value : 0
          }
        }
        if (text.toLowerCase() === "the") {
          if (allText[index + 1].toLowerCase() === "labeller") {
            // console.log("found index 1 ",index, )
            const value = +allText[index + 2]

            data.manualContainerRejection.dueToLabeller = typeof value === "number" ? value : 0
          }
        }
        if (text.toLowerCase() === "the") {
          if (allText[index + 1].toLowerCase() === "filler") {
            // console.log("found index 1 ",index, )
            const value = +allText[index + 2]

            data.manualContainerRejection.throughFiller = typeof value === "number" ? value : 0
          }
        }
        if (text.toLowerCase() === "bottles") {
          // console.log("found index 1 ",index, )
          const value = +allText[index + 1]

          data.containerRejectionByPETView.bottles = typeof value === "number" ? value : 0
        }
      })
      // console.log("after sccan data is", data)
      const imagesArr = []
      for (const [key, values] of Object.entries(data)) {
        // console.log(key, values)
        imagesArr.push({
          title: key,
          data: Object.entries(values).map(([key, value]) => ({ [key]: value })),
        })
        // imagesArr.push({
        //   title: key,
        //   data: Object.entries(values).map(([key, value]) => ({ [key]: value })),
        // })
      }
      setForm(data)
      setImageResult(imagesArr)

      // setImageResult(filteredAnnotations)
    } catch (error) {
      console.error(error.message)
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "បរាជ័យ",
        autoClose: 500,
        textBody: "ស្កែនរូបភាពទៅជាអត្ថបទមិនជោគជ័យទេ។",
      })
    } finally {
      setScanning(false)
    }
  }

  console.log("Data ", form?.total)

  return (
    <View style={$root}>
      <KeyboardAvoidingView behavior={"padding"} keyboardVerticalOffset={100} style={[$root]}>
        {isScanning && <LoadingIndicator placeholder={translate("wtpcommon.loadingData")} />}
        <ScrollView>
          <View style={$outerContainer}>
            <ActivityBar
              direction="start"
              onScanCamera={onlaunchCamera}
              onAttachment={onlaunchGallery}
              hideActivityLog
            />

            {/* <View>
            <SectionList
              sections={imageResult}
              ListEmptyComponent={<EmptyFallback placeholder="Please Scan your machine" />}
              keyExtractor={(item, index) => item + index}
              renderItem={({ item }) => {
                const key = Object.keys(item)[0] // Get the key of the item
                const value = item[key] // Get the value of the item
                return (
                  <View style={{ flexDirection: "row", gap: 10, marginVertical: 10 }}>
                    <Text regular body2>
                      {key}
                    </Text>
                    <Text semibold body2>
                      {value !== undefined ? value : <Text errorColor>unknown</Text>}
                    </Text>
                  </View>
                )
              }}
              renderSectionHeader={({ section: { title } }) => (
                <View style={{ marginVertical: 20 }}>
                  <Text title3 semibold style={{ marginBottom: 10 }}>
                    {title}
                  </Text>
                  <Divider />
                </View>
              )}
            />
          </View> */}

            <TotalSection headerTitle={"Total"} data={form?.total} />

            <View style={$useRow}>
              <View style={{ flex: 1 }}>
                <AutomaticSection
                  data={form?.automaticContainerRejection}
                  headerTitle={"Automatic Container Rejection"}
                />
              </View>
              <View style={{ flex: 1 }}>
                <ManualContainerSection
                  data={form?.manualContainerRejection}
                  headerTitle="Manual Container Rejection"
                />
                <ContainerRejection
                  data={form?.containerRejectionByPETView}
                  headerTitle="Container Rejection By Pet-View"
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
})

const $root: ViewStyle = {
  flex: 1,
  backgroundColor: "white",
}
const $useRow: ViewStyle = {
  flexDirection: "row",
  gap: 25,
  alignContent: "center",
}
const $outerContainer: ViewStyle = {
  margin: 15,
  marginTop: 20,
  padding: 10,
  gap: 20,
  paddingBottom: 80,
}
