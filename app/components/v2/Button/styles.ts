import { StyleSheet } from "react-native";
import { BaseColor, Typography } from "../../../theme-v2";

export default StyleSheet.create({
    default: {
        height: 56,
        borderRadius: 8,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    textDefault: {
        ...Typography.headline,
        color: BaseColor.whiteColor,
        fontWeight: "600",
    },
    outline: {
        borderWidth: 1,
    },

    full: {
        width: "100%",
        alignSelf: "auto",
    },
    round: {
        borderRadius: 28,
    },
});
