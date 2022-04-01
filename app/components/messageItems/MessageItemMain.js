import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { useSelector, useStore } from "react-redux";
import { selectSelectedMessage } from "../../../store/general";
import { selectMessageById } from "../../../store/msgStore";
import { MemoMessageItemMainChild } from "./MessageItemMainChild";

function MessageItemMain({
  messageId,
  roomId,
  currentUserId,
  onScrollToIndex = null,
  searchWord,
}) {
  const store = useStore();

  // const selectedMessage = useSelector(selectSelectedMessage);

  // const [isCurrentMessageSelected, setIsCurrentMessageSelected] =
  //   useState(false);

  // useEffect(() => {
  //   setIsCurrentMessageSelected(selectedMessage === messageId);
  //   // return () => {
  //   //   dispatch(messageSelectionRemoved())
  //   // }
  // }, [selectedMessage]);

  const message = useSelector(selectMessageById(roomId, messageId));
  // const message =
  //   store.getState().entities.msgStore.allMessages[roomId].messages[messageId];
  // const message =
  //   store.getState().entities.msgStore.allMessages[roomId].messages[messageId];

  const sentBy = message.postedByUser === currentUserId ? "me" : "otherUser";
  const allUsers = store.getState().entities.users.allUsers;

  return (
    <MemoMessageItemMainChild
      message={message}
      searchWord={searchWord}
      sentBy={sentBy}
      allUsers={allUsers}
      onScrollToIndex={onScrollToIndex}
    />
  );
}

function areEqual(prevProps, nextProps) {
  try {
    if (
      prevProps.messageId === nextProps.messageId &&
      prevProps.searchWord === nextProps.searchWord
    ) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error, "code 99e332");
  }
}

export const MemoMessageItemMain = React.memo(MessageItemMain, areEqual);
// export default MessageItemMain;
