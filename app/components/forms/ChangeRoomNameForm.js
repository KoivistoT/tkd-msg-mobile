import React from "react";
import { View, StyleSheet } from "react-native";
import * as Yup from "yup";
import AppForm from "./AppForm";
import AppFormField from "./AppFormField";
import SubmitButton from "./SubmitButton";
import { useDispatch, useSelector } from "react-redux";
import { changeRoomName, selectRoomDataById } from "../../../store/rooms";
import AppButtonWithLoader from "../AppButtonWithLoader";

const validationSchema = Yup.object().shape({
  newRoomName: Yup.string().required().min(1).label("New channel name"),
});

function ChangeRoomNameForm({ closeModal, roomId, roomNameNow }) {
  const dispatch = useDispatch();
  const roomData = useSelector(selectRoomDataById(roomId));

  const handleSubmit = async ({ newRoomName }) => {
    if (roomData.roomName === newRoomName) {
      closeModal();
    } else {
      dispatch(changeRoomName(roomId, newRoomName, "changeRoomName"));
    }
  };

  return (
    <View style={styles.container}>
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
            autoFocus
            name="newRoomName"
            placeholder={"Room name"}
          />
          <AppButtonWithLoader
            requestId={"changeRoomName"}
            succeedFunctions={[() => closeModal()]}
            successMessage="New name saved!"
          >
            <SubmitButton title="Save new name" />
          </AppButtonWithLoader>
        </>
      </AppForm>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 55,
    borderRadius: 10,
  },
});

export default ChangeRoomNameForm;
