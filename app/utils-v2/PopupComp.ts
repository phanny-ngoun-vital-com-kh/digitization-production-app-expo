import { BaseColor } from "app/theme-v2";
import { StyleProp, ViewStyle } from "react-native";
import { Popup } from "react-native-popup-confirm-toast";

export const showPopup = (config: {
    title: string;
    type?: 'success' | 'warning' | 'danger' | 'confirm';
    // icon?: JSX.Element;
    textBody: string;
    button?: boolean;
    buttonText?: string;
    confirmText?: string;
    okButtonStyle?: StyleProp<ViewStyle>;
    confirmButtonStyle?: StyleProp<ViewStyle>;
    okButtonTextStyle?: StyleProp<ViewStyle>;
    titleTextStyle?: StyleProp<ViewStyle>;
    bounciness?: number;
    callback?: () => void;
    background?: string;
    timing?: number;
    autoClose?: boolean;
}) => {
    Popup.show({
        ...config,
        okButtonStyle: { backgroundColor: BaseColor.orangeColor },
        callback: () => {
            config.callback?.()
            Popup.hide()
        }
    })
}