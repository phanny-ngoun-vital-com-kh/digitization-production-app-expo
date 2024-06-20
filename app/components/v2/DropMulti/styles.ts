import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  inputSearch: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  inputSearchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  container: { padding: 0,marginVertical:15 },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  dropdown: {
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

    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    // width: "100%",
    marginBottom:15,

    elevation: 2,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 14,
    color:'white'
  },
  placeholderStyle: {
    // color: "#0081F8",
    fontSize: 14.5,
    marginLeft:10

    // textAlign: "center",
  },
  selectedTextStyle: {
    fontSize: 14,
    color:"white"
  },
  iconStyle: {
    // color:"#0081F8",
    width: 20,
    height: 20,

  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: '#0081F8',
    color:"white",
    // shadowColor: '#000',
    gap:10,
    marginTop: 8,
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.2,
    // shadowRadius: 1.41,

    // elevation: 2,
  },
})
