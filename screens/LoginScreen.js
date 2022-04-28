import React, { useEffect, useState } from "react";

import { View, StyleSheet, Image, Dimensions } from "react-native";
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
import colors from "../config/colors";

const validationSchema = Yup.object().shape({
  userName: Yup.string().required().email().label("Username"),
  password: Yup.string().required().min(5).label("Password"),
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
    // asyncStorageFuncs.setData("autoLogin", true);
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
      {!isAutoLoginChecked && !isLoginFailed && (
        <View
          style={{
            position: "absolute",
            backgroundColor: colors.white,
            zIndex: 2,
            width: "100%",
            height: "100%",
            justifyContent: "center",
          }}
        >
          <Image
            source={require("../assets/splash.png")}
            defaultSource={require("../assets/splash.png")}
          />
        </View>
      )}
      {isAutoLoginChecked && (
        <AppKeyboardDismiss>
          <View style={{ marginTop: 100, alignSelf: "center", padding: "10%" }}>
            <AppForm
              initialValues={{ userName: "timon@posti.fi", password: "12345" }}
              // initialValues={{ userName: "joo@joo.fi", password: "111111" }}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              <>
                <AppFormField
                  marginBottom={20}
                  padding={5}
                  autoCapitalize="none"
                  autoCorrect={false}
                  icon="account-outline"
                  keyboardType="email-address"
                  name="userName"
                  placeholder="Username/email"
                />

                <AppFormField
                  padding={5}
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
          </View>
        </AppKeyboardDismiss>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    // padding: 20,
    // paddingTop: 200,
    // marginHorizontal: 10,
    flex: 1,
  },
});
export default LoginScreen;
