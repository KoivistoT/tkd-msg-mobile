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
import { selectAllUsersMinimal } from "../../../store/users";
import { messageSelected } from "../../../store/general";

function MessageItemReply({ item, allUsers, onScrollToIndex }) {
  const { roomId, replyMessageId } = item;
  const messageData = useSelector(selectMessageById(roomId, replyMessageId));
  //   console.log(messageData, "täällä messageItemReply");
  const dispatch = useDispatch();

  const store = useStore();

  const getIndexNow = () => {
    const replyMessageIndex = store
      .getState()
      .entities.msgStore.allMessageIds[roomId].findIndex(
        (message_id) => message_id === replyMessageId
      );

    dispatch(messageSelected(replyMessageId));
    onScrollToIndex(replyMessageIndex);
  };
  return (
    <>
      {!messageData && <AppText>Loading reply message....</AppText>}
      {messageData && (
        <TouchableOpacity
          key={messageData._id}
          style={{ backgroundColor: colors.primary }}
          onPress={getIndexNow}
        >
          <AppText>
            sender:
            {allUsers
              ? allUsers[messageData.postedByUser].displayName
              : "unknown user"}
          </AppText>
          {messageData.type === "image" && (
            <MessageItemImage item={messageData} />
          )}
          <AppText>{messageData.messageBody}</AppText>
        </TouchableOpacity>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  me: { alignItems: "flex-end" },
  otherUser: { alignItems: "flex-start" },
});

export default MessageItemReply;
