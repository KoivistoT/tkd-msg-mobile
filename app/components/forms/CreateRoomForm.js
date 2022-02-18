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

import AppFormPicker from "./AppFormPicker";

import {
  getErrorMessage,
  createRoom,
  roomsErrorCleared,
  getAllRooms,
} from "../../../store/roomsControl";

const roomTypeOptions = [
  { label: "Group", value: "group" },
  { label: "Private", value: "private" },
];

const validationSchema = Yup.object().shape({
  roomName: Yup.string().required().min(1).label("Room name"),
  type: Yup.string().required().min(1).label("Room type"),
});

function CreateRoomForm({ navigation, closeModal }) {
  const [loading, setLoading] = useState(false);

  const isLoginFailed = useSelector((state) => state.auth.currentUser.error);
  const store = useStore();
  const dispatch = useDispatch();
  const errorMessage = useSelector(getErrorMessage());
  const handleSubmit = async ({ roomName, type }) => {
    setLoading(true);

    dispatch(createRoom(roomName, type));

    if (errorMessage) {
      console.log("Ei onnistunut, epäonnistui");
      setLoading(false);
    } else {
      setTimeout(() => {
        dispatch(getAllRooms());
        console.log("tämä ei ole oikea tapa tehdä.");
      }, 2000);
      dispatch(roomsErrorCleared());

      closeModal();
    }
  };

  return (
    <Screen style={styles.container}>
      <AppForm
        initialValues={{
          type: "group",
          roomName: "",
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <>
          <AppFormPicker
            options={roomTypeOptions}
            autoCapitalize="none"
            icon="account-outline"
            name="type"
            placeholder="Room type"
          ></AppFormPicker>

          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="account-outline"
            keyboardType="email-address"
            name="roomName"
            placeholder="Room name"
          />

          <ErrorMessage error={isLoginFailed} visible={isLoginFailed} />

          <View style={{ flexDirection: "row", alignSelf: "center" }}>
            {loading && !isLoginFailed && <AppLoadIndicator />}
            <SubmitButton title="Create room" />
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
export default CreateRoomForm;
