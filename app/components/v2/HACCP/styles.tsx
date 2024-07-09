import { StyleSheet } from "react-native"

export default StyleSheet.create({
  badge: {
    backgroundColor: "#D32600",
    borderRadius: 100,
    height: 10,
    width: 10,
  },
  progressLine: {
    backgroundColor: "#0081F8",
    width: 15,
    height: 15,
    borderRadius: 100,
  },
  machinePanel: {
    width: 10,
    height: 10,
    borderRadius: 100,
    marginRight: 5,
    alignItems: "center",
  },
  linePanel: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#BFB6B6",
    borderBottomWidth: 1,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    height:250,
    flex:1,
    flexGrow:1,
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    // elevation: 3,
    // height: 1,
    width: 360,
    // width:,
 
    flexDirection: "column",
    justifyContent: "center",
  },
  rightPane: {
    flex: 0.2,

    // backgroundColor: "#EFEBEB",
    // padding: 20,
    gap: 5,
    backgroundColor: "#F5F5F5",
  },
  leftPane: {
    flex: 1,
    // backgroundColor: "#F5F5F5",

    paddingHorizontal: 10,
    // paddingBottom:100
    // padding:10
  },
  displayButton: {
    borderWidth: 1,
    margin: 5,
    padding: 10,
    borderRadius: 10,
    borderColor: "gray",
  },
  textHeader: {
    fontSize: 18,
    color: "black",
  },
  dropdown: {
    marginLeft: 10,
    marginRight: 10,
    height: 50,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    width: 150,

    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#d3d3d3",
    margin: 10,
  },
  date_button: {
    backgroundColor: "#fff",
    borderWidth: 0.8,
    borderColor: "#d3d3d3",
    height: 47,
    borderRadius: 10,
    justifyContent: "center",
  },

  divider_space: {
    marginTop: 20,
  },
})
