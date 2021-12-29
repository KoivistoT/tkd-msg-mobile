import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import AppTextInput from "./componets/AppTextInput";
import authApi from "./api/auth";
import configureStore from "./store/configureStore";
import jwtDecode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { Provider } from "react-redux";
import Login from "./componets/Login";

const store = configureStore();

export default function App() {
  useEffect(() => {
    onLogin();

    // console.log(store.getState());
  }, []);

  const onLogin = async () => {
    //katso moshilta tämä react native kurssilta kunnolla kuntoon
    // const email = "timon@posti.fi";
    // const password = "12345";
    // const result = await authApi.login(email, password);
    // const user = jwtDecode(result.data);
    // console.log(user);
  };

  console.log(
    "ei päivitä app js statea reduxissa, joten toteuta jotenkin paremmin, oikein"
  );

  return (
    <Provider store={store}>
      <View style={styles.container}>
        {/* <AppTextInput /> */}

        {store.getState().entities.auth.loggedIn ? (
          <Text>Kirjautunut</Text>
        ) : (
          <Login />
        )}
        <StatusBar style="auto" />
      </View>
    </Provider>
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
