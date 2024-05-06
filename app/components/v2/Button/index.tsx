/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unneeded-ternary */
import React from "react";
import { ActivityIndicator, StyleProp, StyleSheet, TextStyle, ViewStyle } from "react-native";
import { BaseColor, useTheme } from "../../../theme-v2";
import styles from "./styles";
import { Text } from "../..";
import RNBounceable, { IRNBounceableProps } from "@freakycoder/react-native-bounceable";

interface Props extends IRNBounceableProps {
  style?:  StyleProp<ViewStyle> ,
  styleText?:  StyleProp<TextStyle> ,
  icon?: JSX.Element,
  outline?: boolean,
  full?: boolean,
  round?: boolean,
  loading?: boolean,
}

export default function Button(props: Props) {
  const { colors } = useTheme();
  const {
    style,
    styleText,
    icon,
    outline,
    full,
    round,
    loading,
    children,
    ...rest
  } = props;

  return (
    <RNBounceable
    
      {...rest}
      
      style={StyleSheet.flatten([
        [styles.default, { backgroundColor: colors.primary }],
        outline && [
          styles.outline,
          {
            backgroundColor: colors.card,
            borderColor: colors.primary,
          },
        ],
        full && styles.full,
        round && styles.round,
        style,
      ])}
      // activeOpacity={0.9}
    >
      
      {icon ? icon : null}
      <Text
        style={StyleSheet.flatten([
          styles.textDefault,
          outline && { color: colors.primary },
          styleText,
        ])}
        numberOfLines={1}
      >
        {children}
      </Text>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={outline ? colors.primary : BaseColor.whiteColor}
          style={{ paddingLeft: 5 }}
        />
      ) : null}
    </RNBounceable>
  );
}


