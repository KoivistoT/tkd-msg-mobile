import Constants from "expo-constants";

const settings = {
  dev: {
    apiUrl: "http://10.49.161.247:3000/api",
  },
  staging: {
    apiUrl: "http://10.49.161.247:3000/api",
  },
  prod: {
    apiUrl: "http://localhost:3000/api",
  },
};

const getCurrentSettings = () => {
  if (__DEV__) return settings.dev;
  if (Constants.manifest.releaseChannel === "staging") return settings.staging;
  return settings.prod;
};

export default getCurrentSettings();
