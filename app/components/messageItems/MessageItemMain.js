import React from "react";
import { StyleSheet } from "react-native";
import { useSelector, useStore } from "react-redux";
import colors from "../../../config/colors";
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
  const message = useSelector(selectMessageById(roomId, messageId));
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

const styles = StyleSheet.create({
  me: {
    marginTop: 4,
    marginBottom: 4,
    alignSelf: "flex-end",
    backgroundColor: colors.light,
    padding: 5,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    maxWidth: "82%",
    borderBottomLeftRadius: 5,
    // shadowColor: "#000",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  optionIcon: {
    paddingTop: 10,
    paddingRight: 20,
  },
  optionButtons: {
    backgroundColor: "red",
  },

  otherUser: {
    marginTop: 4,
    marginBottom: 4,
    alignSelf: "flex-start",
    backgroundColor: colors.light,
    padding: 5,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    maxWidth: "82%",
    borderBottomRightRadius: 5,
    // shadowColor: "#000",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
});
export const MemoMessageItemMain = React.memo(MessageItemMain, areEqual);
// export default MessageItemMain;
