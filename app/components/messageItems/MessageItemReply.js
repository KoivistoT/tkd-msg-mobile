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
import SenderName from "./SenderName";
import MessageHeader from "./MessageHeader";

function MessageItemReply({
  item,

  // roomType,
  allUsers,
  sentBy,
  postedByUser,
  onScrollToIndex,
  isReplyMessage,
}) {
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
    <View
      style={{
        backgroundColor: colors.primary,
        paddingLeft: 4,
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
      }}
    >
      {!messageData && <AppText>Loading reply message....</AppText>}
      {messageData && (
        <TouchableOpacity
          key={messageData._id}
          style={{ backgroundColor: colors.light, padding: 4 }}
          onPress={getIndexNow}
        >
          <MessageHeader
            sentBy={sentBy}
            isReplyMessage={isReplyMessage}
            // roomType={roomType}
            allUser={allUsers}
            postedByUser={postedByUser}
            createdAt={messageData.createdAt.slice(11, 16)}
          />
          <SenderName
            allUsers={allUsers}
            sentBy={sentBy}
            postedByUser={postedByUser}
          />
          {messageData.type === "image" && (
            <MessageItemImage item={messageData} />
          )}
          <AppText>{messageData.messageBody}</AppText>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  me: { alignItems: "flex-end" },
  otherUser: { alignItems: "flex-start" },
});

export default MessageItemReply;
