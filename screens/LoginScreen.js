import React, { useEffect, useState } from "react";

import { View, StyleSheet } from "react-native";
import * as Yup from "yup";
import Screen from "../app/components/Screen";
import ErrorMessage from "../app/components/ErrorMessage";
import AppForm from "../app/components/forms/AppForm";
import AppFormField from "../app/components/forms/AppFormField";
import SubmitButton from "../app/components/forms/SubmitButton";
import AppKeyboardDismiss from "../app/components/AppKeyboardDismiss";
import AppLoadIndicator from "../app/components/AppLoadIndicator";
import { useDispatch, useSelector, useStore } from "react-redux";
import {
  clearErrorMessage,
  errorMessageCleared,
  login,
} from "../store/currentUser";
import { createSocketConnection } from "../store/socket";
import asyncStorageFuncs from "../utility/asyncStorageFuncs";
import AppText from "../app/components/AppText";

const validationSchema = Yup.object().shape({
  userName: Yup.string().required().email().label("Username"),
  password: Yup.string().required().min(4).label("Password"),
});

function LoginScreen({ navigation }) {
  const store = useStore();
  const [loading, setLoading] = useState(false);
  // const store = useStore();
  // console.log(store.getState());

  const isLoginFailed = useSelector((state) => state.auth.currentUser.error);

  const dispatch = useDispatch();

  const handleSubmit = async ({ userName, password }) => {
    // dispatch(errorMessageCleared()); // tämän voisti tehdä onStart:issa
    asyncStorageFuncs.setData("autoLogin", true);
    asyncStorageFuncs.setData("loginData", { userName, password });

    setLoading(true);
    dispatch(login(userName, password));
  };

  const [isAutoLoginChecked, setIsAutoLoginChecked] = useState(false);

  useEffect(() => {
    checkAutologin();

    if (isLoginFailed) {
      setIsAutoLoginChecked(true);
    }
  }, [isLoginFailed]);

  // tämä voi olla muualla
  const checkAutologin = async () => {
    try {
      const autoLogin = await asyncStorageFuncs.getData("autoLogin");

      const loginData = await asyncStorageFuncs.getData("loginData");

      if (autoLogin && loginData) {
        handleSubmit(loginData);
      }
      if (!autoLogin) {
        setIsAutoLoginChecked(true);
      }
    } catch (error) {}
  };

  return (
    <Screen style={styles.container}>
      {!isAutoLoginChecked && (
        // tämä componentti voi olla yleinen, teksti vain muuttujana siinä
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            justifyContent: "center",
          }}
        >
          <AppText>TÄSSÄ SPLASH SCREEN</AppText>
        </View>
      )}
      {isAutoLoginChecked && (
        <AppKeyboardDismiss>
          <AppForm
            initialValues={{ userName: "timon@posti.fi", password: "12345" }}
            // initialValues={{ userName: "joo@joo.fi", password: "111111" }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            <>
              <AppFormField
                autoCapitalize="none"
                autoCorrect={false}
                icon="account-outline"
                keyboardType="email-address"
                name="userName"
                placeholder="Username/email"
              />

              <AppFormField
                autoCapitalize="none"
                autoCorrect={false}
                icon="lock"
                name="password"
                placeholder="Password"
                secureTextEntry
                textContentType="password"
              />
              <ErrorMessage error={isLoginFailed} visible={isLoginFailed} />
              {/* <TouchableOpacity
            style={{ alignSelf: "flex-start", marginRight: 10 }}
            onPress={() => navigation.navigate("Reset_password")}
          >
            <AppText>Reset password</AppText>
          </TouchableOpacity> */}
              <View style={{ flexDirection: "row", alignSelf: "flex-end" }}>
                {loading && !isLoginFailed && <AppLoadIndicator />}
                <SubmitButton title="LOGIN" />
              </View>
            </>
          </AppForm>
        </AppKeyboardDismiss>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    // paddingTop: 200,
    marginHorizontal: 10,
    flex: 1,
  },
});
export default LoginScreen;
