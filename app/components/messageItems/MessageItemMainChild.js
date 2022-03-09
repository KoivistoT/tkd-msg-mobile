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
function MessageItemMainChild({ messageData, sentBy, allUsers }) {
  const dispatch = useDispatch();

  const onReply = () => {
    dispatch(replyMessageIdCleared(messageData.roomId));
    dispatch(
      replyMessageIdResived({
        messageId: messageData._id,
        roomId: messageData.roomId,
      })
    );
  };
  console.log("message Child päivittyy---------------------");
  return (
    <>
      <TouchableOpacity key={messageData._id} style={styles[sentBy]}>
        <TouchableOpacity title={"reply"} onPress={onReply}>
          <AppText>Reply</AppText>
        </TouchableOpacity>

        <AppText>
          sender:
          {allUsers
            ? allUsers[messageData.postedByUser].displayName
            : "unknown user"}
        </AppText>
        {messageData.messageType === "image" && (
          <MessageItemImage item={messageData} />
        )}
        {messageData.replyMessageId && (
          <MessageItemReply
            allUsers={allUsers}
            item={{
              roomId: messageData.roomId,
              messageId: messageData.replyMessageId,
            }}
          />
        )}
        <AppText>{messageData.messageBody}</AppText>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  me: { alignItems: "flex-end" },
  otherUser: { alignItems: "flex-start" },
});

function areEqual(prevProps, nextProps) {
  try {
    if (
      prevProps.messageData.is_deleted === nextProps.messageData.is_deleted &&
      prevProps.messageData.messageBody === nextProps.messageData.messageBody &&
      prevProps.messageData.messageStatus ===
        nextProps.messageData.messageStatus
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
