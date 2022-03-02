import React, { useState } from "react";

import { View, StyleSheet, Keyboard } from "react-native";
import * as Yup from "yup";
import Screen from "../Screen";
import ErrorMessage from "../ErrorMessage";
import AppForm from "./AppForm";
import AppFormField from "./AppFormField";
import SubmitButton from "./SubmitButton";
import AppKeyboardDismiss from "../AppKeyboardDismiss";
import AppLoadIndicator from "../AppLoadIndicator";
import { useDispatch, useSelector, useStore } from "react-redux";

import AppFormPicker from "./AppFormPicker";

import { createChannel, getErrorMessage } from "../../../store/rooms";
import { getCurrentUserId } from "../../../store/currentUser";

const validationSchema = Yup.object().shape({
  roomName: Yup.string().required().min(1).label("Channel name"),
  type: Yup.string().required().min(1).label("Room type"),
});

function CreateChannelForm({ navigation, closeModal }) {
  const [loading, setLoading] = useState(false);

  const isLoginFailed = useSelector((state) => state.auth.currentUser.error);

  const dispatch = useDispatch();
  const errorMessage = useSelector(getErrorMessage());
  const userId = useSelector(getCurrentUserId);
  const handleSubmit = async ({ roomName, type }) => {
    dispatch(createChannel(userId, roomName));
    closeModal();
  };

  return (
    <Screen style={styles.container}>
      <AppForm
        initialValues={{
          type: "channel",
          roomName: "",
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <>
          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="account-outline"
            keyboardType="email-address"
            name="roomName"
            placeholder="Channel name"
          />

          <View style={{ flexDirection: "row", alignSelf: "center" }}>
            {loading && !isLoginFailed && <AppLoadIndicator />}
            <SubmitButton title="Create channel" />
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
export default CreateChannelForm;
