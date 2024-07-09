import { observer } from "mobx-react-lite"
import React, { FC, forwardRef, useEffect, useRef, useState } from "react"
import { Platform, ScrollView, TouchableOpacity, View } from "react-native"
import styles from "./style"
import { Button, Text, TextInput, Icon, ModelItem } from "../components/v2"
import SelectDropdown, { SelectDropdownProps } from "react-native-select-dropdown"

type SelectionDropDownProps =   {
  label?: string,
  errormessage?:string 
 
} & SelectDropdownProps
const SelectionDropDown = forwardRef((props: SelectionDropDownProps, ref) => {
  const selectDropdownRef = ref

  const {  errormessage, label, ...dropdownProps } = props

  return (
    <>
    
    
      <View style={{ flexDirection: "row" }}>
        <Text style={{ margin: 5, color: "red", fontSize: 18 }}>*</Text>
        <Text style={{ margin: 5, fontSize: 18 }}>{label || "Line"}</Text>
      </View>
      <SelectDropdown
        ref={selectDropdownRef}
        
        {
            ...dropdownProps
        }
     
      />

      <View style={{ width: "100%" }}>
        <Text caption1 errorColor>
          {errormessage }
        </Text>
      </View>
    </>
 
  )
})

export default SelectionDropDown
