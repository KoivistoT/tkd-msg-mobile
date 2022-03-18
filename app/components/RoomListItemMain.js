import React from "react";
import { StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { selectRoomDataById } from "../../store/rooms";
import { selectAllUsersMinimal } from "../../store/users";
import { MemoRoomListItemChild } from "./RoomListItemChild";
function RoomListItemMain({ roomId, navigation, currentUserId }) {
  const item = useSelector(selectRoomDataById(roomId));
  const allUsers = useSelector(selectAllUsersMinimal);
  // console.log("main päivittyy");
  return (
    item &&
    Object.keys(allUsers).length > 0 && (
      <MemoRoomListItemChild
        item={item}
        allUsers={allUsers}
        currentUserId={currentUserId}
        navigation={navigation}
      />
    )
  );
}

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

export const MemoRoomListItemMain = React.memo(RoomListItemMain, areEqual);
// export default RoomListItem;
