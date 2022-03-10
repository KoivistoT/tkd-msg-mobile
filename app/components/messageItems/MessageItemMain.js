import React from "react";
import { StyleSheet } from "react-native";
import { useDispatch, useSelector, useStore } from "react-redux";
import {
  replyMessageIdCleared,
  replyMessageIdResived,
  selectMessageById,
} from "../../../store/msgStore";
import { MemoMessageItemMainChild } from "./MessageItemMainChild";

function MessageItemMain({ messageId, roomId, currentUserId }) {
  console.log("message main!!!");
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

function areEqual(prevProps, nextProps) {
  // console.log(
  //   prevProps.messageData.is_deleted,
  //   nextProps.messageData.is_deleted,
  //   prevProps.messageData.is_deleted === nextProps.messageData.is_deleted
  // );
  try {
    if (prevProps.messageId === nextProps.messageId) {
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
