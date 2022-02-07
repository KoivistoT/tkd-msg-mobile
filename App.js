import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef } from "./app/navigation/rootNavigation";
import navigationTheme from "./app/navigation/navigationTheme";
import authApi from "./api/auth";
import configureStore from "./store/configureStore";
import jwtDecode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { Provider } from "react-redux";
import AppToast from "./app/components/AppToast";
import Login from "./app/components/Login";
import {
  getCurrentUser,
  getCurrentUserById,
  getCurrentUserRooms,
  getToken,
  isLoggedIn,
  logout,
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
import { getAllRooms } from "./store/rooms";

if (!__DEV__) {
  console.log = () => null;
}

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

  useEffect(() => {}, []);

  const onLogin = async () => {
    await dispatch(getCurrentUserById());
    // dispatch(getAllRooms()); // tätä ei tarvitse tässä
    dispatch(createSocketConnection());
  };

  const token = useSelector(selectToken);
  token ? onLogin() : {};

  return (
    <NavigationContainer ref={navigationRef} theme={navigationTheme}>
      <AppToast />
      {token ? <AppNavigator /> : <AuthNavigator />}
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
