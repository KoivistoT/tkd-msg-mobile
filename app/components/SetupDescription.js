import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import colors from "../../config/colors";
import { changeRoomDescription, roomTasksResived } from "../../store/rooms";
import AppButton from "./AppButton";
import AppText from "./AppText";
import AppTextInput from "./AppTextInput";

function SetupDescription({ roomData, currentUserData }) {
  const dispatch = useDispatch();

  const { _id: roomId } = roomData;

  const [editDescription, setEditDescription] = useState(false);
  const [descriptionText, setDescriptionText] = useState(roomData?.description);

  const onEditDescription = () => {
    setEditDescription(true);
  };

  const onSaveDescription = () => {
    setEditDescription(false);
    const payload = {
      roomId,
      description: descriptionText,
    };

    const newTask = createTask("roomDescriptionChanged", payload);

    dispatch(roomTasksResived(newTask));
    dispatch(
      changeRoomDescription(roomId, descriptionText, currentUserData._id)
    );
  };

  return (
    <View>
      <AppText style={styles.descriptionTitle}>Description</AppText>
      <TouchableOpacity activeOpacity={1} onPress={() => onEditDescription()}>
        <View style={styles.descriptionContainer}>
          {!editDescription && (
            <AppText style={styles.addDescription}>
              {roomData?.description
                ? roomData?.description
                : "Add description"}
            </AppText>
          )}
          {editDescription && (
            <View>
              <AppTextInput
                autoFocus
                style={styles.descriptionInput}
                onChangeText={(text) => setDescriptionText(text)}
                multiline
                defaultValue={roomData?.description}
              />

              <AppButton
                onPress={() => onSaveDescription()}
                title="SAVE"
                fontSize={16}
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  descriptionTitle: { marginBottom: 5, alignSelf: "center" },
  descriptionContainer: {
    backgroundColor: colors.background1,
    borderRadius: 7,
    padding: 10,
  },
  descriptionInput: { fontSize: 16, marginBottom: 20 },
  addDescription: { padding: 12, paddingLeft: 10 },
});

export default SetupDescription;
