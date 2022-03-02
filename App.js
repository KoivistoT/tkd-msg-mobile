import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet, TouchableOpacity, Text, View, LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef } from "./app/navigation/rootNavigation";
import navigationTheme from "./app/navigation/navigationTheme";
import authApi from "./api/auth";
import configureStore from "./store/configureStore";
import jwtDecode from "jwt-decode";
import { useDispatch, useSelector, useStore } from "react-redux";
import { Provider } from "react-redux";
import AppToast from "./app/components/AppToast";
import Login from "./app/components/Login";

import {
  getCurrentUser,
  getCurrentUserById,
  getCurrentUserRooms,
  getInitialData,
  getToken,
  isLoggedIn,
  logout,
  selectAccountType,
  selectToken,
  userLoggedOut,
} from "./store/currentUser";
import LoginScreen from "./screens/LoginScreen";
import ErrorMessage from "./app/components/ErrorMessage";
import MessageScreen from "./screens/MessageScreen";
import io from "socket.io-client";
import settings from "./config/settings";
import RoomsScreen from "./screens/RoomsScreen.js";

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

  const onLogin = async () => {
    // await dispatch(getCurrentUserById()); //tätä ei tarvitse myöskään kun init

    await dispatch(getInitialData());
    dispatch(createSocketConnection());
    // const item = {
    //   _id: "6214ebe20f8502580b0e19a1",
    // };
    // navigationRef.current.navigate(routes.MESSAGE_SCREEN, item);
  };

  const accountType = useSelector(selectAccountType);
  accountType ? onLogin() : {};

  return (
    <NavigationContainer ref={navigationRef} theme={navigationTheme}>
      <AppToast />
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
