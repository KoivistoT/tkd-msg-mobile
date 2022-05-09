import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const registerForPushNotificationsAsync = async (
  dispatchFunction,
  currentUserPushTokenNow
) => {
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");

      return;
    }
    const token = (await Notifications.getExpoPushTokenAsync()).data;

    try {
      if (token === currentUserPushTokenNow) {
        return;
      }

      try {
        dispatchFunction(token);
      } catch (error) {
        return error;
      }
    } catch (error) {
      return error;
    }
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
};

export default {
  registerForPushNotificationsAsync,
};
