import React, { useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AppText from "../app/components/AppText";
import { navigate } from "../app/navigation/rootNavigation";
import { selectAllUsersMedium } from "../store/users";
import {
  activateRoom,
  changeMembers,
  deleteRoom,
  selectRoomDataById,
  leaveRoom,
  selectRoomMembersById,
  roomRemoved,
  roomTasksResived,
} from "../store/rooms";
import AppButton from "../app/components/AppButton";
import confirmAlert from "../utility/confirmAlert";
import { selectCurrentUserData } from "../store/currentUser";
import routes from "../app/navigation/routes";
import roomFuncs from "../utility/roomFuncs";
import SectionSeparator from "../app/components/SectionSeparator";
import UserInfoCard from "../app/components/UserInfoCard";
import { messagesRemoved } from "../store/msgStore";
import appMessages from "../config/appMessages";
import SetupRoomName from "../app/components/SetupRoomName";
import SetupChatType from "../app/components/SetupChatType";
import SetupDescription from "../app/components/SetupDescription";
import SetupSelectUsers from "../app/components/SetupSelectUsers";
import SetupActionButtons from "../app/components/SetupActionButtons";

function RoomSetupScreen(item) {
  const {
    _id: roomId,
    status: roomStatus,
    roomCreator,
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
      {roomData?.type !== "private" && (
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

      {roomType !== "private" && (
        <>
          <SectionSeparator />
          <AppText style={{ alignSelf: "center" }}>Chat members</AppText>
        </>
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
