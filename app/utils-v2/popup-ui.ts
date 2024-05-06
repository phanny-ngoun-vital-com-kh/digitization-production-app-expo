import { StyleProp, ViewStyle } from 'react-native'
import { Popup, Toast } from 'react-native-popup-confirm-toast';
import { BaseColor } from '../theme';


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
        okButtonStyle: {backgroundColor: BaseColor.orangeColor},
        callback: () => {
            config.callback?.()
            Popup.hide()
        }
    })
}

export const showTost = (config: {
    title: string;
    text: string;
    titleTextStyle?: StyleProp<ViewStyle>;
    descTextStyle?: StyleProp<ViewStyle>;
    icon?: JSX.Element,
    timing?: number,
}) => {
    Toast.show({
        ...config,
        backgroundColor: BaseColor.kashmir,
        timeColor: BaseColor.orangeColor,
        position: 'bottom'
      })
}