import React, { useEffect, useRef, useLayoutEffect } from "react";
import { View, StyleSheet, FlatList, Button, Text } from "react-native";
import { useDispatch, useSelector, useStore } from "react-redux";
import MessageItem from "./messageItems/MessageItemMain";
import { selectRoomMessagesByRoomId } from "../../store/msgStore";
import sortObjectsByfield from "../../utility/sortObjectsByfield";
import { navigationRef } from "../navigation/rootNavigation";
import { selectAllUsersMinimal } from "../../store/users";

function MessageList({ item }) {
  const store = useStore();
  const roomId = item.route.params._id;
  const roomMessages = useSelector(selectRoomMessagesByRoomId(roomId));
  const currentUserId = store.getState().auth.currentUser._id;

  //*********** */
  //*********** */
  // const allUsers = store.getState().entities.users.allUsers;
  const allUsers = useSelector(selectAllUsersMinimal); // tämä ei tarvinne olla selector, voi tehdä raskaaksi
  //*********** */
  //*********** */

  const messageItem = ({ item }) => (
    <MessageItem
      item={item}
      allUsers={allUsers}
      currentUserId={currentUserId}
    />
  );

  const keyExtractor = (item) => item._id;

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
        {roomMessages && (
          <FlatList
            data={sortObjectsByfield(roomMessages, "createdAt")}
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
