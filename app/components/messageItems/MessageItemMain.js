import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import colors from "../../../config/colors";
import { useDispatch, useSelector, useStore } from "react-redux";
import AppText from "../AppText";

import MessageItemImage from "./MessageItemImage";
import {
  replyMessageIdCleared,
  replyMessageIdResived,
} from "../../../store/msgStore";
import MessageItemReply from "./MessageItemReply";
function MessageItem({ item, currentUserId, allUsers }) {
  const dispatch = useDispatch();
  const { _id: messageId, roomId, postedByUser } = item;

  const sentBy = postedByUser === currentUserId ? "me" : "otherUser";
  const messageType = item.type;
  const onReply = () => {
    dispatch(replyMessageIdCleared(roomId));
    dispatch(replyMessageIdResived({ messageId, roomId }));
  };

  return (
    <>
      <TouchableOpacity key={messageId} style={styles[sentBy]}>
        <TouchableOpacity title={"reply"} onPress={onReply}>
          <AppText>Reply</AppText>
        </TouchableOpacity>

        <AppText>
          sender:
          {allUsers ? allUsers[postedByUser].displayName : "unknown user"}
        </AppText>
        {messageType === "image" && <MessageItemImage item={item} />}
        {item.replyMessageId && (
          <MessageItemReply
            allUsers={allUsers}
            item={{ roomId, messageId: item.replyMessageId }}
          />
        )}
        <AppText>{item.messageBody}</AppText>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  me: { alignItems: "flex-end" },
  otherUser: { alignItems: "flex-start" },
});

export default MessageItem;
