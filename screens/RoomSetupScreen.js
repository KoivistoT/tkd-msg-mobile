import React, { useEffect } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { selectAllUsersMedium } from "../store/users";
import { selectRoomDataById, selectRoomMembersById } from "../store/rooms";
import { selectCurrentUserData } from "../store/currentUser";
import roomFuncs from "../utility/roomFuncs";
import SectionSeparator from "../app/components/SectionSeparator";
import UserInfoCard from "../app/components/UserInfoCard";
import SetupDescription from "../app/components/roomSetup/SetupDescription";
import SetupSelectUsers from "../app/components/roomSetup/SetupSelectUsers";
import SetupActionButtons from "../app/components/roomSetup/SetupActionButtons";
import SetupRoomName from "../app/components/roomSetup/SetupRoomName";
import SetupChatType from "../app/components/roomSetup/SetupChatType";

function RoomSetupScreen(item) {
  const {
    _id: roomId,
    status: roomStatus,
    type: roomType,
    members,
  } = item.route.params;

  const allUsers = useSelector(selectAllUsersMedium);
  const roomMembers = useSelector(selectRoomMembersById(roomId));
  const currentUserData = useSelector(selectCurrentUserData);
  const roomData = useSelector(selectRoomDataById(roomId));

  useEffect(() => {}, [roomData]);

  return (
    <ScrollView style={styles.container}>
      {roomType !== "private" && (
        <SetupRoomName
          roomId={roomId}
          roomType={roomType}
          roomData={roomData}
          allUsers={allUsers}
          currentUserData={currentUserData}
        />
      )}
      <SetupChatType roomStatus={roomStatus} roomType={roomType} />
      {roomType === "private" && (
        <UserInfoCard
          hideFields={["accountType"]}
          userId={roomFuncs.getPrivateRoomOtherUserId(
            roomMembers,
            currentUserData._id
          )}
        />
      )}
      {roomType === "channel" && (
        <SetupDescription
          roomData={roomData}
          currentUserData={currentUserData}
        />
      )}
      {roomType !== "private" && roomStatus !== "archived" && allUsers && (
        <SetupSelectUsers
          allUsers={allUsers}
          roomMembers={roomMembers}
          currentUserData={currentUserData}
          members={members}
          roomId={roomId}
        />
      )}
      <SectionSeparator />
      <SetupActionButtons
        currentUserData={currentUserData}
        roomType={roomType}
        roomMembers={roomMembers}
        allUsers={allUsers}
        roomId={roomId}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
});
export default RoomSetupScreen;
