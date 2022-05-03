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
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/currentUser";
import asyncStorageFuncs from "../utility/asyncStorageFuncs";
import AppSplashScreen from "./AppSplashScreen";

const validationSchema = Yup.object().shape({
  userName: Yup.string().required().email().label("Username"),
  password: Yup.string().required().min(5).label("Password"),
});

function LoginScreen({}) {
  const dispatch = useDispatch();

  const [isAutoLoginChecked, setIsAutoLoginChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const isLoginFailed = useSelector((state) => state.auth.currentUser.error);

  const handleSubmit = async ({ userName, password }) => {
    asyncStorageFuncs.setData("loginData", { userName, password });
    setLoading(true);
    dispatch(login(userName, password));
  };

  useEffect(() => {
    checkAutologin();
    if (isLoginFailed) {
      setIsAutoLoginChecked(true);
    }
  }, [isLoginFailed]);

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
      {!isAutoLoginChecked && !isLoginFailed && <AppSplashScreen />}
      {isAutoLoginChecked && (
        <AppKeyboardDismiss>
          <View style={styles.formContainer}>
            <AppForm
              initialValues={{ userName: "timon@posti.fi", password: "12345" }}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              <>
                <AppFormField
                  width={300}
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
                  width={300}
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

                <View style={styles.buttonContainer}>
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
    flex: 1,
  },
  formContainer: { marginTop: 100, alignSelf: "center", padding: "10%" },
  buttonContainer: { padding: 20 },
});
export default LoginScreen;
