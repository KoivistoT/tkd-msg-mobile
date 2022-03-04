import React from "react";
import { View, StyleSheet } from "react-native";
import * as Yup from "yup";
import Screen from "../Screen";
import AppForm from "./AppForm";
import AppFormField from "./AppFormField";
import SubmitButton from "./SubmitButton";
import { useDispatch, useStore } from "react-redux";
import { changeRoomName, createChannel } from "../../../store/rooms";

const validationSchema = Yup.object().shape({
  newRoomName: Yup.string().required().min(1).label("New channel name"),
});

function ChangeRoomNameForm({ closeModal, roomId, roomNameNow }) {
  const dispatch = useDispatch();

  const handleSubmit = async ({ newRoomName }) => {
    dispatch(changeRoomName(roomId, newRoomName));
    closeModal();
  };

  return (
    <Screen style={styles.container}>
      <AppForm
        initialValues={{
          newRoomName: roomNameNow,
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <>
          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            // icon="account-outline"
            name="newRoomName"
            placeholder={roomNameNow}
          />

          <View style={{ flexDirection: "row", alignSelf: "center" }}>
            <SubmitButton title="Save new channel name" />
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
export default ChangeRoomNameForm;
