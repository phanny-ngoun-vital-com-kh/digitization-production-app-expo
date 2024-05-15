import React, { useEffect, useRef, useState } from "react"
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  FlatList,
  ActivityIndicator,
} from "react-native"
import { styles } from "./styles"
import Icon from "react-native-dynamic-vector-icons"
import { Text } from ".."
import moment from "moment"
import { Checkbox, DataTable } from "react-native-paper"
import { useTheme } from "app/theme-v2"
import { Shift } from "app/screens/water-treatment-plan/type"
import WaterTreatmentTable from "../WaterTreatment/water-treatment-form"
import WaterTreatmentForm from "../WaterTreatment/water-treatment-form"

interface ModalProps {
  isVisible: boolean
  onClose: () => void
  data: Shift
  isLoading: boolean
  handleSubmitForm: (item: any) => void
}

const RightSliderModal: React.FC<ModalProps> = ({
  data,
  isVisible,
  onClose,
  isLoading,
  handleSubmitForm,
}) => {
  const slideAnimation = useRef(new Animated.Value(0)).current

  const { colors } = useTheme()
  useEffect(() => {
    if (isVisible) {
      slideIn()
    } else {
      slideOut()
    }
  }, [isVisible])

  const slideIn = () => {
    Animated.timing(slideAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }

  const slideOut = () => {
    Animated.timing(slideAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose() // Close the modal after the slide-out animation completes
    })
  }

  const slideFromRight = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  })

  return (
    <Modal animationType="none" transparent={true} visible={isVisible} onRequestClose={onClose}>
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <TouchableOpacity activeOpacity={1} style={styles.overlay}>
          <Animated.View
            style={[styles.container, { transform: [{ translateX: slideFromRight }] }]}
          >
            {/* <View style={styles.modal}> */}
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 17 }}>Water Plant Treatment 2 Detail</Text>
              <TouchableOpacity onPress={onClose}>
                <Icon name="close" size={30} />
              </TouchableOpacity>
            </View>
            <View style={styles.divider}></View>

            <WaterTreatmentForm
              data={data}
              handlePress={(item) => {
                // setRecord(item)

                handleSubmitForm(item)
              }}
              type={data?.type || "A"}
            />
            {/* {data && (
              <View>
                <View style={styles.view_main}>
                  <View style={styles.view_sub}>
                    <Text style={styles.text_main}>Machine: </Text>
                    <Text style={styles.text_sub}>{data?.machines ?? "N/A"}</Text>
                  </View>
                  <View style={styles.view_sub}>
                    <Text style={styles.text_main}>Time: </Text>
                    <Text style={styles.text_sub}>{data?.time}</Text>
                  </View>
                  <View style={styles.view_sub}>
                    <Text style={styles.text_main}>Posting Date: </Text>
                    <Text style={styles.text_sub}>{moment(Date.now()).format("YYYY-MM-DD")}</Text>
                  </View>
                </View>
                <View style={styles.view_main}>
                  <View style={styles.view_sub}>
                    <Text style={styles.text_main}>TDS: </Text>
                    <Text style={styles.text_sub}>{data?.tsd_ppm ?? ""} ppm</Text>
                  </View>
                  <View
                    style={[
                      styles.view_sub,
                      {
                        display: data?.temperature ? "flex" : "none",
                      },
                    ]}
                  >
                    <Text style={styles.text_main}>Temperature: </Text>
                    <Text style={styles.text_sub}> {data?.temperature ?? "N / A"} c</Text>
                  </View>
                  <View style={styles.view_sub}>
                    <Text style={styles.text_main}>Check By: </Text>
                    <Text style={styles.text_sub}>{data?.checked_by ?? "N / A"} </Text>
                  </View>
                </View>
                <View style={styles.view_main}>
                  <View style={styles.view_sub}>
                    <Text style={styles.text_main}>Status: </Text>
                    <Text
                      style={[
                        styles.text_sub,
                        { color: data?.inspection_status ? "#2292EE" : "red" },
                      ]}
                    >
                      {data?.inspection_status ? "completed" : "pending"}
                    </Text>
                  </View>

                  <View style={styles.view_sub}>
                    <Text style={styles.text_main}>PH: </Text>
                    <Text style={styles.text_sub}>{data?.ph_level ?? "N/A"}</Text>
                  </View>
                  <View style={styles.view_sub}>
                    <Text style={styles.text_main}>Other: </Text>
                    <Text style={styles.text_sub}>N / A</Text>
                  </View>
                </View>

                {data?.press_inlet && (
                  <View style={styles.view_main}>
                    <View style={styles.view_sub}>
                      <Text style={styles.text_main}>Press-inlet: </Text>
                      <Text style={styles.text_sub}>{data?.press_inlet ?? 0} Mpa</Text>
                    </View>
                    <View style={styles.view_sub}>
                      <Text style={styles.text_main}>Press-Treat: </Text>
                      <Text style={styles.text_sub}> {data?.press_treat ?? 0} Mpa</Text>
                    </View>
                    <View style={styles.view_sub}>
                      <Text style={styles.text_main}>Press-Drain: </Text>
                      <Text style={styles.text_sub}>{data?.press_drain} Mpa</Text>
                    </View>

                    <View style={styles.view_sub}>
                      <Text style={styles.text_main}>Odor: </Text>
                      <Text style={styles.text_sub}>{data?.odor ? "Yes" : "No"}</Text>
                    </View>
                    <View style={styles.view_sub}>
                      <Text style={styles.text_main}>Smell: </Text>
                      <Text style={styles.text_sub}>{data?.taste ? "Yes" : "No"}</Text>
                    </View>
                  </View>
                )}

                <View style={[styles.view_main, { marginBottom: "2%" }]}>
                  <Text>
                    {data?.pressure !== 0 && (
                      <View style={styles.view_sub}>
                        <Text style={styles.text_main}>Pressure: </Text>
                        <Text style={styles.text_sub}>{data?.pressure ?? 0} Mpa</Text>
                      </View>
                    )}
                  </Text>

                  <Text>
                    {data?.air_release != null && (
                      <View style={styles.view_sub}>
                        <Text style={styles.text_main}>Air Released: </Text>
                        <Text style={styles.text_sub}>{data?.air_release ? "Yes" : "No"} </Text>
                      </View>
                    )}
                  </Text>
                </View>

                <View style={styles.divider}></View>
              </View>
            )} */}

          </Animated.View>
        </TouchableOpacity>
      )}
    </Modal>
  )
}

export default RightSliderModal
