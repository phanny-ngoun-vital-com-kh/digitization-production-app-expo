import { StyleSheet } from "react-native"

export default StyleSheet.create({
  activityBarCharts: {
    padding: 25,
    flex: 0.8,
    backgroundColor: "white",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
  },
  activityPieChart: {
    padding: 25,
    flex: 0.5,
    backgroundColor: "white",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
  },
  row1: {
    flexDirection: "row-reverse",
    gap: 5,
  },

  dateAgo: { height: 40, backgroundColor: "white" },
  dropdown: {
    marginLeft: 10,
    marginRight: 10,
    borderBlockColor: "white",
    height: 40,
    fontSize: 12,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    width: 180,

    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
})
