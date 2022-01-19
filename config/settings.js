import Constants from "expo-constants";

const settings = {
  dev: {
    apiUrl: "http://192.168.1.101:3000/api",
    baseUrl: "http://192.168.1.101:3000",
  },
  staging: {
    apiUrl: "http://192.168.1.101:3000/api",
    baseUrl: "http://192.168.1.101:3000",
  },
  prod: {
    apiUrl: "http://192.168.1.101:3000/api",
    baseUrl: "http://192.168.1.101:3000",
  },
};

const getCurrentSettings = () => {
  if (__DEV__) return settings.dev;
  if (Constants.manifest.releaseChannel === "staging") return settings.staging;
  return settings.prod;
};

export default getCurrentSettings();
