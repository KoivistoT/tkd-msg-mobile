import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  AppState,
  Text,
  View,
  LogBox,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef } from "./app/navigation/rootNavigation";
import navigationTheme from "./app/navigation/navigationTheme";
import authApi from "./api/auth";
import configureStore from "./store/configureStore";
import jwtDecode from "jwt-decode";
import { useDispatch, useSelector, useStore } from "react-redux";
import { Provider } from "react-redux";
import AppErrorToast from "./app/components/AppErrorToast";
import GeneralLoadIndicator from "./app/components/GeneralLoadIndicator";
import Login from "./app/components/Login";

import {
  getCurrentUser,
  getCurrentUserById,
  getInitialData,
  selectIsCurrentUserLoggedIn,
  logout,
  selectAccountType,
  selectToken,
  userLoggedOut,
  clearTasks,
} from "./store/currentUser";
import LoginScreen from "./screens/LoginScreen";
import ErrorMessage from "./app/components/ErrorMessage";
import MessageScreen from "./screens/MessageScreen";
import io from "socket.io-client";
import settings from "./config/settings";
import RoomsListScreen from "./screens/RoomsListScreen.js";

import {
  saveSocket,
  socketConnected,
  createSocketConnection,
  selectSocket,
} from "./store/socket";
import AuthNavigator from "./app/navigation/AuthNavigator";
import AppNavigator from "./app/navigation/AppNavigator";

import { firebaseLogin } from "./api/firebaseClient";
import routes from "./app/navigation/routes";
import AdminNavigator from "./app/navigation/AdminNavigator";
import AppSuccessToast from "./app/components/AppSuccessToast";
import TaskHandler from "./app/components/TaskHandler";
import NewTasks from "./app/components/NewTasks";
import asyncStorageFuncs from "./utility/asyncStorageFuncs";
import { roomsResived } from "./store/rooms";
import { usersResived } from "./store/users";

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
  const onLogin = async () => {
    // await dispatch(getCurrentUserById()); //tätä ei tarvitse myöskään kun init
    dispatch(clearTasks(store.getState().auth.currentUser._id));
    const value = await asyncStorageFuncs.getData("roomState");
    const value2 = await asyncStorageFuncs.getData("userState");
    // console.log(value, "tämä on joo json aik");
    dispatch(roomsResived(value));
    dispatch(usersResived(value2));
    dispatch(getInitialData);

    // ei tarvi mennä kuin huoneeseen, niin sitten siellä näyttää viestit, kun ne tulee
    // setTimeout(() => {
    //   const item = {
    //     _id: "62357ebf9fdfe524a837c4b4",
    //   };
    //   navigationRef.current.navigate(routes.MESSAGE_SCREEN, item);
    // }, 2000);
  };

  const accountType = useSelector(selectAccountType);
  accountType ? onLogin() : {};

  return (
    <NavigationContainer ref={navigationRef} theme={navigationTheme}>
      <AppErrorToast />
      <AppSuccessToast />
      {/* <TaskHandler /> */}
      {/* <NewTasks /> */}
      <GeneralLoadIndicator />
      {!accountType && <AuthNavigator />}
      {accountType === "admin" && <AdminNavigator />}
      {accountType && accountType !== "admin" && <AppNavigator />}

      {/* <AppNavigator /> */}
      <StatusBar style="auto" />
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
