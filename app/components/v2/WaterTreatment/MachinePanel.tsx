import React from "react"
import Icon from "react-native-vector-icons/AntDesign"
import { default as IconFontA5 } from "react-native-vector-icons/FontAwesome5"
import { Text } from "app/components/v2"
import styles from "./styles"
import { TouchableOpacity, View } from "react-native"
import { Divider } from "react-native-paper"
import { $containerHorizon } from "app/screens"
import { MACHINE_STATE, MachinePanelProps } from "./type"
import BadgeWarning from "../Badgewarn"
import { translate } from "../../../i18n/translate"
import moment from "moment"
import BadgeOutofdate from "../BadgePanel"

const MachinePanel = ({
  machine_type = "Raw Water Stock",
  status = "normal",
  assign_to = "Vicheaka",
  isAssign = false,
  time = "7:00",
  created_date,
  validDate,
  handleShowdialog,
  validShift,
  id,
  currUser,
  assign_to_user,
  warning_count = 0,
  handleAssigntask,
  onPress,
}: MachinePanelProps) => {
  const getStatus = (status: MACHINE_STATE) =>
    status === "normal" ? "#0081F8" : status === "pending" ? "#8CC8FF" : "red"

  return (
    <View
      style={{
        backgroundColor: validDate && validShift === -1 ? "white" : "#EEEEEE",
        marginBottom: 10,
        elevation: 6,
        borderRadius: 0,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <TouchableOpacity
        style={{ paddingHorizontal: 10, paddingVertical: 5 }}
        onPress={() => {
          onPress(validShift)
        }}
      >
        <View style={{ width: 180, position: "relative" }}>
          <View style={[$containerHorizon, { justifyContent: "space-between" }]}>
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
            {isAssign && (
              <View style={$containerHorizon}>
                <Icon name="checkcircle" size={18} color="green" />
                <Text semibold caption1 style={{ marginLeft: 5, color: "green" }}>
                  {/* You are assigned */}
                  {translate("wtpcommon.youareApproved")}
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
                {moment(created_date).format("LL")}
              </Text>
            </View>
            {assign_to_user ? (
              <View style={$containerHorizon}>
                <IconFontA5
                  name="user-friends"
                  style={{ marginRight: 5 }}
                  size={16}
                  color="black"
                />
                <Text semibold caption1>
                  {assign_to_user?.split(" ")?.length}
                </Text>
              </View>
            ) : (
              <View style={$containerHorizon}>
                <IconFontA5
                  name="user-friends"
                  style={{ marginRight: 5 }}
                  size={16}
                  color="black"
                />
                <Text semibold caption1>
                  0
                </Text>
              </View>
            )}
          </View>

          <View>
            <TouchableOpacity>
              <Icon name="right" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>

      {status === "pending" && assign_to_user?.split(" ").includes(currUser ?? "") === false ? (
        validDate && validShift === -1 ? (
          <View
            style={[
              $containerHorizon,
              { justifyContent: "center", alignItems: "center", marginBottom: 20, marginTop: 15,gap:25 },
            ]}
          >
            <TouchableOpacity
              onPress={() => handleAssigntask!(id, assign_to_user, assign_to_user?.split(" "))}
              style={$containerHorizon}
            >
              <Icon name="edit" size={18} color="#0081F8" />
              <Text semibold caption1 style={{ marginLeft: 5, color: "#0081F8" }}>
                {/* Enroll this task */}

                {translate("wtpcommon.enrollMyTask")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleShowdialog!(assign_to_user?.split(" "))}
              style={$containerHorizon}
            >
              <Icon name="eye" size={18} color="#0081F8" />
              <Text semibold caption1 style={{ marginLeft: 5 }} primaryColor>
                {translate("wtpcommon.viewAssignment")}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <BadgeOutofdate placeholder={

            
            translate("wtpcommon.outDate")
          
          
          } />
        )
      ) : validDate && validShift === -1 ? (
        <View
          style={[
            $containerHorizon,
            { justifyContent: "center", alignItems: "center", marginVertical: 25, gap: 25 },
          ]}
        >
          {isAssign ? (
            <TouchableOpacity
              onPress={() => handleAssigntask!(id, assign_to_user, assign_to_user?.split(" "))}
              style={$containerHorizon}
            >
              <Icon name="closecircle" size={18} color="#D32600" />
              <Text semibold caption1 style={{ marginLeft: 5, color: "#D32600" }}>
                {translate("wtpcommon.unassignMyTask")}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => handleAssigntask!(id, assign_to_user, assign_to_user?.split(" "))}
              style={$containerHorizon}
            >
              <Icon name="edit" size={18} color="#0081F8" />
              <Text semibold caption1 style={{ marginLeft: 5, color: "#0081F8" }}>
                {/* Enroll this task */}

                {translate("wtpcommon.enrollMyTask")}
              </Text>
            </TouchableOpacity>
          )}

          <View style={[$containerHorizon, { justifyContent: "center", alignItems: "center" }]}>
            <TouchableOpacity
              onPress={() => handleShowdialog!(assign_to_user?.split(" "))}
              style={$containerHorizon}
            >
              <Icon name="eye" size={18} color="#0081F8" />
              <Text semibold caption1 style={{ marginLeft: 5 }} primaryColor>
                {translate("wtpcommon.viewAssignment")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <BadgeOutofdate placeholder={translate("wtpcommon.outDate")} />
        </>
      )}
      {/* 
      {!validDate ||
        (!validShift && (
          <View
            style={[
              $containerHorizon,
              { justifyContent: "center", alignItems: "center", marginVertical: 25 },
            ]}
          >
            <TouchableOpacity
              onPress={() => handleShowdialog!(assign_to_user?.split(" "))}
              style={$containerHorizon}
            >
              <Icon name="eye" size={18} color="#0081F8" />
              <Text semibold caption1 style={{ marginLeft: 5 }} primaryColor>
                {translate("wtpcommon.viewAssignment")}
              </Text>
            </TouchableOpacity>
          </View>
        ))} */}

      {!(validDate === true && validShift === -1) && (
        <View
          style={[
            $containerHorizon,
            { justifyContent: "center", alignItems: "center", marginBottom: 20 },
          ]}
        >
          <TouchableOpacity
            onPress={() => handleShowdialog!(assign_to_user?.split(" "))}
            style={$containerHorizon}
          >
            <Icon name="eye" size={18} color="#0081F8" />
            <Text semibold caption1 style={{ marginLeft: 5 }} primaryColor>
              {translate("wtpcommon.viewAssignment")}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

export default MachinePanel
