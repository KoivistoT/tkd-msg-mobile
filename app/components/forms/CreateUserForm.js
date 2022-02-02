import React, { useState } from "react";

import { View, StyleSheet, Keyboard } from "react-native";
import * as Yup from "yup";
import Screen from "../Screen";
import ErrorMessage from "../ErrorMessage";
import AppForm from "../forms/AppForm";
import AppFormField from "../forms/AppFormField";
import SubmitButton from "../forms/SubmitButton";
import AppKeyboardDismiss from "../AppKeyboardDismiss";
import AppLoadIndicator from "../AppLoadIndicator";
import { useDispatch, useSelector, useStore } from "react-redux";
import {
  clearErrorMessage,
  errorMessageCleared,
  login,
} from "../../../store/currentUser";
import AppFormPicker from "./AppFormPicker";
import { createUser } from "../../../store/users";
import { getErrorMessage } from "../../../store/rooms";

const accountTypeOptions = [
  { label: "Pro", value: "pro" },
  { label: "Basic", value: "basic" },
];
const validationSchema = Yup.object().shape({
  userName: Yup.string().required().email().label("Username"),
  password: Yup.string().required().min(4).label("Password"),
  firstName: Yup.string().required().min(1).label("Firstname"),
  lastName: Yup.string().required().min(2).label("lastname"),
  displayName: Yup.string().required().min(2).label("Displayname"),
  email: Yup.string().required().email().label("Email"),
  accountType: Yup.string().required().min(1).label("AccountType"),
});

function CreateUserForm({ navigation, closeModal }) {
  const [loading, setLoading] = useState(false);

  const isLoginFailed = useSelector((state) => state.auth.currentUser.error);
  const store = useStore();
  const dispatch = useDispatch();

  const handleSubmit = async ({
    userName,
    password,
    accountType,
    displayName,
    firstName,
    lastName,
  }) => {
    // dispatch(errorMessageCleared());
    setLoading(true);
    dispatch(
      createUser(
        userName,
        password,
        accountType,
        firstName,
        lastName,
        displayName
      )
    );

    if (getErrorMessage()(store.getState())) {
      console.log("Ei onnistunut päonnistui");
      setLoading(false);
    } else {
      closeModal();
    }
  };

  return (
    <Screen style={styles.container}>
      <AppForm
        initialValues={{
          accountType: "basic",
          userName: "",
          password: "",
          firstName: "",
          lastName: "",
          displayName: "",
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <>
          <AppFormPicker
            options={accountTypeOptions}
            autoCapitalize="none"
            icon="account-outline"
            name="accountType"
            placeholder="Account type"
          ></AppFormPicker>
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
            icon="account-outline"
            keyboardType="email-address"
            name="firstName"
            placeholder="Fistname"
          />
          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="account-outline"
            keyboardType="email-address"
            name="lastName"
            placeholder="Lastname"
          />
          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="account-outline"
            name="displayName"
            placeholder="DisplayName"
          />
          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="account-outline"
            keyboardType="email-address"
            name="email"
            placeholder="email"
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

          <View style={{ flexDirection: "row", alignSelf: "center" }}>
            {loading && !isLoginFailed && <AppLoadIndicator />}
            <SubmitButton title="Create user" />
          </View>
        </>
      </AppForm>
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
export default CreateUserForm;