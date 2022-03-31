import React from "react";
import { useSelector, useStore } from "react-redux";
import { selectMessageById } from "../../../store/msgStore";
import { MemoMessageItemMainChild } from "./MessageItemMainChild";

function MessageItemMain({
  messageId,
  roomId,
  currentUserId,
  onScrollToIndex = null,
  searchWord,
}) {
  const message = useSelector(selectMessageById(roomId, messageId));
  const store = useStore();
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
