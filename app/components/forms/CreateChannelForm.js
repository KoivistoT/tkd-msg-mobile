import React from "react";
import { View, StyleSheet } from "react-native";
import * as Yup from "yup";
import Screen from "../Screen";
import AppForm from "./AppForm";
import AppFormField from "./AppFormField";
import SubmitButton from "./SubmitButton";
import { useDispatch, useStore } from "react-redux";
import { createChannel } from "../../../store/rooms";

const validationSchema = Yup.object().shape({
  roomName: Yup.string().required().min(1).label("Channel name"),
  description: Yup.string().label("Description"),
});

function CreateChannelForm({ closeModal }) {
  const dispatch = useDispatch();
  const store = useStore();

  const userId = store.getState().auth.currentUser._id;

  const handleSubmit = async ({ roomName, description }) => {
    dispatch(createChannel(userId, roomName, description));
    closeModal();
  };

  return (
    <Screen style={styles.container}>
      <AppForm
        initialValues={{
          roomName: "",
          description: "",
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
          <AppFormField
            style={{ height: 100 }}
            autoCapitalize="none"
            autoCorrect={false}
            multiline
            name="description"
            placeholder="Description"
          />

          <View style={{ flexDirection: "row", alignSelf: "center" }}>
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
