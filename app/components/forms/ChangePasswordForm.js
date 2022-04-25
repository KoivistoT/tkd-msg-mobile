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

function ChangePasswordForm({
  closeModal,
  requireCurrentPassword = true,
  userName,
}) {
  const dispatch = useDispatch();

  const [currentLoginData, setCurrentLoginData] = useState(null);

  const getCurrentLoginData = async () => {
    const loginData = await asyncStorageFuncs.getData("loginData");
    setCurrentLoginData(loginData);
  };

  useEffect(() => {
    getCurrentLoginData();
  }, []);

  const handleSubmit = async ({ newPassword }) => {
    if (!currentLoginData) {
      alert("Something faild");
      closeModal();
      return;
    }

    dispatch(editPassword(userName, newPassword));
    closeModal();
  };

  const validationSchema = requireCurrentPassword
    ? Yup.object().shape({
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
      })
    : Yup.object().shape({
        newPassword: Yup.string().required().min(5).label("New password"),
        confirmPassword: Yup.string()
          .required()
          .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
      });

  return (
    <AppKeyboardDismiss>
      <View style={styles.container}>
        <AppForm
          initialValues={{}}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <>
            {requireCurrentPassword && (
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
            )}
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
              <SubmitButton
                backgroundColor="white"
                color="black"
                title="Save new password"
              />
            </View>
          </>
        </AppForm>
      </View>
    </AppKeyboardDismiss>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,

    marginHorizontal: 10,
  },
});
export default ChangePasswordForm;
