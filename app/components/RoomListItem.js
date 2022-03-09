import React from "react";
import { StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { selectRoomDataById } from "../../store/rooms";
import { selectAllUsersMinimal } from "../../store/users";
import { MemoRoomListItemChild } from "./RoomListItemChild";
function RoomsListItem({ roomId, navigation, currentUserId }) {
  const item = useSelector(selectRoomDataById(roomId));
  const allUsers = useSelector(selectAllUsersMinimal);
  console.log("täällä picitty");
  return (
    item &&
    allUsers && (
      <MemoRoomListItemChild
        item={item}
        allUsers={allUsers}
        currentUserId={currentUserId}
        navigation={navigation}
      />
    )
  );
}

const styles = StyleSheet.create({});

export default RoomsListItem;
