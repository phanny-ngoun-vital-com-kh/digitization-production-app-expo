import React, { useState } from "react"
import { View, TouchableOpacity } from "react-native"
import { MultiSelect } from "react-native-element-dropdown"
import { styles } from "./styles"
import { Text } from "app/components/v2"
import AntDesign from "@expo/vector-icons/AntDesign"
const MultiSelectComponent = ({
  onChangeMachine,
  label = "Select Machines",
  data = [],
  disable,
}: {
  onChangeMachine: (item: string) => void
  data: { value: string; label: string }[]
  label: string
  disable: boolean
}) => {
  const [selected, setSelected] = useState([])

  return (
    <View style={styles.container}>
      <MultiSelect
        disable={disable}
        confirmSelectItem
        alwaysRenderSelectedItem
        style={styles.dropdown}
        
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        search
        data={data}
        labelField="label"
        valueField="value"
        placeholder={label}
        searchPlaceholder="Search..."
        value={selected}
        onChange={(item) => {
          onChangeMachine(item)
          setSelected(item)
        }}
        // renderLeftIcon={() => (
        //   <AntDesign style={styles.icon} color="black" name="carryout" size={20} />
        // )}
        renderSelectedItem={(item, unSelect) => (
          <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
            <View style={styles.selectedStyle}>
              <Text style={styles.textSelectedStyle}>{item.label}</Text>
              <AntDesign color="white" name="close" size={17} />
            </View>
          </TouchableOpacity>
        )}
        selectedStyle={styles.selectedStyle}
      />
    </View>
  )
}

export default MultiSelectComponent
