/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable react/display-name */
/* eslint-disable react-native/no-inline-styles */
import React, { forwardRef } from "react"
import { I18nManager, TextInput, TextInputProps, View } from "react-native"
import { BaseColor, BaseStyle, useFont, useTheme } from "../../../theme-v2"

interface Props extends TextInputProps {
  inputStyle?: {}
  success?: boolean
  icon?: JSX.Element
}

const Index = forwardRef((props: Props, ref: any) => {
  const font = useFont()
  const { colors } = useTheme()
  const cardColor = colors.card
  const {
    style,
    placeholder,
    value,
    success,
    secureTextEntry,
    keyboardType,
    multiline,
    textAlignVertical,
    icon,
    onSubmitEditing,
    inputStyle,
    ...attrs
  } = props
  return (
    <View style={[BaseStyle.textInput, { backgroundColor: cardColor }, style]}>
      <TextInput
        
        ref={ref}
        style={[
          {
            fontFamily: `${font}-Regular`,
            flex: 1,
            height: "100%",
            textAlign: I18nManager.isRTL ? "right" : "auto",
            color: colors.text,
            paddingTop: 5,
            paddingBottom: 5,
          },
          inputStyle,
        ]}
        
        autoCorrect={false}
        placeholder={placeholder}
        placeholderTextColor={success ? BaseColor.grayColor : colors.primary}
        secureTextEntry={secureTextEntry}
        value={value}
        selectionColor={colors.primary}
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={textAlignVertical}
        onSubmitEditing={onSubmitEditing}
        {...attrs}
      />
      {icon}
    </View>
  )
})

export default Index
