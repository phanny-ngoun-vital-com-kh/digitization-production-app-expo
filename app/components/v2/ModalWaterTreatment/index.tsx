import React, { useEffect, useState } from "react"
import { Modal, View, FlatList, TouchableOpacity, ViewStyle, Platform } from "react-native"
import Icon from "react-native-vector-icons/Fontisto"
import { BaseStyle, useTheme } from "app/theme-v2"
import styles from "./styles"
import { Text, TextInput, Button } from ".."
import IconAntDesign from "react-native-vector-icons/AntDesign"
import { DataTable, Divider, ProgressBar } from "react-native-paper"
import { Shift, WaterPlant } from "app/screens/water-treatment-plan/type"
import { Dropdown } from "react-native-element-dropdown"
import DatePicker from "@react-native-community/datetimepicker"

interface ModalProps {
  isVisible: boolean
  onClose: () => void
  textChange: (text: string) => void
  onSubmit: (item: string) => void
  data: Shift[]
}

const ModalWaterTreatment: React.FC<ModalProps> = ({
  isVisible,
  onClose,
  textChange,
  onSubmit,
  data,
}) => {
  const handleSubmit = (item: any) => {
    onSubmit(item)
  }

  const [statusMachine, setStatusMachine] = useState([
    {
      type: "Raw Water Stock",
      shifts: [
        {
          id: 1,
          iscompleted: false,
        },
        {
          id: 2,
          iscompleted: false,
        },
      ],
    },
    {
      type: "Sand Filter",
      shifts: [
        {
          id: 1,
          iscompleted: false,
        },
        {
          id: 2,
          iscompleted: false,
        },
      ],
    },
    {
      type: "Carbon Filter",
      shifts: [
        {
          id: 1,
          iscompleted: false,
        },
        {
          id: 2,
          iscompleted: false,
        },
      ],
    },
    {
      type: "Microfilter 5Mm",
      shifts: [
        {
          id: 1,
          iscompleted: false,
        },
        {
          id: 2,
          iscompleted: false,
        },
      ],
    },
    {
      type: "Microfilter 1Mm",
      shifts: [
        {
          id: 1,
          iscompleted: false,
        },
        {
          id: 2,
          iscompleted: false,
        },
      ],
    },
    {
      type: "Reverses Osmosis",
      shifts: [
        {
          id: 1,
          iscompleted: false,
        },
        {
          id: 2,
          iscompleted: false,
        },
      ],
    },
  ])
  const machines_type = [
    "Raw Water Stock",
    "Sand Filter",
    "Carbon Filter",
    "Resin Filter",
    "MicroFilter 5mm",
    "MicroFilter 1mm",
    "Machine",
    "Reverses Osmosisv",
  ]

  const calculateProgress = (shifts) => {
    const completedCount = shifts.reduce((count, shift) => count + (shift.iscompleted ? 1 : 0), 0)
    console.log(completedCount)

    return completedCount / shifts.length // Progress is the ratio of completed shifts to total shifts
  }

  const calculateProgressColor = (shifts) => {
    const completedCount = shifts.reduce((count, shift) => count + (shift.iscompleted ? 1 : 0), 0)
    return completedCount === shifts.length ? "green" : "gray" // If all shifts are completed, color is green; otherwise, it's red
  }
  const calculateProgressText = (shifts) => {
    const completedCount = shifts.reduce((count, shift) => count + (shift.iscompleted ? 1 : 0), 0)
    return `${completedCount}/${shifts.length}` // Display completedCount/totalShifts
  }
  // console.log(statusMachine)

  // useEffect(() => {
  //   const machines = data?.map((item) => item.machines)[0]
  //   const shifts = data?.map((item) => item.shift)
  //   // // console.log(shifts)
  //   // const copy = statusMachine.slice()

  //   // if (machines) {
  //   //   for (let i = 0; i <= copy.length; i++) {
  //   //     if (machines[i] === copy[i]?.type) {

  //   //       console.log(copy[i])
  //   //       copy[i].shifts = copy[i].shifts.map((item, index) => {
  //   //         if (item.id === shifts[0]) {
  //   //           copy[i].shifts[index].iscompleted = true
  //   //         }
  //   //         if (item.id === shifts[1]) {
  //   //           copy[i].shifts[index].iscompleted = true
  //   //         }
  //   //         return item
  //   //       })
  //   //     }
  //   //   }
  //   // }

  //   // setStatusMachine(copy)

  //   // return () => setStatusMachine([])
  //   // setStatusMachine(
  //   //   statusMachine.map((item) => {
  //   //     if (machinesToCheck?.includes(item.type)) {
  //   //       item.shifts = item.shifts.map((shift) =>
  //   //         shifts.includes(shift.id) ? { ...shift, iscompleted: true } : { ...shift },
  //   //       )
  //   //     } else {
  //   //       item.shifts = item.shifts.map((shift) =>
  //   //       shifts.includes(shift.id) ? { ...shift, iscompleted: false } : { ...shift },
  //   //       )
  //   //     }
  //   //     return item
  //   //   }),
  //   // )
  //   // Find the machine type in statusMachine

  //   // Update the state with the updated statusMachine
  // }, [data])

  const [datepicker, setDatePicker] = useState(new Date(Date.now()))
  const [showdate, setShowDate] = useState(false)
  const [selectshift, setShift] = useState("")
  const shifts = [
    {
      id: 1,
      name: "shift 1",
      schedules: ["7:00:00", "13:00:00"],
    },
    {
      id: 2,
      name: "shift 2",
      schedules: ["18:00:00", "22:00:00"],
    },
  ]
  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.model}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
          >
            <View style={{ flexDirection: "row" }}>
              <Text style={{ margin: 5, fontSize: 18, marginTop: 20 }}>
                {" "}
                Water Treatment Schedule
              </Text>
          
            </View>
       
            <View>
              <TouchableOpacity onPress={onClose}>
                <Icon name="close-a" size={20} />
              </TouchableOpacity>
            </View>
          </View>
     <Divider />
          <View style={{ flexDirection: "column", height: 100, marginTop: 5 }}>
            <View style={[$useflex]}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ margin: 5, color: "red", fontSize: 18 }}>*</Text>
                <Text style={{ margin: 5, fontSize: 18 }}> Date</Text>
              </View>
              <View style={{}}>
                <TouchableOpacity onPress={() => setShowDate(true)} style={styles.date_button}>
                  <Text style={{ marginLeft: 10, fontSize:22}}>
                    {datepicker.toDateString() || "Show Picker"}
                  </Text>
                </TouchableOpacity>

                {/* <View style={{ width: "100%" }}>
                  <Text caption1 errorColor>
                    សូមជ្រើសរើស Date
                  </Text>
                </View> */}
              </View>
            </View>
          </View>
          
          <Button
            style={{ backgroundColor: "#2292EE"}}
            onPress={() => {
                handleSubmit(false)
            }}
          >
            <Text style={{ color: "white" }}>Start</Text>
          </Button>
        </View>
      </View>
    </Modal>
  )
}
const $useflex: ViewStyle = {
  flex: 1,
}
const $containerHorizon: ViewStyle = {
  flexDirection: "row",
  marginTop: 20,
}
export default ModalWaterTreatment
