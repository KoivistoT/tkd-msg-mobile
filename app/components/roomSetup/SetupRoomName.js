import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import roomFuncs from "../../../utility/roomFuncs";
import AppText from "../AppText";
import ChangeRoomNameModal from "../modals/ChangeRoomNameModal";

function SetupRoomName({
  roomType,
  roomData,
  allUsers,
  currentUserData,
  roomId,
}) {
  const [roomTitle, setRoomTitle] = useState("");
  useEffect(() => {
    setRoomTitle(
      roomFuncs.getRoomTitle(roomData, allUsers, currentUserData._id)
    );
  }, [roomData, allUsers, currentUserData, roomId]);

  return (
    <View style={styles.container}>
      <AppText>Chat name</AppText>
      {roomType !== "channel" && (
        <AppText numberOfLines={1} style={styles.title}>
          {roomTitle}
        </AppText>
      )}
      {roomType === "channel" && (
        <ChangeRoomNameModal
          title={roomTitle}
          roomId={roomId}
          roomNameNow={roomData?.roomName}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 20 },
});

export default SetupRoomName;
