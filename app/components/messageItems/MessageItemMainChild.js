import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import colors from "../../../config/colors";
import { useDispatch, useSelector, useStore } from "react-redux";
import AppText from "../AppText";

import MessageItemImage from "./MessageItemImage";
import {
  deleteMessageById,
  replyMessageIdCleared,
  replyMessageIdResived,
} from "../../../store/msgStore";
import MessageItemReply from "./MessageItemReply";
function MessageItemMainChild({ message, sentBy, allUsers }) {
  const dispatch = useDispatch();

  const {
    roomId,
    _id: messageId,
    is_deleted,
    postedByUser,
    messageType,
    replyMessageId,
    messageBody,
  } = message;
  const onReply = () => {
    dispatch(replyMessageIdCleared(message.roomId));
    dispatch(
      replyMessageIdResived({
        messageId: message._id,
        roomId: message.roomId,
      })
    );
  };
  const onDeleteMessage = () => {
    dispatch(deleteMessageById(roomId, messageId));
  };
  console.log("message Child päivittyy---------------------");
  return (
    <>
      <TouchableOpacity key={messageId} style={styles[sentBy]}>
        <TouchableOpacity title={"reply"} onPress={onReply}>
          <AppText>Reply</AppText>
        </TouchableOpacity>
        <TouchableOpacity title={"reply"} onPress={onDeleteMessage}>
          <AppText>delete</AppText>
        </TouchableOpacity>
        {is_deleted && <AppText>TÄMÄ ON DELETOIUTU</AppText>}
        <AppText>
          sender:
          {allUsers ? allUsers[postedByUser].displayName : "unknown user"}
        </AppText>
        {messageType === "image" && <MessageItemImage item={message} />}
        {replyMessageId && (
          <MessageItemReply
            allUsers={allUsers}
            item={{
              roomId,
              replyMessageId,
            }}
          />
        )}
        <AppText>{messageBody}</AppText>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  me: { alignItems: "flex-end" },
  otherUser: { alignItems: "flex-start" },
});

function areEqual(prevProps, nextProps) {
  // console.log(
  //   prevProps.message.is_deleted,
  //   nextProps.message.is_deleted,
  //   prevProps.message.is_deleted === nextProps.message.is_deleted
  // );
  try {
    if (
      prevProps.message.is_deleted === nextProps.message.is_deleted &&
      prevProps.message.messageBody === nextProps.message.messageBody &&
      prevProps.message.messageStatus === nextProps.message.messageStatus
    ) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error, "code 993332");
  }
}

export const MemoMessageItemMainChild = React.memo(
  MessageItemMainChild,
  areEqual
);
// export default MessageItemMainChild;
