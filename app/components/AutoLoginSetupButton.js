import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import asyncStorageFuncs from "../../utility/asyncStorageFuncs";
import AppButton from "./AppButton";

function AutoLoginSetupButton(props) {
  const [autoLoginState, setAutoLoginState] = useState();

  useEffect(() => {
    checkAutoLoginState();
  }, []);

  const checkAutoLoginState = async () => {
    const autoLogin = await asyncStorageFuncs.getData("autoLogin");
    setAutoLoginState(autoLogin);
  };

  const changeAutologinSate = () => {
    setAutoLoginState((prevState) => !prevState);
    asyncStorageFuncs.setData("autoLogin", !autoLoginState);
  };

  return (
    <AppButton
      onPress={() => changeAutologinSate()}
      title={`Set auto login ${autoLoginState ? "off" : "on"}`}
      backgroundColor={autoLoginState ? "danger" : "success"}
    />
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default AutoLoginSetupButton;
