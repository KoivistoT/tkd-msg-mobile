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
function MessageItemReply({ item, allUsers, onScrollToIndex }) {
  const { roomId, replyMessageId } = item;
  const messageData = useSelector(selectMessageById(roomId, replyMessageId));
  //   console.log(messageData, "täällä messageItemReply");
  const store = useStore();
  const getIndexNow = () => {
    const replyMessageIndex = Object.keys(
      store.getState().entities.msgStore.allMessages[roomId].messages
    ).findIndex((messageId) => messageId === replyMessageId);
    console.log(
      replyMessageIndex,
      "menee nyt väärään, koska ei tule alunperin reversenä, korjaa se. katso myös highglight"
    );
    onScrollToIndex(replyMessageIndex);
  };
  return (
    <>
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
    </>
  );
}

const styles = StyleSheet.create({
  me: { alignItems: "flex-end" },
  otherUser: { alignItems: "flex-start" },
});

export default MessageItemReply;
