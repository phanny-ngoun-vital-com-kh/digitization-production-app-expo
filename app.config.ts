import { ExpoConfig, ConfigContext } from "@expo/config"

/**
 * Use ts-node here so we can use TypeScript for our Config Plugins
 * and not have to compile them to JavaScript
 */
require("ts-node/register")

/**
 * @param config ExpoConfig coming from the static config app.json if it exists
 * 
 * You can read more about Expo's Configuration Resolution Rules here:
 * https://docs.expo.dev/workflow/configuration/#configuration-resolution-rules
 */
module.exports = ({ config }: ConfigContext): Partial<ExpoConfig> => {
  const existingPlugins = config.plugins ?? []

  return {
    ...config,
    extra: {
        eas: {
          projectId: "a8e5a60c-1909-45bd-a601-a6cec8a14e75"
      }
    },
    plugins: [
      ...existingPlugins,
      require("./plugins/withSplashScreen").withSplashScreen,
      require("./plugins/withFlipperDisabled").withFlipperDisabled,
    ],
  }
}
