import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import * as Yup from "yup";
import Screen from "../Screen";
import AppForm from "./AppForm";
import AppFormField from "./AppFormField";
import SubmitButton from "./SubmitButton";
import { useDispatch, useSelector, useStore } from "react-redux";
import {
  changeRoomName,
  createChannel,
  requestStateCleared,
  selectRoomDataById,
  selectRoomLoading,
  selectRoomRequestState,
  setLoading,
} from "../../../store/rooms";
import colors from "../../../config/colors";
import AppButtonWithLoader from "../messageItems/AppButtonWithLoader";

const validationSchema = Yup.object().shape({
  newRoomName: Yup.string().required().min(1).label("New channel name"),
});

function ChangeRoomNameForm({ closeModal, roomId, roomNameNow }) {
  const dispatch = useDispatch();

  const roomData = useSelector(selectRoomDataById(roomId));

  // const [loading, setLoading] = useState(false);
  // useEffect(() => {
  //   if (requestState === "started") {
  //   }
  //   if (!requestState) {
  //   }
  //   if (requestState === "succeed") {
  //   }
  // }, [requestState]);

  const handleSubmit = async ({ newRoomName }) => {
    if (roomData.roomName === newRoomName) {
      closeModal();
    } else {
      const requestId = Date.now();
      dispatch(changeRoomName(roomId, newRoomName, requestId));
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
            // icon="account-outline"
            autoFocus
            name="newRoomName"
            placeholder={"Room name"}
          />
          <AppButtonWithLoader
            id="a1a1"
            listenRequest="rooms"
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
    borderRadius: 10,
  },
});
export default ChangeRoomNameForm;
