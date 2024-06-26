import React, { useEffect, useRef, useState } from "react"
import { Modal, View, useWindowDimensions, KeyboardAvoidingView, Platform } from "react-native"
import Icon from "../Icon"
import { useTheme } from "app/theme-v2"
import styles from "./styles"
import { Text, Button } from ".."
import { TabView, SceneMap, TabBar } from "react-native-tab-view"
import SelectDropdown from "react-native-select-dropdown"
import CustomInput from "../DailyPreWater/CustomInput"
import SelectionDropDown from "app/components/SelectionDropDown"

interface ModalProps {
  data: any[]
  isVisible: boolean
  onClose: () => void
  textChange: (text: string) => void
  onAddPress: (data) => void
  handleAddItem: (item: any) => void
}

const ModalDailyPreWater: React.FC<ModalProps> = ({
  data,
  isVisible,
  onClose,
  textChange,
  onAddPress,
  handleAddItem,
}) => {
  const { colors } = useTheme()

  const [temlist, settemlist] = useState<ItemInventory[]>([])
  const [newItem, setNewItem] = useState<ItemInventory[]>([])
  const [searchquery, setSearchQuery] = useState("")
  const dropmenu_one = useRef<SelectDropdown>(null)
  const [index, setIndex] = useState(0)

  const FirstRoute = () => {
    const [textInputValue, setTextInputValue] = useState("")
    const handleTextChange = (text: string) => {
      setTextInputValue(text)
      textChange(text)
    }

    const handleAddPress = (data) => {
      onAddPress(data)
    }

    const renderEmptyComponent = () => (
      <View style={{ alignItems: "center", gap: 20, justifyContent: "center" }}>
        <Text textAlign="center">No Items Please</Text>
        <Button onPress={() => setIndex(1)} style={{ width: 100 }}>
          Add
        </Button>
      </View>
    )
    // if (screenState.isloading) {
    //   return (
    //     <View style={{ marginTop: 100 }}>
    //       <ActivityIndicator color={colors.primary} />
    //     </View>
    //   )
    // }

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1 }}>
          <Text>Form</Text>
        </View>
      </KeyboardAvoidingView>
    )
  }

  const SecondRoute = () => {
    const [validation, setValidation] = useState([])
    const [qty, setQty] = useState("")
    const types = [
      { id: "1", name: "PM/RM" },
      { id: "2", name: "FG" },
    ]
    const [form, setForm] = useState({
      item_code: "",
      item_desc: "",
      quantity: "",
      quality_good: "",
      faulty_good: "",
      supplies_type: "",
    })

    const validationForm = (form) => {
      let isvalid = true
      for (const key in form) {
        if (!form[key] || form[key] === "" || form[key] === null) {
          setValidation((pre) => pre.concat({ error: key }))
          isvalid = false
        }
      }
      return isvalid
    }
    const handleAddToSubItemList = () => {
      if (validationForm(form)) {
        settemlist((pre) => pre.concat(form))
        setModa
      }
    }

    useEffect(() => {
      //clean up validation
      setValidation([])
    }, [form])

    console.log(temlist)

    return (
      <View style={{ flex: 1 }}>
        {/* row - 1  */}
        <View style={{ backgroundColor: "#fff", width: "100%", flexDirection: "row" }}>
          <View style={{ marginTop: 5, marginBottom: 20, width: "25%", marginRight: "2.5%" }}>
            <CustomInput
              onChangeText={(text) => setForm((pre) => ({ ...pre, item_code: text }))}
              label="Item Code"
              errormessage={
                validation &&
                validation
                  .map((validate) => validate.error)
                  .find((errors) => errors === "item_code")
                  ? "សូមជ្រើសរើស item_code"
                  : ""
              }
            />
          </View>
          <View style={{ marginTop: 5, marginBottom: 20, width: "35%", marginRight: "2.5%" }}>
            <CustomInput
              label="SF"
              decimaldecimal
              onChangeText={(text) => setForm((pre) => ({ ...pre, item_desc: text }))}
              errormessage={
                validation &&
                validation
                  .map((validate) => validate.error)
                  .find((errors) => errors === "item_desc")
                  ? "សូមជ្រើសរើស Item Description"
                  : ""
              }
            />
          </View>
          <View style={{ marginTop: 5, marginBottom: 20, width: "33%" }}>
            <CustomInput
              label="ACF"
              keyboardType="decimal-pad"
              errormessage={
                validation &&
                validation.map((validate) => validate.error).find((errors) => errors === "quantity")
                  ? "សូមជ្រើសរើស Quantity"
                  : ""
              }
              onChangeText={(text) => setForm((pre) => ({ ...pre, quantity: text }))}
            />
          </View>
        </View>

        {/* row - 2  */}
        <View style={{ backgroundColor: "#fff", width: "100%", flexDirection: "row" }}>
          <View style={{ marginTop: 5, marginBottom: 20, width: "25%", marginRight: "2.5%" }}>
            <CustomInput
              label="Quantity"
              label="Quality goods"
              keyboardType="number-pad"
              errormessage={
                validation &&
                validation
                  .map((validate) => validate.error)
                  .find((errors) => errors === "quality_good")
                  ? "សូមជ្រើសរើស Item Quality goods"
                  : ""
              }
              onChangeText={(text) => setForm((pre) => ({ ...pre, quality_good: text }))}
            />
          </View>
          <View style={{ marginTop: 5, marginBottom: 20, width: "35%", marginRight: "2.5%" }}>
            <CustomInput
              label="Faulty goods"
              keyboardType="number-pad"
              errormessage={
                validation &&
                validation
                  .map((validate) => validate.error)
                  .find((errors) => errors === "faulty_good")
                  ? "សូមជ្រើសរើស Item Faulty goods"
                  : ""
              }
              onChangeText={(text) => setForm((pre) => ({ ...pre, faulty_good: text }))}
            />
          </View>
          <View style={{ marginTop: 5, marginBottom: 20, width: "33%" }}>
            <SelectionDropDown
              ref={dropmenu_one}
              errormessage={
                validation &&
                validation
                  .map((validate) => validate.error)
                  .find((errors) => errors === "supplies_type")
                  ? "សូមជ្រើសរើស Supplies type"
                  : ""
              }
              label="Supplies Type"
              data={types}
              defaultButtonText={"Please Select"}
              onSelect={(selectedItem, index) => {
                // setGetLine(selectedItem.name)
                console.log(selectedItem.name, selectedItem.id, index)
                setForm((pre) => ({ ...pre, supplies_type: selectedItem.name }))
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem.name
              }}
              rowTextForSelection={(item, index) => {
                return item.name
              }}
              dropdownIconPosition="right"
              renderDropdownIcon={() => (
                <Icon
                  name="angle-down"
                  // style={styles.dropdownIconStyle}
                />
              )}
              dropdownStyle={styles.dropdownStyle}
              buttonStyle={styles.buttonStyle}
              buttonTextStyle={styles.buttonTextStyle}
            />
          </View>
        </View>

        <View style={{ justifyContent: "flex-end", width: "20%", marginLeft: "auto" }}>
          <Button onPress={handleAddToSubItemList}>Add</Button>
        </View>
      </View>
    )
  }
  const thirdRoute = () => {
    const [textInputValue, setTextInputValue] = useState("")
    const handleTextChange = (text: string) => {
      setTextInputValue(text)
      textChange(text)
    }

    const handleAddPress = (data) => {
      onAddPress(data)
    }

    const renderEmptyComponent = () => (
      <View style={{ alignItems: "center", gap: 20, justifyContent: "center" }}>
        <Text textAlign="center">No Items Please</Text>
        <Button onPress={() => setIndex(1)} style={{ width: 100 }}>
          Add
        </Button>
      </View>
    )
    // if (screenState.isloading) {
    //   return (
    //     <View style={{ marginTop: 100 }}>
    //       <ActivityIndicator color={colors.primary} />
    //     </View>
    //   )
    // }

    return (
      // <KeyboardAvoidingView
      //   behavior={Platform.OS === "ios" ? "padding" : "height"}
      //   style={{ flex: 1 }}
      // >
      <View style={{ flex: 1 }}>
        <Text>Form</Text>
        {/* <InventoryTableV2
          newItem={data}
          showButton={false}
          handlePress={(item: ItemInventory) => {
            handleAddItem(item)
            onClose()
          }}
        /> */}
        {/* </View> */}
      </View>
      // </KeyboardAvoidingView>
    )
  }
  const fourthRoute = () => {
    const [textInputValue, setTextInputValue] = useState("")
    const handleTextChange = (text: string) => {
      setTextInputValue(text)
      textChange(text)
    }

    const handleAddPress = (data) => {
      onAddPress(data)
    }

    const renderEmptyComponent = () => (
      <View style={{ alignItems: "center", gap: 20, justifyContent: "center" }}>
        <Text textAlign="center">No Items Please</Text>
        <Button onPress={() => setIndex(1)} style={{ width: 100 }}>
          Add
        </Button>
      </View>
    )
    // if (screenState.isloading) {
    //   return (
    //     <View style={{ marginTop: 100 }}>
    //       <ActivityIndicator color={colors.primary} />
    //     </View>
    //   )
    // }

    return (
      // <KeyboardAvoidingView
      //   behavior={Platform.OS === "ios" ? "padding" : "height"}
      //   style={{ flex: 1 }}
      // >
      <View style={{ flex: 1 }}>
        <Text>Form</Text>
        {/* <InventoryTableV2
          newItem={data}
          showButton={false}
          handlePress={(item: ItemInventory) => {
            handleAddItem(item)
            onClose()
          }}
        /> */}
        {/* </View> */}
      </View>
      // </KeyboardAvoidingView>
    )
  }
  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: thirdRoute,
    fourth: fourthRoute,
  })

  const layout = useWindowDimensions()

  const [routes] = useState([
    { key: "first", title: "Pressure" },
    { key: "second", title: "Air Release" },
    { key: "third", title: "TDS" },
    { key: "fourth", title: "PH" },
  ])

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: colors.primary }}
      style={{ backgroundColor: "#ffffff", borderColor: colors.primary, borderBottomWidth: 1 }}
      activeColor={colors.primary}
      inactiveColor="gray"
    />
  )

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.model}>
          {/* <View style={{ flexDirection: 'row' }}> */}
          <Icon
            color={colors.primary}
            style={{ marginLeft: "auto", marginBottom: 10 }}
            size={25}
            name={"times"}
            onPress={onClose}
          />
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            renderTabBar={renderTabBar}
          />

          {/* </View> */}
        </View>
      </View>
    </Modal>
  )
}

export default ModalDailyPreWater
