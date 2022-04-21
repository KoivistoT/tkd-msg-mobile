import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
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
} from "../../../store/rooms";
import colors from "../../../config/colors";

const validationSchema = Yup.object().shape({
  newRoomName: Yup.string().required().min(1).label("New channel name"),
});

function ChangeRoomNameForm({ closeModal, roomId, roomNameNow }) {
  const dispatch = useDispatch();

  const roomData = useSelector(selectRoomDataById(roomId));
  const requestState = useSelector(selectRoomRequestState);

  useEffect(() => {
    if (requestState === true) {
      dispatch(requestStateCleared());
      closeModal();
    }
  }, [requestState]);

  const handleSubmit = async ({ newRoomName }) => {
    if (roomData.roomName === newRoomName) {
      closeModal();
    } else {
      dispatch(changeRoomName(roomId, newRoomName));
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
            placeholder={roomNameNow}
          />

          <View
            style={{ flexDirection: "row", alignSelf: "center", marginTop: 20 }}
          >
            <SubmitButton title="Save new name" />
          </View>
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
