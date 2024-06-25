import React from "react"
import Icon from "react-native-vector-icons/FontAwesome"
import styles from "./styles"
import { Text } from "app/components/v2"
import { View, TouchableOpacity, FlatList } from "react-native"
import { Activities } from "app/models/water-treatment/water-treatment-model"
import moment from "moment"
import EmptyFallback from "app/components/EmptyFallback"
import { Modal } from "react-native-paper"
import { HaccpActionType } from "app/models/haccp-monitoring/haccp-lines-model"
import {translate} from "../../../i18n/translate"
interface ActivityModalProps {
  isVisible: boolean
  title?: string
  onClose: () => void
  type?: "default" | "roles"
  log: Activities[] | HaccpActionType[] | string[] | null
}

const ActivityModal = ({
  title = "Activity Log",
  isVisible = true,
  onClose,
  log = [],
  type ="default",
}: ActivityModalProps) => {
  return (
    <Modal
      visible={isVisible}
      onDismiss={onClose}
      style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 0 }}
      contentContainerStyle={styles.modalContainer}
    >
      <View style={styles.modalContent}>
        {/* <View style={styles.header}>
          <Text title3 whiteColor regular>
            Activity Log
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Icon size={22.5} name="close" color={"white"} />
          </TouchableOpacity>
        </View> */}

        <FlatList
          showsVerticalScrollIndicator
          persistentScrollbar
          // stickyHeaderIndices={[0]}
          stickyHeaderIndices={[0]}
          ListHeaderComponent={() => (
            <View style={styles.header}>
              <Icon
                name={"user"}
                size={25}
                color="white"
                style={{ marginBottom: 10, marginLeft: 10 }}
              />

              <Text title3 whiteColor regular>
            
                {
                  translate("dailyWaterTreatment.activityLog")
                }
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Icon size={22.5} name="close" color={"white"} />
              </TouchableOpacity>
            </View>
          )}
          data={log || []}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.flatListContent}
          ListEmptyComponent={<EmptyFallback placeholder={translate("wtpcommon.noactivityFound")} />}
          renderItem={({ item, index }) => {
            return type === "default" ? (
              <View style={styles.listItem} key={index.toString()}>
                <Text title1>{`\u2022 `}</Text>
                <Text body2>
                  {moment(item?.actionDate).format("LLL") ?? Date.now().toLocaleString()} :{" "}
                  {item?.actionBy} {item?.action}
                </Text>
              </View>
            ) : (
              <View style={[styles.listItem, { alignItems: "center" }]} key={index.toString()}>
                <Icon
                  name={"check"}
                  size={20}
                  color="black"
                  style={{ marginLeft: 10 }}
                />

                <Text body1> This line has assigned to {item}</Text>
              </View>
            )
          }}
        />
        {!log?.length ? <View style={{ marginBottom: 100 }}></View> : <></>}
      </View>
    </Modal>
  )
}

export default ActivityModal
