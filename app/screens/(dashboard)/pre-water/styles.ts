import { StyleSheet } from "react-native"

export default StyleSheet.create({
  activityLineChart: {
    padding: 25,
    flex: 1,
    gap: 10,
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
    flex: 0.3,
    padding: 10,
    zIndex: 10,
    height:"full",
    backgroundColor: "white",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    // marginLeft:110
  },
  row1: {
    flexDirection: "row",
    gap: 5,
  },

  dateAgo: { height: 40, backgroundColor: "white" },
  dropdown: {
    marginLeft: 10,
    marginRight: 10,
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
    width: 200,

    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
})
