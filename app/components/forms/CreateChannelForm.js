import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import * as Yup from "yup";
import Screen from "../Screen";
import AppForm from "./AppForm";
import AppFormField from "./AppFormField";
import SubmitButton from "./SubmitButton";
import { useDispatch, useSelector, useStore } from "react-redux";
import { createChannel, selectRoomLoading } from "../../../store/rooms";
import { selectCurrentUserId } from "../../../store/currentUser";

const validationSchema = Yup.object().shape({
  roomName: Yup.string().required().min(1).label("Channel name"),
  description: Yup.string().label("Description"),
});

function CreateChannelForm() {
  const dispatch = useDispatch();
  const store = useStore();
  const loadingStatus = useSelector(selectRoomLoading);
  const userId = selectCurrentUserId(store);

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
            style={styles.email}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            name="roomName"
            placeholder="Channel name"
          />

          <View style={styles.descriptionContainer}>
            <AppFormField
              style={styles.description}
              autoCapitalize="none"
              autoCorrect={false}
              multiline
              name="description"
              placeholder="Description"
            />
          </View>
          <View>
            {loadingStatus ? (
              <ActivityIndicator
                animating={true}
                size="small"
                style={styles.indicator}
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
  description: { height: 100, padding: 10 },
  descriptionContainer: { marginVertical: 15 },
  email: { padding: 10 },
  indicator: {
    opacity: 1,
    marginTop: 20,
  },
});
export default CreateChannelForm;
