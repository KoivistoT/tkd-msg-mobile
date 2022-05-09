import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef, navigate } from "./app/navigation/rootNavigation";
import navigationTheme from "./app/navigation/navigationTheme";
import * as Notifications from "expo-notifications";
import configureStore from "./store/configureStore";
import { Provider, useDispatch, useSelector, useStore } from "react-redux";
import AppErrorToast from "./app/components/AppErrorToast";
import GeneralLoadIndicator from "./app/components/GeneralLoadIndicator";
import {
  getInitialData,
  selectAccountType,
  clearTasks,
  selectCurrentUserId,
} from "./store/currentUser";
import AuthNavigator from "./app/navigation/AuthNavigator";
import AppNavigator from "./app/navigation/AppNavigator";
import { firebaseLogin } from "./api/firebaseClient";
import routes from "./app/navigation/routes";
import AdminNavigator from "./app/navigation/AdminNavigator";
import AppSuccessToast from "./app/components/AppSuccessToast";
import { notificationResponseResived, selectActiveRoomId } from "./store/rooms";
import pushNotificationFuncs from "./utility/pushNotificationFuncs";
import { createSocketConnection } from "./store/socket";
import { newMessageResived, pushNotificationPressed } from "./store/general";
import NewMessageNotification from "./app/components/NewMessageNotification";
import { saveEditedUserdata } from "./store/users";

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
  const [isReady, setIsReady] = useState(false);

  const accountType = useSelector(selectAccountType);

  const onLogin = () => {
    dispatch(createSocketConnection());
    isLoggedIn.current = true;
    const currentUserId = selectCurrentUserId(store);

    dispatch(clearTasks(currentUserId));

    dispatch(getInitialData);

    const currentUserPushTokenNow =
      store.getState().auth.currentUser.userPushNotificationToken;

    pushNotificationFuncs.registerForPushNotificationsAsync(
      (currentUserPushToken) =>
        dispatch(
          saveEditedUserdata({
            currentUserId,
            fieldName: "pushNotificationToken",
            value: currentUserPushToken,
          })
        ),
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
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const currentRoomId = response.notification.request.content.data.roomId;

        dispatch(pushNotificationPressed());

        const roomData =
          store.getState().entities.rooms.allRooms[currentRoomId];

        if (!roomData) {
          return;
        }
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
      ) {
        dispatch(
          notificationResponseResived(
            lastNotificationResponse.notification.request.content.data.roomId
          )
        );
      }
    } catch (error) {
      alert("Something went wrong!");
    }
  }, [lastNotificationResponse]);

  const restoreUser = async () => {
    await Font.loadAsync({
      Avenir: require("./assets/fonts/Avenir.ttf"),
    });
  };

  const isLoggedIn = useRef(false);

  if (accountType && !isLoggedIn.current) {
    onLogin();
  }
  if (!accountType) {
    isLoggedIn.current = false;
  }

  if (!isReady) {
    return (
      <AppLoading
        startAsync={restoreUser}
        onFinish={() => setIsReady(true)}
        onError={console.warn}
      />
    );
  }

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
    </NavigationContainer>
  );
}
