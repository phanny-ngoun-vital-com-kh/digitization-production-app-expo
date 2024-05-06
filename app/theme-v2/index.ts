import { useColorScheme } from "react-native"
import { useStores } from "../models"
import { DefaultTheme } from "./color"

export * from "./color"
export * from "./spacing"
export * from "./typography"
export * from "./timing"
export * from "./styles"

export const FontSupport = ["ProximaNova", "Raleway", "Roboto", "Merriweather"];

/**
 * Define font default use for whole application
 */
 export const DefaultFont = "ProximaNova";

export const useTheme = () => {

    // const { appStore } = useStores()
    const isDarkMode = useColorScheme() == 'dark'
    // const forceDark = appStore.forceDark
    // const themeStorage = appStore.theme

    // const listTheme = ThemeSupport.filter((item) => item.theme == themeStorage);
    const theme = DefaultTheme;

    // if (forceDark) {
    //     return { theme: theme.dark, colors: theme.dark.colors };
    // }
    // if (forceDark == false) {
    //     return { theme: theme.light, colors: theme.light.colors };
    // }
    return isDarkMode
        ? { theme: theme.dark, colors: theme.dark.colors }
        : { theme: theme.light, colors: theme.light.colors };
}

/**
 * export font for application
 * @returns font
 */
 export const useFont = () => {
    // const { appStore } = useStores()
    // const font = appStore.font
    // return font ?? DefaultFont;
  };
  