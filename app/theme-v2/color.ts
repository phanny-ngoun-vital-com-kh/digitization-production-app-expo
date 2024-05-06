import { Theme } from "@react-navigation/native";
import { palette } from "./palette"


export const BaseColor = {
  grayColor: "#9B9B9B",
  dividerColor: "#BDBDBD",
  whiteColor: "#FFFFFF",
  fieldColor: "#F5F5F5",
  errorColor: "red",
  yellowColor: "#FDC60A",
  navyBlue: "#3C5A99",
  kashmir: "#5D6D7E",
  orangeColor: "#2292EE",
  blueColor: "#5DADE2",
  pinkColor: "#A569BD",
  greenColor: "#58D68D",
  pinkLightColor: "#FF5E80",
  pinkDarkColor: "#F90030",
  accentColor: "#4A90A4"
};

/**
 * Define Const list theme use for whole application
 */
export const ThemeSupport = [
  {
    theme: "orange",
    light: {
      dark: false,
      colors: {
        primary: "#2292EE",
        primaryDark: "#C31C0D",
        primaryLight: "#FF8A65",
        accent: "#4A90A4",
        background: "white",
        card: "#F5F5F5",
        text: "#212121",
        border: "#c7c7cc",
      },
    },
    dark: {
      dark: true,
      colors: {
        primary: "#2292EE",
        primaryDark: "#C31C0D",
        primaryLight: "#FF8A65",
        accent: "#4A90A4",
        background: "#010101",
        card: "#121212",
        text: "#e5e5e7",
        border: "#272729",
      },
    },
  },
  {
    theme: "pink",
    light: {
      dark: false,
      colors: {
        primary: "#FF2D55",
        primaryDark: "#F90030",
        primaryLight: "#FF5E80",
        accent: "#4A90A4",
        background: "white",
        card: "#F5F5F5",
        text: "#212121",
        border: "#c7c7cc",
      },
    },
    dark: {
      dark: true,
      colors: {
        primary: "#FF2D55",
        primaryDark: "#F90030",
        primaryLight: "#FF5E80",
        accent: "#4A90A4",
        background: "#010101",
        card: "#121212",
        text: "#e5e5e7",
        border: "#272729",
      },
    },
  },
  {
    theme: "blue",
    light: {
      dark: false,
      colors: {
        primary: "#5DADE2",
        primaryDark: "#1281ac",
        primaryLight: "#68c9ef",
        accent: "#FF8A65",
        background: "white",
        card: "#F5F5F5",
        text: "#212121",
        border: "#c7c7cc",
      },
    },
    dark: {
      dark: true,
      colors: {
        primary: "#5DADE2",
        primaryDark: "#1281ac",
        primaryLight: "#68c9ef",
        accent: "#FF8A65",
        background: "#010101",
        card: "#121212",
        text: "#e5e5e7",
        border: "#272729",
      },
    },
  },
  {
    theme: "green",
    light: {
      dark: false,
      colors: {
        primary: "#58D68D",
        primaryDark: "#388E3C",
        primaryLight: "#C8E6C9",
        accent: "#607D8B",
        background: "white",
        card: "#F5F5F5",
        text: "#212121",
        border: "#c7c7cc",
      },
    },
    dark: {
      dark: true,
      colors: {
        primary: "#58D68D",
        primaryDark: "#388E3C",
        primaryLight: "#C8E6C9",
        accent: "#607D8B",
        background: "#010101",
        card: "#121212",
        text: "#e5e5e7",
        border: "#272729",
      },
    },
  },
  {
    theme: "yellow",
    light: {
      dark: false,
      colors: {
        primary: "#FDC60A",
        primaryDark: "#FFA000",
        primaryLight: "#FFECB3",
        accent: "#795548",
        background: "white",
        card: "#F5F5F5",
        text: "#212121",
        border: "#c7c7cc",
      },
    },
    dark: {
      dark: true,
      colors: {
        primary: "#FDC60A",
        primaryDark: "#FFA000",
        primaryLight: "#FFECB3",
        accent: "#795548",
        background: "#010101",
        card: "#121212",
        text: "#e5e5e7",
        border: "#272729",
      },
    },
  },
];


export interface Theme1 extends Theme {
  
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
    primaryDark: string;
    primaryLight: string;
    accent: string
  }
}
/**
 * Define default theme use for whole application
 */
export const DefaultTheme: {
  theme: string;
  light: Theme1;
  dark: Theme1
} = {
  theme: "orange",
  light: {
    dark: false,
    colors: {
      primary: "#2292EE",
      primaryDark: "#C31C0D",
      primaryLight: "#FF8A65",
      accent: "#4A90A4",
      background: "white",
      card: "#F5F5F5",
      text: "#212121",
      border: "#c7c7cc",
      notification: "white"
    },
  },
  dark: {
    dark: true,
    colors: {
      primary: "#2292EE",
      primaryDark: "#C31C0D",
      primaryLight: "#FF8A65",
      accent: "#4A90A4",
      background: "#010101",
      card: "#121212",
      text: "#e5e5e7",
      border: "#272729",
      notification: "#010101"
    },
  },
};
/**
 * Roles for colors.  Prefer using these over the palette.  It makes it easier
 * to change things.
 *
 * The only roles we need to place in here are the ones that span through the app.
 *
 * If you have a specific use-case, like a spinner color.  It makes more sense to
 * put that in the <Spinner /> component.
 */
export const color = {
  /**
   * The palette is available to use, but prefer using the name.
   */
  palette,
  /**
   * A helper for making something see-thru. Use sparingly as many layers of transparency
   * can cause older Android devices to slow down due to the excessive compositing required
   * by their under-powered GPUs.
   */
  transparent: "rgba(0, 0, 0, 0)",
  /**
   * The screen background.
   */
  background: palette.white,
  /**
   * The main tinting color.
   */
  primary: palette.orange,
  /**
   * The main tinting color, but darker.
   */
  primaryDarker: palette.orangeDarker,
  /**
   * A subtle color used for borders and lines.
   */
  line: palette.offWhite,
  /**
   * The default color of text in many components.
   */
  text: palette.white,
  /**
   * Secondary information.
   */
  dim: palette.lightGrey,
  /**
   * Error messages and icons.
   */
  error: palette.angry,

  /**
   * Storybook background for Text stories, or any stories where
   * the text color is color.text, which is white by default, and does not show
   * in Stories against the default white background
   */
  storybookDarkBg: palette.black,

  /**
   * Storybook text color for stories that display Text components against the
   * white background
   */
  storybookTextColor: palette.black,
}
