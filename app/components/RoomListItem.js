import React from "react";
import { StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { selectRoomDataById } from "../../store/rooms";
import { selectAllUsersMinimal } from "../../store/users";
import { MemoRoomListItemChild } from "./RoomListItemChild";
function RoomListItem({ roomId, navigation, currentUserId }) {
  const item = useSelector(selectRoomDataById(roomId));
  const allUsers = useSelector(selectAllUsersMinimal);
  console.log("roomlititem päivittyy");
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

function areEqual(prevProps, nextProps) {
  try {
    if (prevProps.roomId === nextProps.roomId) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error, "code 99e332");
  }
}

export const MemoRoomListItem = React.memo(RoomListItem, areEqual);
// export default RoomListItem;
