import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";

import authApi from "./api/auth";
import configureStore from "./store/configureStore";
import jwtDecode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { Provider } from "react-redux";
import Login from "./app/components/Login";
import { isLoggedIn, logout, selectToken, userLoggedOut } from "./store/auth";
import LoginScreen from "./screens/LoginScreen";
import ErrorMessage from "./app/components/ErrorMessage";
import MessageScreen from "./screens/MessageScreen";
import io from "socket.io-client";
import settings from "./config/settings";

export default function AppWrapper() {
  const store = configureStore();
  const msg = "joo";

  const socketUrl = "http://localhost:3000/";

  useEffect(() => {
    const socket = io.connect(socketUrl, {
      transports: ["websocket"],
      jsonp: false,
    });
    // socket.on("connect", () => {
    //   console.log("connected to socket server");
    // });
    // socket.on("chat message", () => {
    //   console.log("connected to socket server");
    // });
    // socket.on("connection", (socket) => {
    //   socket.on("chat message", (msg) => {
    //     console.log("message: " + msg);
    //   });
    // });
    socket.on("chat message", function (msg) {
      console.log(msg);
    });
    socket.emit("chat message", "täältä");
    // return () => {
    //   cleanup
    // }
  }, []);
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

function App() {
  useEffect(() => {
    onLogin();

    // console.log(store.getState());
  }, []);

  const token = useSelector(selectToken);

  const onLogin = async () => {
    //katso moshilta tämä react native kurssilta kunnolla kuntoon
    // const email = "timon@posti.fi";
    // const password = "12345";
    // const result = await authApi.login(email, password);
    // const user = jwtDecode(result.data);
    // console.log(user);
  };

  return (
    <View style={styles.container}>
      {token ? <MessageScreen /> : <LoginScreen />}
      <StatusBar style="auto" />
    </View>
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
