import { StyleSheet } from "react-native";

export default StyleSheet.create({
  text: {
    color: '#000',
    fontSize: 15,
    marginBottom: 20
  },
  subView: {
    paddingLeft: 5,
    flex: 1
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff'
  },
  leftPane: {
    width: '25%',
    padding: 10,
    borderRightWidth: 1,
    borderRightColor: '#d3d3d3',
    backgroundColor: '#fff'
  },
  rightPane: {
    padding: 10,
  },
  item: {
    fontSize: 18,
  },
  selectedItem: {
    backgroundColor: 'lightblue',
  },
  row: {
    height: 50,
    borderBottomWidth: 0,

  },
  textTitle: {
    color: 'gray'
  },
  textBody: {
    fontWeight: 'bold'
  },
  textHeader: {
    fontSize: 18,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.4,
    borderColor: '#d3d3d3',
    paddingVertical: 15,
  },
  selectedItemContainer: {
    backgroundColor: '#ADD8E6', // Set the background color for the selected item
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    margin: 20,
  },

  actionButton: {
    width: '20%',
  },
  menuText: {
    fontSize: 15,
    color: '#000',
    margin: 5
  },
  menu: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#d3d3d3',
    margin: 10
  },
  date_button: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#696969',
    height: 47,
    borderRadius: 10,
    justifyContent: 'center'
  },
  add_item_button: {
    width: '70%',
    marginLeft: 'auto',
    marginRight: 'auto',
    height: 40,
    marginTop: 20,
    marginBottom: 20
  },
  dropdownStyle: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },

  buttonStyle: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#696969',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
    backgroundColor: '#fff',
  },
  buttonTextStyle: {
    color: '#333',
    fontSize: 18,
    textAlign: 'left',
  },
  selectedItemText: {
    marginTop: 20,
    fontSize: 18,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: '#696969',
    height: 47,
    borderRadius: 10,
  },
  button_cancel: {
    marginLeft: 'auto',
    width: '25%',
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 1
  },
  butuon_view: {
    marginTop: '5%',
    flexDirection: 'row',
    width: '100%'
  },
  model: {
    backgroundColor: 'white',
    marginTop: '5%',
    padding: 20,
    borderRadius: 10,
    width: '85%',
    // height: '40%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalcontainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center'
  },
  button: {
    width: '25%',
    // marginLeft: 'auto',
  },
  dropdown: {
    // marginLeft: -10,
    // marginRight: 10,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    width:'100%',
    elevation: 2,
  },

});
