import Constants from "expo-constants";

const settings = {
  dev: {
    apiUrl: "",
    baseUrl: "",
  },
  staging: {
    apiUrl: "",
    baseUrl: "",
  },
  prod: {
    apiUrl: "",
    baseUrl: "",
  },
};

const getCurrentSettings = () => {
  if (__DEV__) {
    return settings.dev;
  }
  if (Constants.manifest.releaseChannel === "staging") {
    return settings.staging;
  }

  return settings.prod;
};

export default getCurrentSettings();
