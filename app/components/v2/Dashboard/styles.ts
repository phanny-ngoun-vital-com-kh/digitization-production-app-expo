import { StyleSheet } from "react-native"

export default StyleSheet.create({
  activityBarCharts: {
    padding: 25,
    flex: 1,
    backgroundColor: "white",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
  },
  horicontainer:{
    flexDirection:"row",
    justifyContent:'center',
    alignItems:'center',
    gap:5
  },
  loadingStyle: {
    flexDirection: "column",
    justifyContent: "center",
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 100,
  },
  activityPieChart: {
    flex: 0.3,
    padding: 10,
    zIndex: 10,

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
