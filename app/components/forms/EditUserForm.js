import React, { useState } from "react";

import { View, StyleSheet, ScrollView } from "react-native";
import * as Yup from "yup";
import Screen from "../Screen";
import AppForm from "../forms/AppForm";
import AppFormField from "../forms/AppFormField";
import SubmitButton from "../forms/SubmitButton";
import { useDispatch, useSelector } from "react-redux";
import createTask from "../../../utility/createTask";
import AppFormPicker from "./AppFormPicker";

import {
  editUserData,
  createUser,
  getAllUsers,
  usersErrorMessageCleared,
  userTasksResived,
  userDataFieldEdited,
} from "../../../store/users";
import AppText from "../AppText";
import colors from "../../../config/colors";

const accountTypeOptions = [
  { label: "Admin", value: "admin" },
  { label: "Basic", value: "basic" },
];
const validationSchema = Yup.object().shape({
  firstName: Yup.string().required().min(1).label("Firstname"),
  lastName: Yup.string().required().min(2).label("lastname"),
  displayName: Yup.string().required().min(2).label("Displayname"),
  email: Yup.string().required().email().label("Email"),
  accountType: Yup.string().required().min(1).label("AccountType"),
});

const FIELD_WIDTH = "70%";

function EditUserForm({ userData, closeModal, hideFields = [] }) {
  const dispatch = useDispatch();

  const handleSubmit = async ({
    accountType,
    displayName,
    firstName,
    lastName,
    email,
    phone,
  }) => {
    const userId = userData._id;

    const payload = {
      accountType,
      displayName,
      firstName,
      lastName,
      email,
      phone,
      userId,
    };

    //  { currentUserId, fieldName, value: fieldValue };
    const fields = [];
    Object.keys(payload).forEach((key) => {
      fields.push({
        currentUserId: userId,
        fieldName: key,
        value: payload[key],
      });
    });

    dispatch(userDataFieldEdited(fields));

    dispatch(editUserData(payload));
    dispatch(getAllUsers);
    closeModal();
  };

  return (
    <ScrollView style={styles.container}>
      <AppForm
        initialValues={{
          accountType: userData.accountType,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone,
          displayName: userData.displayName,
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <>
          {!hideFields.includes("accountType") && (
            <AppFormPicker
              options={accountTypeOptions}
              autoCapitalize="none"
              icon="account-outline"
              name="accountType"
              placeholder="Account type"
            ></AppFormPicker>
          )}

          <AppFormField
            width={FIELD_WIDTH}
            autoCapitalize="none"
            autoCorrect={false}
            icon="account-outline"
            keyboardType="email-address"
            name="firstName"
            placeholder="Fistname"
            showLabel
          />
          <AppFormField
            width={FIELD_WIDTH}
            autoCapitalize="none"
            autoCorrect={false}
            icon="account-outline"
            keyboardType="email-address"
            name="lastName"
            placeholder="Lastname"
            showLabel
          />
          <AppFormField
            width={FIELD_WIDTH}
            autoCapitalize="none"
            autoCorrect={false}
            icon="account-outline"
            name="displayName"
            placeholder="DisplayName"
            showLabel
          />
          <AppFormField
            width={FIELD_WIDTH}
            autoCapitalize="none"
            autoCorrect={false}
            icon="account-outline"
            keyboardType="email-address"
            name="email"
            placeholder="email"
            showLabel
          />
          <AppFormField
            width={FIELD_WIDTH}
            placeholder="Phone"
            autoCorrect={false}
            icon="phone"
            keyboardType="phone-pad"
            autoCapitalize="none"
            textContentType="telephoneNumber"
            name="phone"
            showLabel
          />
        </>
        <View
          style={{
            flexDirection: "row",
            alignSelf: "center",
            marginVertical: 20,
          }}
        >
          <SubmitButton title="Save changes" />
        </View>
      </AppForm>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 10 },
});
export default EditUserForm;
