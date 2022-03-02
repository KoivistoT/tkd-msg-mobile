import React, { useEffect, useRef, useLayoutEffect } from "react";
import { View, StyleSheet, FlatList, Button, Text } from "react-native";
import { useDispatch, useSelector, useStore } from "react-redux";
import MessageItem from "./MessageItem";
import { getRoomMessagesByRoomId } from "../../store/msgStore";
import sortObjectsByfield from "../../utility/sortObjectsByfield";
import { navigationRef } from "../navigation/rootNavigation";

function MessageList({ item }) {
  const store = useStore();
  const roomId = item.route.params._id;
  const roomMessages = useSelector(getRoomMessagesByRoomId(roomId));
  const userId = store.getState().auth.currentUser._id;
  const allUsers = store.getState().entities.users.allUsers;
  const messageItem = ({ item }) => (
    <MessageItem
      item={item}
      sender={
        allUsers ? allUsers[item.postedByUser].displayName : "unknown user"
      }
      userId={userId}
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
