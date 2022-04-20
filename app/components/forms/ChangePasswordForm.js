import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import * as Yup from "yup";
import Screen from "../Screen";
import AppForm from "./AppForm";
import AppFormField from "./AppFormField";
import SubmitButton from "./SubmitButton";
import { useDispatch, useStore } from "react-redux";
import { changeRoomName, createChannel } from "../../../store/rooms";
import AppKeyboardDismiss from "../AppKeyboardDismiss";
import asyncStorageFuncs from "../../../utility/asyncStorageFuncs";
import { editPassword } from "../../../store/currentUser";

function ChangePasswordForm({ closeModal }) {
  const dispatch = useDispatch();

  const [currentLoginData, setCurrentLoginData] = useState(null);

  const getCurrentLoginData = async () => {
    const loginData = await asyncStorageFuncs.getData("loginData");
    setCurrentLoginData(loginData);
  };

  useEffect(() => {
    getCurrentLoginData();
  }, []);

  const handleSubmit = async ({ currentPassword, newPassword }) => {
    if (!currentLoginData) {
      alert("Something faild");
      closeModal();
      return;
    }

    dispatch(editPassword(currentLoginData.userName, newPassword));
    closeModal();
  };

  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string()
      .required()
      .oneOf(
        [currentLoginData ? currentLoginData.password : " ", null],
        "Current password is wrong"
      )
      .label("Current password"),
    newPassword: Yup.string().required().min(5).label("New password"),
    confirmPassword: Yup.string()
      .required()

      .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
  });

  return (
    <Screen style={styles.container}>
      <AppKeyboardDismiss>
        <AppForm
          initialValues={{}}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <>
            <AppFormField
              padding={5}
              marginBottom={10}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              // icon="account-outline"
              name="currentPassword"
              placeholder={"Current password"}
            />
            <AppFormField
              padding={5}
              marginBottom={10}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              // icon="account-outline"
              name="newPassword"
              placeholder={"New password"}
            />
            <AppFormField
              padding={5}
              marginBottom={10}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              // icon="account-outline"
              name="confirmPassword"
              placeholder="Confirm password"
            />

            <View
              style={{
                flexDirection: "row",
                alignSelf: "center",
                marginTop: 20,
              }}
            >
              <SubmitButton title="Save new password" />
            </View>
          </>
        </AppForm>
      </AppKeyboardDismiss>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,

    marginHorizontal: 10,
    flex: 1,
  },
});
export default ChangePasswordForm;
