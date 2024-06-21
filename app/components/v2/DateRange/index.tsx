import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/AntDesign";
import { Modal } from "react-native-paper";
import { Button, Text } from "app/components/v2";
import { View, ViewStyle, TouchableOpacity } from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import moment from "moment";
import styles from "./styles";

interface DateRangeProps {
  defaultStartDate: string | null;
  defaultEndDate: string | null;
  isVisible: boolean;
  onComfirm: (startDate: string, endDate: string) => void;
  onClose: () => void;
}

const DateRangePicker = ({
  isVisible = true,
  onClose,
  onComfirm,
  defaultStartDate,
  defaultEndDate,
}: DateRangeProps) => {
  const today = new Date(); // Today's date
  const minDate = moment(today).subtract(1, "year").toDate(); // One year ago from today
  const maxDate = new Date(2026, 6, 3);
  const [error, setError] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState<string | null>(defaultStartDate);
  const [selectedEndDate, setSelectedEndDate] = useState<string | null>(defaultEndDate);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const onDateChange = (date: Date, type: string) => {
    const formattedDate = moment(date).format("DD/MM/YYYY");

    if (type === "END_DATE") {
      setSelectedEndDate(formattedDate);
    } else {
      setSelectedStartDate(formattedDate);
    }
  };

  useEffect(() => {
    return () => {
      setSelectedStartDate(null);
      setSelectedEndDate(null);
      setError(false);
    };
  }, [isVisible]);

  return (
    <Modal
      visible={isVisible}
      onDismiss={onClose}
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      contentContainerStyle={styles.container}
    >
      <View style={[styles.model]}>
        <View style={{ backgroundColor: "#0081F8", padding: 10 }}>
          <View style={$hori}>
            <Text title3 whiteColor regular>
              Date Range
            </Text>
            <View style={[$hori, { gap: 20 }]}>
              <TouchableOpacity onPress={onClose}>
                <Icon size={22.5} name="close" color={"white"} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.calendarContainer}>
          <CalendarPicker
            startFromMonday={true}
            allowRangeSelection={true}
            minDate={minDate}
            maxDate={maxDate}
            weekdays={weekdays}
            months={months}
            previousTitle="Previous"
            previousTitleStyle={{
              color: "#0081F8",
              fontWeight: "bold",
            }}
            nextTitleStyle={{
              color: "#0081F8",
              fontWeight: "bold",
            }}
            nextTitle="Next"
            todayBackgroundColor="red"
            selectedDayColor="#0081F8"
            selectedDayTextColor="#FFFFFF"
            onDateChange={onDateChange}
            width={300}
            height={300}
          />
          <View style={styles.dateTextContainer}>
            <Text semibold body1>
              Your Selection:
            </Text>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Text>{selectedStartDate || "DD/MM/YYYY"}</Text>
              <Text>to</Text>
              <Text>{selectedEndDate || "DD/MM/YYYY"}</Text>
            </View>
          </View>
          <View style={{ width: "100%", marginTop: 25 }}>
            <Button
              onPress={() => {
                if (selectedStartDate && selectedEndDate) {
                  onComfirm(selectedStartDate, selectedEndDate);
                  return;
                }
                setError(true);
              }}
              styleText={{
                fontSize: 15.5,
                fontWeight: "600",
              }}
            >
              Confirm Selection
            </Button>

            {error && (
              <Text errorColor caption1 style={{ marginTop: 25 }} textAlign={"center"}>
                *Please Select Date
              </Text>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const $hori: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 10,
};

export default DateRangePicker;
