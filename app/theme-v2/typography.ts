import { Platform } from "react-native"
import { StyleSheet } from "react-native";

/**
 * You can find a list of available fonts on both iOS and Android here:
 * https://github.com/react-native-training/react-native-fonts
 *
 * If you're interested in adding a custom font to your project,
 * check out the readme file in ./assets/fonts/ then come back here
 * and enter your new font name. Remember the Android font name
 * is probably different than iOS.
 * More on that here:
 * https://github.com/lendup/react-native-cross-platform-text
 *
 * The various styles of fonts are defined in the <Text /> component.
 */
export const typography = {
  /**
   * The primary font.  Used in most places.
   */
  primary: Platform.select({ ios: "Helvetica", android: "normal" }),

  /**
   * An alternate font used for perhaps titles and stuff.
   */
  secondary: Platform.select({ ios: "Arial", android: "sans-serif" }),

  /**
   * Lets get fancy with a monospace font!
   */
  code: Platform.select({ ios: "Courier", android: "monospace" }),
}

export const FontWeight = {
  thin: "100",
  ultraLight: "200",
  light: "300",
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  heavy: "800",
  black: "900",
};

export const Typography = StyleSheet.create({
  header: {
    fontSize: 34,
    fontWeight: "bold",
  },
  title1: {
    fontSize: 28,
    fontWeight: "bold",
  },
  title2: {
    fontSize: 22,
    fontWeight: "bold",
  },
  title3: {
    fontSize: 20,
    fontWeight: "bold",
  },
  headline: {
    fontSize: 17,
    fontWeight: "bold",
  },
  body1: {
    fontSize: 17,
    fontWeight: "normal",
  },
  body2: {
    fontSize: 14,
    fontWeight: "normal",
  },
  callout: {
    fontSize: 17,
    fontWeight: "normal",
  },
  subhead: {
    fontSize: 15,
    fontWeight: "normal",
  },
  footnote: {
    fontSize: 13,
    fontWeight: "normal",
  },
  caption1: {
    fontSize: 12,
    fontWeight: "normal",
  },
  caption2: {
    fontSize: 11,
    fontWeight: "normal",
  },
  overline: {
    fontSize: 10,
    fontWeight: "normal",
  },
  lineThrough: {
    textDecorationLine: 'line-through'
  }
  
});
