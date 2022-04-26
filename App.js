import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef, navigate } from "./app/navigation/rootNavigation";
import navigationTheme from "./app/navigation/navigationTheme";
import * as Notifications from "expo-notifications";
import { LogBox } from "react-native";

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
  getCurrentUserById,
  selectCurrentUserId,
} from "./store/currentUser";

import AuthNavigator from "./app/navigation/AuthNavigator";
import AppNavigator from "./app/navigation/AppNavigator";

import { firebaseLogin } from "./api/firebaseClient";
import routes from "./app/navigation/routes";
import AdminNavigator from "./app/navigation/AdminNavigator";
import AppSuccessToast from "./app/components/AppSuccessToast";

import asyncStorageFuncs from "./utility/asyncStorageFuncs";
import {
  activeRoomIdResived,
  getUserRoomsByUserId,
  notificationResponseResived,
  roomsResived,
  selectActiveRoomId,
} from "./store/rooms";
import { getAllUsers, usersResived } from "./store/users";
import pushNotificationFuncs from "./utility/pushNotificationFuncs";
import { getRestMessages, messagesResived } from "./store/msgStore";

import { createSocketConnection } from "./store/socket";
import { newMessageResived, pushNotificationPressed } from "./store/general";
import NewMessageNotification from "./app/components/NewMessageNotification";

if (!__DEV__) {
  console.log = () => null;
}
LogBox.ignoreLogs([
  "AsyncStorage has been extracted from react-native core and will be removed in a future release. It can now be installed and imported from '@react-native-async-storage/async-storage' instead of 'react-native'. See https://github.com/react-native-async-storage/async-storage",
]);
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
    dispatch(createSocketConnection());
    isLoggedIn.current = true;
    // await dispatch(getCurrentUserById()); //tätä ei tarvitse myöskään kun init
    const currentUserId = selectCurrentUserId(store);

    dispatch(clearTasks(currentUserId));

    try {
      // const roomState = await asyncStorageFuncs.getData("roomState");
      // const userState = await asyncStorageFuncs.getData("userState");
      // const userLastSeenMessages = await asyncStorageFuncs.getData(
      //   "userLastSeenMessages"
      // );
      // const messageState = await asyncStorageFuncs.getData("messageState");
      // console.log(messageState);
      // console.log(value, "tämä on joo json aik");
      // dispatch(roomsResived(roomState));
      // dispatch(usersResived(userState));
      // dispatch(currentUserLastSeenMessagesResived(userLastSeenMessages));
      // // ei voi käyttää tätä
      // dispatch(messagesResived(messageState));
    } catch (error) {
      console.log(error, "code 9929918");
    }

    // dispatch(getCurrentUserById(currentUserId));
    // dispatch(getAllUsers());
    // dispatch(getUserRoomsByUserId(currentUserId));

    dispatch(getInitialData);
    // dispatch(getRestMessages(currentUserId));

    //tämä pitää siirtää roomslistalle, selectorilla,

    const currentUserPushTokenNow =
      store.getState().auth.currentUser.userPushNotificationToken;

    pushNotificationFuncs.registerForPushNotificationsAsync(
      (currentUserPushToken) =>
        dispatch(saveCurrentUserPushToken(currentUserPushToken)),
      currentUserPushTokenNow
    );
  };

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        if (
          notification.request.content.data.roomId !== selectActiveRoomId(store)
        ) {
          dispatch(
            newMessageResived({
              ...notification.request.content.data,
            })
          );
        }
        // console.log(notification.request.content.data);
        // const currentRoomId = notification.request.content.data.roomId;
        // const roomData =
        //   store.getState().entities.rooms.allRooms[currentRoomId];
        // navigate(routes.MESSAGE_SCREEN, roomData);
      });

    // tämä jos ei sovelluksessa
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const currentRoomId = response.notification.request.content.data.roomId;

        dispatch(pushNotificationPressed());

        const roomData =
          store.getState().entities.rooms.allRooms[currentRoomId];

        if (!roomData) return;
        navigate(routes.MESSAGE_SCREEN, roomData);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    try {
      if (
        lastNotificationResponse &&
        lastNotificationResponse.notification.request.content.data.roomId
        // && lastNotificationResponse.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER
      ) {
        dispatch(
          notificationResponseResived(
            lastNotificationResponse.notification.request.content.data.roomId
          )
        );
      }
    } catch (error) {
      // alert(error, "code 2777218");
      alert("Something went wrong!");
    }
  }, [lastNotificationResponse]);

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
      <NewMessageNotification />
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
