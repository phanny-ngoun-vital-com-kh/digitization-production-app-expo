import { StyleSheet } from "react-native"

export default StyleSheet.create({
  activityLineChart: {
    padding: 25,
    flex: 0.65,
    gap: 10,

    backgroundColor: "white",
  },
  loadingStyle: {
    flexDirection: "column",
    backgroundColor: "rgba(200, 200, 200, 0.15)", // Lighter gray color with 50% opacity // Gray color with 50% opacity
    justifyContent: "center",
    position: "absolute",
    left: 0,
    right: 0,
    top: 10,
    bottom: 0,
    padding: 10,
    zIndex: 100,
  },
  shadowbox:{
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
    flex: 0.35,

    zIndex: 10,
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
    gap: 15,
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
