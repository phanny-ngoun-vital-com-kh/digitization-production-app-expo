import React from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import Icon, {FontAwesome5IconProps} from "react-native-vector-icons/FontAwesome5";
import styles from "./styles";

interface Props extends FontAwesome5IconProps {
  style?: StyleProp<ViewStyle>,
  enableRTL?: boolean,
}

export default function Index(props : Props) {
  const { style, enableRTL, ...rest } = props;
  const layoutStyle = enableRTL ? styles.styleRTL : {};
  return <Icon style={StyleSheet.flatten([style, layoutStyle])} {...rest} />;
}

