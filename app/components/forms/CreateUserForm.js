import React, { useState } from "react";

import { View, StyleSheet, Keyboard, ScrollView } from "react-native";
import * as Yup from "yup";
import Screen from "../Screen";

import AppForm from "../forms/AppForm";
import AppFormField from "../forms/AppFormField";
import SubmitButton from "../forms/SubmitButton";
import AppKeyboardDismiss from "../AppKeyboardDismiss";
import AppLoadIndicator from "../AppLoadIndicator";
import { useDispatch, useSelector, useStore } from "react-redux";

import AppFormPicker from "./AppFormPicker";

import {
  createUser,
  getAllUsers,
  usersErrorMessageCleared,
} from "../../../store/users";

const accountTypeOptions = [
  { label: "Admin", value: "admin" },
  { label: "Basic", value: "basic" },
];
const validationSchema = Yup.object().shape({
  password: Yup.string().required().min(4).label("Password"),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
  firstName: Yup.string().required().min(1).label("Firstname"),
  lastName: Yup.string().required().min(2).label("lastname"),
  displayName: Yup.string().required().min(2).label("Displayname"),
  email: Yup.string().required().email().label("Email"),
  accountType: Yup.string().required().min(1).label("AccountType"),
});

const MARGIN_BOTTOM = 10;
const FIELD_WIDTH = "80%";

function CreateUserForm({ navigation, closeModal }) {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleSubmit = async ({
    password,
    accountType,
    displayName,
    firstName,
    lastName,
    email,
    phone,
  }) => {
    setLoading(true);
    await dispatch(
      createUser(
        password,
        accountType,
        firstName,
        lastName,
        displayName,
        email,
        phone
      )
    );

    // if (errorMessage) {
    //   console.log("Ei onnistunut päonnistui");
    //   setLoading(false);
    // } else {
    dispatch(getAllUsers);

    closeModal();
    // }
  };

  return (
    <Screen>
      <ScrollView style={styles.container}>
        <AppForm
          initialValues={{
            accountType: "basic",

            password: "111111",
            firstName: "joo",
            lastName: "jaa",
            email: "joo@joo.fi",
            displayName: "joojaa",
            phone: "0456657435",
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
              marginBottom={MARGIN_BOTTOM}
              width={FIELD_WIDTH}
              autoCapitalize="none"
              autoCorrect={false}
              icon="account-outline"
              keyboardType="email-address"
              name="firstName"
              placeholder="Fistname"
            />
            <AppFormField
              marginBottom={MARGIN_BOTTOM}
              width={FIELD_WIDTH}
              autoCapitalize="none"
              autoCorrect={false}
              icon="account-outline"
              keyboardType="email-address"
              name="lastName"
              placeholder="Lastname"
            />
            <AppFormField
              marginBottom={MARGIN_BOTTOM}
              width={FIELD_WIDTH}
              autoCapitalize="none"
              autoCorrect={false}
              icon="account-outline"
              name="displayName"
              placeholder="DisplayName"
            />
            <AppFormField
              marginBottom={MARGIN_BOTTOM}
              width={FIELD_WIDTH}
              autoCapitalize="none"
              autoCorrect={false}
              icon="account-outline"
              keyboardType="email-address"
              name="email"
              placeholder="email"
            />
            <AppFormField
              marginBottom={MARGIN_BOTTOM}
              width={FIELD_WIDTH}
              placeholder="Phone"
              autoCorrect={false}
              icon="phone"
              keyboardType="phone-pad"
              autoCapitalize="none"
              textContentType="telephoneNumber"
              name="phone"
            />
            <AppFormField
              marginBottom={MARGIN_BOTTOM}
              width={FIELD_WIDTH}
              autoCapitalize="none"
              autoCorrect={false}
              icon="lock"
              name="password"
              placeholder="Password"
              secureTextEntry
              textContentType="password"
            />

            <AppFormField
              marginBottom={MARGIN_BOTTOM}
              width={FIELD_WIDTH}
              autoCapitalize="none"
              autoCorrect={false}
              icon="lock"
              name="confirmPassword"
              placeholder="Confirm password"
              secureTextEntry
              textContentType="password"
            />

            <View style={{ flexDirection: "row", alignSelf: "center" }}>
              <SubmitButton title="Create user" />
            </View>
          </>
        </AppForm>
      </ScrollView>
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
