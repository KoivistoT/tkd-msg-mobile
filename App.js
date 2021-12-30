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

export default function AppWrapper() {
  const store = configureStore();
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
  const dispatch = useDispatch();
  return (
    <View style={styles.container}>
      {token ? (
        <View>
          <TouchableOpacity onPress={() => dispatch(userLoggedOut())}>
            <Text>kirjaudu ulos</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <LoginScreen />
      )}
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
