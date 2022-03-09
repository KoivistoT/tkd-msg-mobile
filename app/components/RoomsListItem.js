import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import routes from "../../app/navigation/routes";
import colors from "../../config/colors";
import { useDispatch, useSelector, useStore } from "react-redux";
import roomFuncs from "../../utility/roomFuncs";
import AppText from "./AppText";
import { selectRoomDataById } from "../../store/rooms";
import {
  selectAllUsersMinimal,
  selectMultipleUsersById,
  selectMultipleUsersById2,
  selectUsersOnline,
  selectWithArray,
  usersOnlineResived,
} from "../../store/users";

import showOnlineIndicator from "../../utility/showOnlineIndicator";

import { MemoRoomListMainItem } from "./RoomListMainItem";
// import RoomListMainItem  from "./RoomListMainItem";
function RoomsListItem({
  // item,
  roomId,
  navigation,
  // allUsers,
  currentUserId,
  // showOnlineIndicator,
}) {
  console.log("tämä päicittyy");
  // console.log(roomId);

  // const [allUsers, setAllUsers] = useState(null);
  // const [allUsers, setUsers] = useState([]);
  const item = useSelector(selectRoomDataById(roomId));

  // const allUsers = useSelector(selectAllUsersMinimal);
  // const store = useStore();
  // useEffect(() => {}, [item]);
  // const state = store.getState();
  // const { allUsers } = useSelector(() =>
  //   selectMultipleUsersById2(state, item.members)
  // );
  // const { selectedUsers: allUsers } = selectMultipleUsersById2(
  //   store.getState(),
  //   item.members
  // );

  // console.log(allUsers, "tässä testi");
  // const allUsers = useSelector(() =>
  //   selectMultipleUsersById2({ state, idArray: item.members })
  // );

  // const testUsers = useSelector(selectWithArray(item.members));
  // console.log(testUsers);
  const allUsers = useSelector(selectAllUsersMinimal);

  return (
    <>
      {item && allUsers && (
        <MemoRoomListMainItem
          item={item}
          allUsers={allUsers}
          currentUserId={currentUserId}
          navigation={navigation}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  me: { alignItems: "flex-end" },
  otherUser: { alignItems: "flex-start" },
  nameRow: {
    flexDirection: "row",
    marginRight: 5,
    marginLeft: 5,
    alignItems: "center",
  },
});

export default RoomsListItem;
