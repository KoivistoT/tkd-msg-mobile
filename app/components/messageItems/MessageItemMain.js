import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import colors from "../../../config/colors";
import { useDispatch, useSelector, useStore } from "react-redux";
import AppText from "../AppText";

import MessageItemImage from "./MessageItemImage";
import {
  replyMessageIdCleared,
  replyMessageIdResived,
  selectMessageById,
} from "../../../store/msgStore";
import MessageItemReply from "./MessageItemReply";
import { MemoMessageItemMainChild } from "./MessageItemMainChild";

function MessageItemMain({ messageId, roomId, currentUserId }) {
  const dispatch = useDispatch();
  // const { _id: messageId, roomId, postedByUser } = item;
  const messageData = useSelector(selectMessageById(roomId, messageId));
  const store = useStore();
  const sentBy =
    messageData.postedByUser === currentUserId ? "me" : "otherUser";
  // const messageType = item.type;
  const allUsers = store.getState().entities.users.allUsers;

  // const onReply = () => {
  //   dispatch(replyMessageIdCleared(roomId));
  //   dispatch(replyMessageIdResived({ messageId, roomId }));
  // };
  console.log("message main päivittyy");
  return (
    <MemoMessageItemMainChild
      messageData={messageData}
      sentBy={sentBy}
      allUsers={allUsers}
    />
  );
}

const styles = StyleSheet.create({
  me: { alignItems: "flex-end" },
  otherUser: { alignItems: "flex-start" },
});

export default MessageItemMain;
