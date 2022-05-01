import React from "react";
import { View, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import appMessages from "../../../config/appMessages";
import { messagesRemoved } from "../../../store/msgStore";
import {
  activateRoom,
  deleteRoom,
  leaveRoom,
  roomRemoved,
} from "../../../store/rooms";
import confirmAlert from "../../../utility/confirmAlert";
import roomFuncs from "../../../utility/roomFuncs";
import { navigate } from "../../navigation/rootNavigation";
import routes from "../../navigation/routes";
import AppButton from "../AppButton";

function SetupActionButtons({
  currentUserData,
  roomType,
  roomMembers,
  allUsers,
  roomId,
}) {
  const dispatch = useDispatch();

  const removeRoomAndNavigate = (roomId) => {
    dispatch(roomRemoved(roomId));
    dispatch(messagesRemoved(roomId));
    navigate(routes.ROOM_SCREEN);
  };
  const onLeaveRoom = async () => {
    let result;
    const activeMembers = roomFuncs.getRoomActiveMembersSum(
      roomMembers,
      allUsers
    );

    if (activeMembers === 1) {
      result = await confirmAlert(
        appMessages.questions.LEAVE_ROOM_LAST_USER.title,
        appMessages.questions.LEAVE_ROOM_LAST_USER.body
      );
    } else {
      result = await confirmAlert(
        appMessages.questions.LEAVE_ROOM.title,
        appMessages.questions.LEAVE_ROOM.body
      );
    }

    if (!result) return;

    dispatch(leaveRoom(roomId, currentUserData._id, "leaveRoom"));
    removeRoomAndNavigate(roomId);
  };

  const onActivateRoom = async () => {
    const result = await confirmAlert(
      appMessages.questions.ACTIVATE_ROOM.title,
      appMessages.questions.ACTIVATE_ROOM.body
    );
    if (!result) return;
    dispatch(activateRoom(roomId, currentUserData._id));
    goBack();
  };

  const onDeleteRoom = async () => {
    const result = await confirmAlert(
      appMessages.questions.DELETE_USER.title,
      appMessages.questions.DELETE_USERS.body
    );
    if (!result) return;

    dispatch(deleteRoom(roomId, currentUserData._id));
    removeRoomAndNavigate(roomId);
  };

  return (
    <View style={styles.container}>
      <View>
        {roomType !== "private" && (
          <AppButton
            title={`Leave chat`}
            onPress={onLeaveRoom}
            backgroundColor={"primary"}
          />
        )}
      </View>

      {(currentUserData.accountType === "admin" ||
        currentUserData._id === roomCreator ||
        roomType === "private") && (
        <AppButton
          title={`Delete chat`}
          onPress={onDeleteRoom}
          backgroundColor={"danger"}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    marginBottom: 30,
  },
});

export default SetupActionButtons;
