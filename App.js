import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef } from "./app/navigation/rootNavigation";
import navigationTheme from "./app/navigation/navigationTheme";
import * as Notifications from "expo-notifications";
import configureStore from "./store/configureStore";
import { useDispatch, useSelector, useStore } from "react-redux";
import { Provider } from "react-redux";
import AppErrorToast from "./app/components/AppErrorToast";
import GeneralLoadIndicator from "./app/components/GeneralLoadIndicator";

import {
  getInitialData,
  selectAccountType,
  clearTasks,
  currentUserLastSeenMessagesResived,
  saveCurrentUserPushToken,
} from "./store/currentUser";

import AuthNavigator from "./app/navigation/AuthNavigator";
import AppNavigator from "./app/navigation/AppNavigator";

import { firebaseLogin } from "./api/firebaseClient";
import routes from "./app/navigation/routes";
import AdminNavigator from "./app/navigation/AdminNavigator";
import AppSuccessToast from "./app/components/AppSuccessToast";

import asyncStorageFuncs from "./utility/asyncStorageFuncs";
import { roomsResived } from "./store/rooms";
import { usersResived } from "./store/users";
import pushNotificationFuncs from "./utility/pushNotificationFuncs";
import { messagesResived } from "./store/msgStore";

if (!__DEV__) {
  console.log = () => null;
}

firebaseLogin();

export default function AppWrapper() {
  const store = configureStore();
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

function App() {
  const dispatch = useDispatch();
  const store = useStore();
  const notificationListener = useRef();
  const responseListener = useRef();
  const lastNotificationResponse = Notifications.useLastNotificationResponse();

  const onLogin = async () => {
    isLoggedIn.current = true;
    // await dispatch(getCurrentUserById()); //tätä ei tarvitse myöskään kun init
    dispatch(clearTasks(store.getState().auth.currentUser._id));

    try {
      const roomState = await asyncStorageFuncs.getData("roomState");
      const userState = await asyncStorageFuncs.getData("userState");
      const userLastSeenMessages = await asyncStorageFuncs.getData(
        "userLastSeenMessages"
      );
      const messageState = await asyncStorageFuncs.getData("messageState");
      // console.log(value, "tämä on joo json aik");
      dispatch(roomsResived(roomState));
      dispatch(usersResived(userState));
      dispatch(currentUserLastSeenMessagesResived(userLastSeenMessages));
      dispatch(messagesResived(messageState));
    } catch (error) {
      console.log(error, "code 9929918");
    }

    dispatch(getInitialData);
    const currentUserPushTokenNow =
      store.getState().auth.currentUser.userPushNotificationToken;

    pushNotificationFuncs.registerForPushNotificationsAsync(
      (currentUserPushToken) =>
        dispatch(saveCurrentUserPushToken(currentUserPushToken)),
      currentUserPushTokenNow
    );
  };

  const handleResponse = (lastNotificationResponse) => {
    try {
      const currentRoomId =
        lastNotificationResponse.response.notification.request.content.data
          .roomId;
      const roomData = store.getState().entities.rooms.allRooms[currentRoomId];
      alert("täällä menee");
      alert("menee joo ", currentRoomId);
      // navigationRef.current.navigate(routes.MESSAGE_SCREEN, roomData);
    } catch (error) {
      console.log(error, "app.js responselistener");
    }
  };

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        alert("viesti huoneeseen:", notification.request.content.data.roomId);
        // const currentRoomId = notification.request.content.data.roomId;
        // const roomData =
        //   store.getState().entities.rooms.allRooms[currentRoomId];
        // navigationRef.current.navigate(routes.MESSAGE_SCREEN, roomData);
      });

    // tämä jos ei sovelluksessa
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const currentRoomId = response.notification.request.content.data.roomId;

        const roomData =
          store.getState().entities.rooms.allRooms[currentRoomId];

        navigationRef.current.navigate(routes.MESSAGE_SCREEN, roomData);
      });

    try {
      if (
        lastNotificationResponse &&
        lastNotificationResponse.notification.request.content.data.roomId
      ) {
        const responseRoomId =
          lastNotificationResponse.notification.request.content.data.roomId;
        alert(
          "tämä tuli:",
          lastNotificationResponse.notification.request.content.data
        );

        handleResponse(lastNotificationResponse);
      }
    } catch (error) {
      alert(error, "code 2777218");
    }

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const restoreUser = async () => {
    await Font.loadAsync({
      Avenir: require("./assets/fonts/Avenir.ttf"),
    });
    // setIsReady(true); // ei kuuluisi olla tässä, mut testaan
    // const userData = await authStorage.getUser();

    // if (userData) setUserData(userData);
  };

  const accountType = useSelector(selectAccountType);
  let isLoggedIn = useRef(false);
  accountType && !isLoggedIn.current ? onLogin() : {};
  if (!accountType) isLoggedIn.current = false;
  console.log("app päivittyy");
  const [isReady, setIsReady] = useState(false);
  if (!isReady)
    return (
      <AppLoading
        startAsync={restoreUser}
        onFinish={() => setIsReady(true)}
        onError={console.warn}
      />
    );

  return (
    <NavigationContainer ref={navigationRef} theme={navigationTheme}>
      <StatusBar style="dark" />

      <AppErrorToast />
      <AppSuccessToast />

      <GeneralLoadIndicator />
      {!accountType && <AuthNavigator />}
      {accountType === "admin" && <AdminNavigator />}
      {accountType && accountType !== "admin" && <AppNavigator />}
      {/* <AuthNavigator /> */}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
