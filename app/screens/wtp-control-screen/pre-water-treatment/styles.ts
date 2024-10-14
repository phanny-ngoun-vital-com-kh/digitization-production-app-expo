import { StyleSheet } from "react-native"

export default StyleSheet.create({
  leftPane: {
    flex: 0.2,

    // backgroundColor: "#EFEBEB",
    // padding: 20,
    gap: 5,
    backgroundColor: "#F5F5F5",
  },
  rightPane: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 0,

    // paddingBottom:20
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.59)",
    zIndex: 10000,
    justifyContent: "center",
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
  sortIcon: {
    width: 50,
    height: 50,
    marginTop: 13,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#EFEBEB",
  },
  PlantPanel: {
    width: 10,
    height: 10,
    borderRadius: 100,
    marginRight: 5,
    alignItems: "center",
  },
})
