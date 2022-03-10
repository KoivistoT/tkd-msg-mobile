import React, { useEffect, useRef, useLayoutEffect } from "react";
import { View, StyleSheet, FlatList, Button, Text } from "react-native";
import { useDispatch, useSelector, useStore } from "react-redux";
import MessageItemMain, {
  MemoMessageItemMain,
} from "./messageItems/MessageItemMain";
import {
  selectRoomMessageIdsByRoomId,
  selectRoomMessagesByRoomId,
} from "../../store/msgStore";
import sortObjectsByfield from "../../utility/sortObjectsByfield";
import { navigationRef } from "../navigation/rootNavigation";
import { selectAllUsersMinimal } from "../../store/users";

function MessageList({ item }) {
  const store = useStore();
  const roomId = item.route.params._id;
  // const roomMessages = useSelector(selectRoomMessagesByRoomId(roomId));
  const currentUserId = store.getState().auth.currentUser._id;
  const roomMessageIds = useSelector(selectRoomMessageIdsByRoomId(roomId));
  //*********** */
  //*********** */
  // const allUsers = store.getState().entities.users.allUsers;
  // const allUsers = useSelector(selectAllUsersMinimal); // tämä ei tarvinne olla selector, voi tehdä raskaaksi
  //*********** */
  //*********** */

  const messageItem = ({ item }) => (
    <MemoMessageItemMain
      messageId={item}
      roomId={roomId}
      currentUserId={currentUserId}
    />
  );

  const keyExtractor = (item) => item;

  return (
    <>
      <View
        style={{
          borderWidth: 1,
          width: "100%",
          height: 400,
          color: "black",
        }}
      >
        {roomMessageIds && (
          <FlatList
            // data={sortObjectsByfield(roomMessages, "createdAt")}
            data={roomMessageIds}
            keyExtractor={keyExtractor}
            renderItem={messageItem}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({});
export default MessageList;
