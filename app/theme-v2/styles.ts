/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/sort-styles */
import { StyleSheet } from "react-native";

/**
 * Common basic style defines
 */
export const BaseStyle = StyleSheet.create({
    tabBar: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
    },
    bodyPaddingDefault: {
        paddingHorizontal: 20,
    },
    bodyMarginDefault: {
        marginHorizontal: 20,
    },
    textInput: {
        height: 46,
        borderRadius: 5,
        paddingHorizontal: 10,
        width: "85%",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
    },
    safeAreaView: {
        flex: 1,
    },
    container: {
        padding: 20,
    },
});
