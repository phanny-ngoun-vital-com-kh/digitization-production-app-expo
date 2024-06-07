import React from "react"
import Icon from "react-native-vector-icons/AntDesign"
import { Text } from "app/components/v2"
import styles from "./styles"
import { TouchableOpacity, View } from "react-native"
import { Divider } from "react-native-paper"
import { $containerHorizon } from "app/screens"
import { MACHINE_STATE, MachinePanelProps } from "./type"
import BadgeWarning from "../Badgewarn"
import { useStores } from "app/models"

const MachinePanel = ({
  machine_type = "Raw Water Stock",
  status = "normal",
  assign_to = "Vicheaka",
  time = "7:00",
  created_date,
  id,
  currUser,
  assign_to_user,
  warning_count = 0,
  handleAssigntask,
  onPress,
}: MachinePanelProps) => {
  const getStatus = (status: MACHINE_STATE) =>
    status === "normal" ? "#0081F8" : status === "pending" ? "#8CC8FF" : "red"
  // console.log(assign_to_user?.split(" "))
  return (
    <View
      style={{
        backgroundColor: "white",
        marginBottom: 10,
        elevation: 6,
        borderRadius: 0,
        overflow: "hidden",
      }}
    >
      <TouchableOpacity style={{ paddingHorizontal: 10, paddingVertical: 5 }} onPress={onPress}>
        <View style={{ width: 180, position: "relative" }}>
          <View style={$containerHorizon}>
            <Text semibold headline>
              {machine_type}
            </Text>
          </View>

          {!!warning_count && (
            <View style={{ left: 110, top: 1 }}>
              <BadgeWarning value={+warning_count} status="warning" />
            </View>
          )}
        </View>

        <View style={$containerHorizon}>
          <View style={[{ backgroundColor: getStatus(status) }, styles.machinePanel]}></View>
          <Text caption1>{status}</Text>
        </View>

        <Divider
          style={{
            height: 5,
            marginVertical: 18,
            backgroundColor: getStatus(status),
          }}
        />

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
          <View style={[$containerHorizon, { gap: 20 }]}>
            {assign_to_user?.split(" ").includes(currUser ?? "") && (
              <View style={$containerHorizon}>
                <Icon name="checkcircle" size={18} color="#40A578" />
                <Text semibold caption1 style={{ marginLeft: 5, color: "#40A578" }}>
                  You are assigned
                </Text>
              </View>
            )}

            {/* <View style={$containerHorizon}>
              <Icon name="search1" size={20} color="black" />
              <Text semibold caption1>
                Assign to : {assign_to}
              </Text>
            </View> */}
            <View style={$containerHorizon}>
              <Icon name="clockcircleo" style={{ marginRight: 5 }} size={18} color="black" />
              <Text semibold caption1>
                {time}
              </Text>
            </View>
            <View style={$containerHorizon}>
              <Icon name="calendar" size={20} color="black" />
              <Text semibold caption1 style={{ marginLeft: 5 }}>
                {created_date?.toString()}
              </Text>
            </View>
          </View>

          <View>
            <TouchableOpacity>
              <Icon name="right" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>
    

        {status === "pending" && 
        
        assign_to_user?.split(" ").includes(currUser ?? "") === false  ? (
          <View
            style={[
              $containerHorizon,
              { justifyContent: "center", alignItems: "center", marginBottom: 20, marginTop: 15 },
            ]}
          >
            <TouchableOpacity
              onPress={() => handleAssigntask!(id, assign_to_user)}
              style={$containerHorizon}
            >
              <Icon name="edit" size={18} color="#0081F8" />
              <Text semibold caption1 style={{ marginLeft: 5, color: "#0081F8" }}>
                Enroll this task
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={[
              $containerHorizon,
              { justifyContent: "center", alignItems: "center", marginBottom: 20, marginTop: 15 },
            ]}
          >
            <TouchableOpacity
              onPress={() => handleAssigntask!(id, assign_to_user)}
              style={$containerHorizon}
            >
              <Icon name="closecircle" size={18} color="#D32600" />
              <Text semibold caption1 style={{ marginLeft: 5, color: "#D32600" }}>
                Unassign this task
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    </View>
  )
}

export default MachinePanel
