import React, { useState } from "react";

import { View, StyleSheet, Keyboard, ScrollView } from "react-native";
import * as Yup from "yup";
import Screen from "../Screen";
import ErrorMessage from "../ErrorMessage";
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
  getErrorMessage,
  usersErrorCleared,
} from "../../../store/users";

const accountTypeOptions = [
  { label: "Admin", value: "admin" },
  { label: "Basic", value: "basic" },
];
const validationSchema = Yup.object().shape({
  password: Yup.string().required().min(4).label("Password"),
  firstName: Yup.string().required().min(1).label("Firstname"),
  lastName: Yup.string().required().min(2).label("lastname"),
  displayName: Yup.string().required().min(2).label("Displayname"),
  email: Yup.string().required().email().label("Email"),
  accountType: Yup.string().required().min(1).label("AccountType"),
});

function CreateUserForm({ navigation, closeModal }) {
  const [loading, setLoading] = useState(false);

  const errorMessage = useSelector(getErrorMessage());
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

    if (errorMessage) {
      console.log("Ei onnistunut päonnistui");
      setLoading(false);
    } else {
      dispatch(getAllUsers());
      dispatch(usersErrorCleared());
      closeModal();
    }
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
              placeholder="Phone"
              autoCorrect={false}
              icon="phone"
              keyboardType="phone-pad"
              autoCapitalize="none"
              textContentType="telephoneNumber"
              name="phone"
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
