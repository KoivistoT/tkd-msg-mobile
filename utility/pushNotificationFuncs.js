import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import asyncStorageFuncs from "./asyncStorageFuncs";

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
      if (token === currentUserPushTokenNow) return;

      try {
        dispatchFunction(token);
      } catch (error) {
        console.log(error, "code 777421");
      }
    } catch (error) {
      console.log(error, "code 277719");
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
