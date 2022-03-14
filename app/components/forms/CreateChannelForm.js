import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import * as Yup from "yup";
import Screen from "../Screen";
import AppForm from "./AppForm";
import AppFormField from "./AppFormField";
import SubmitButton from "./SubmitButton";
import { useDispatch, useSelector, useStore } from "react-redux";
import {
  createChannel,
  getRoomByName,
  selectRoomLoading,
} from "../../../store/rooms";
import AppText from "../AppText";

const validationSchema = Yup.object().shape({
  roomName: Yup.string().required().min(1).label("Channel name"),
  description: Yup.string().label("Description"),
});

function CreateChannelForm() {
  const dispatch = useDispatch();
  const store = useStore();
  const loadingStatus = useSelector(selectRoomLoading);
  const userId = store.getState().auth.currentUser._id;

  const handleSubmit = async ({ roomName, description }) => {
    dispatch(createChannel(userId, roomName, description));
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

          <View>
            {loadingStatus ? (
              <ActivityIndicator
                animating={true}
                size="small"
                style={{
                  opacity: 1,
                  marginTop: 20,
                }}
                color="#999999"
              />
            ) : (
              <SubmitButton title="Create channel" />
            )}
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
