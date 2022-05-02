import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../../../config/colors";
import { useDispatch, useSelector, useStore } from "react-redux";
import AppText from "../AppText";
import MessageText from "./MessageText";
import MessageItemImage from "./MessageItemImage";
import { selectMessageById } from "../../../store/msgStore";
import { messageSelected } from "../../../store/general";
import MessageHeader from "./MessageHeader";
import timeFuncs from "../../../utility/timeFuncs";

function MessageItemReply({
  searchWord,
  showMore,
  setShowMore,
  item,
  showImages,
  setShowImages,
  SHOW_IMAGES,
  allUsers,
  sentBy,
  postedByUser,
  onScrollToIndex,
  isReplyMessage,
}) {
  const store = useStore();
  const dispatch = useDispatch();

  const { roomId, replyMessageId } = item;
  const messageData = useSelector(selectMessageById(roomId, replyMessageId));

  const getIndexNow = () => {
    const replyMessageIndex = store
      .getState()
      .entities.msgStore.allMessageIds[roomId].findIndex(
        (message_id) => message_id === replyMessageId
      );

    dispatch(messageSelected(replyMessageId));
    setTimeout(() => {
      onScrollToIndex(replyMessageIndex, 0.5);
    }, 200);
  };

  return (
    <View style={styles.container}>
      {!messageData && (
        <View style={{ margin: 5 }}>
          <AppText style={styles.text}>Loading reply message....</AppText>
        </View>
      )}
      {messageData && (
        <TouchableOpacity
          activeOpacity={1}
          key={messageData._id}
          style={styles.button}
          onPress={getIndexNow}
        >
          <MessageHeader
            sentBy={sentBy}
            allUsers={allUsers}
            postedByUser={postedByUser}
            createdAt={timeFuncs.getWeekDayNamesWithTimes(
              messageData.createdAt
            )}
            isReplyMessage={isReplyMessage}
          />

          {messageData.type === "image" && (
            <MessageItemImage
              showImages={showImages}
              setShowImages={setShowImages}
              SHOW_IMAGES={SHOW_IMAGES}
              item={messageData}
            />
          )}
          {messageData.messageBody !== "" && (
            <MessageText
              numberOfLines={5}
              messageBody={messageData.messageBody}
              searchWord={searchWord}
              showMore={showMore}
              setShowMore={setShowMore}
            />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: { backgroundColor: colors.light, padding: 4 },
  container: {
    backgroundColor: colors.primary,
    paddingLeft: 4,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  me: { alignItems: "flex-end" },
  otherUser: { alignItems: "flex-start" },
  text: { padding: 2, color: colors.white, fontSize: 12 },
});

export default MessageItemReply;
