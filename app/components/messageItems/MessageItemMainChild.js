import React, { useRef, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Linking,
  Text,
  TouchableOpacity,
  Keyboard,
  Image,
} from "react-native";
import colors from "../../../config/colors";
import { useDispatch, useSelector, useStore } from "react-redux";
import AppText from "../AppText";
import routes from "../../navigation/routes";
import MessageItemImage from "./MessageItemImage";

import Swipeable from "react-native-gesture-handler/Swipeable";
import {
  deleteMessageById,
  replyMessageIdCleared,
  replyMessageIdResived,
} from "../../../store/msgStore";
import MessageItemReply from "./MessageItemReply";
import { navigationRef } from "../../navigation/rootNavigation";
import ShowDocumentModal from "../modals/ShowDocumentModal";
import messageFuncs from "../../../utility/messageFuncs";
import {
  messageFormFocusAdded,
  messageSelected,
  messageSelectionRemoved,
  selectSelectedMessage,
} from "../../../store/general";
import AppButton from "../AppButton";

function MessageItemMainChild({
  message,
  sentBy,
  allUsers,
  onScrollToIndex,
  searchWord,
}) {
  const dispatch = useDispatch();
  // console.log("child päivittyy ---");

  const selectedMessage = useSelector(selectSelectedMessage);

  const [isCurrentMessageSelected, setIsCurrentMessageSelected] =
    useState(false);

  useEffect(() => {
    setIsCurrentMessageSelected(selectedMessage === messageId);
    // return () => {
    //   dispatch(messageSelectionRemoved())
    // }
  }, [selectedMessage]);

  const {
    roomId,
    _id: messageId,
    is_deleted,
    postedByUser,
    type: messageType,
    createdAt,
    replyMessageId,
    messageBody,
    documentData,
  } = message;
  const store = useStore();

  const onSelectMessage = () => {
    dispatch(replyMessageIdCleared(message.roomId));
    dispatch(messageSelected(messageId));
    // scrollToMessage();
    Keyboard.dismiss();
  };

  const onReply = () => {
    scrollToMessage();
    dispatch(messageSelectionRemoved());
    dispatch(replyMessageIdCleared(message.roomId));
    dispatch(messageFormFocusAdded());
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

  const messageRef = useRef();

  const scrollToMessage = () => {
    const messageIndex = store
      .getState()
      .entities.msgStore.allMessageIds[roomId].findIndex(
        (message_id) => message_id === messageId
      );

    if (messageIndex !== -1) {
      setTimeout(
        () => {
          onScrollToIndex(messageIndex);
        },
        Platform.OS == "ios" ? 100 : 1000
      );
    }
  };
  return (
    <View>
      {!isCurrentMessageSelected && (
        <Swipeable
          ref={messageRef}
          onSwipeableLeftWillOpen={() => {
            setTimeout(() => {
              onReply();
              messageRef.current?.close();
            }, 50);
          }}
          renderLeftActions={() => <View style={{ width: 50 }}></View>}
          // onSwipeableRightOpen={() =>
          //   navigationRef.current.navigate(routes.READ_BY_LIST, message)
          // }
          // renderRightActions={() => <View style={{ width: 1 }}></View>}
        >
          <View
            style={[
              styles[sentBy],
              {
                backgroundColor: isCurrentMessageSelected ? "red" : "lightgrey",
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => onSelectMessage()}
              // onLongPress={() => onSelectMessage()}
            >
              <View style={styles.messageHeader}>
                <AppText style={styles.senderName}>
                  {allUsers
                    ? allUsers[postedByUser].displayName
                    : "unknown user"}
                </AppText>
              </View>

              {messageType === "image" && <MessageItemImage item={message} />}
              {messageType === "document" && (
                <ShowDocumentModal
                  name={documentData.documentDisplayName}
                  url={documentData.documentDownloadURL}
                />
              )}
              {replyMessageId && (
                <MessageItemReply
                  allUsers={allUsers}
                  item={{
                    roomId,
                    replyMessageId,
                  }}
                  onScrollToIndex={onScrollToIndex}
                />
              )}
              {is_deleted && <AppText>Message deleted</AppText>}
              {!is_deleted && (
                <AppText>
                  {messageFuncs.autolinkText(messageBody, null, searchWord)}
                </AppText>
              )}
              <AppText style={styles.messageTimestamp}>
                {createdAt.slice(11, 16)}
              </AppText>
            </TouchableOpacity>
          </View>
        </Swipeable>
      )}
      {isCurrentMessageSelected && (
        <View
          style={{
            flexDirection: "row",
            alignSelf: sentBy === "me" ? "flex-end" : "flex-start",
          }}
        >
          {sentBy === "me" && (
            <View style={{ backgroundColor: "white" }}>
              <AppButton
                title="X"
                onPress={() => dispatch(messageSelectionRemoved())}
              />
            </View>
          )}
          {sentBy === "me" && (
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity title={"reply"} onPress={onDeleteMessage}>
                <AppText style={{ backgroundColor: "red", padding: 5 }}>
                  delete
                </AppText>
                <TouchableOpacity
                  title={"reply"}
                  onPress={() =>
                    navigationRef.current.navigate(routes.READ_BY_LIST, message)
                  }
                >
                  <AppText
                    style={{
                      backgroundColor: "blue",
                      padding: 5,
                      marginTop: 2,
                      color: "white",
                    }}
                  >
                    seen
                  </AppText>
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          )}

          <View style={[styles[sentBy], { flexDirection: "row" }]}>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity activeOpacity={1}>
                <View style={styles.messageHeader}>
                  <AppText style={styles.senderName}>
                    {allUsers
                      ? allUsers[postedByUser].displayName
                      : "unknown user"}
                  </AppText>
                </View>

                {messageType === "image" && <MessageItemImage item={message} />}
                {messageType === "document" && (
                  <ShowDocumentModal
                    name={documentData.documentDisplayName}
                    url={documentData.documentDownloadURL}
                  />
                )}
                {replyMessageId && (
                  <MessageItemReply
                    allUsers={allUsers}
                    item={{
                      roomId,
                      replyMessageId,
                    }}
                    onScrollToIndex={onScrollToIndex}
                  />
                )}
                {is_deleted && <AppText>Message deleted</AppText>}
                {!is_deleted && (
                  <AppText>
                    {messageFuncs.autolinkText(messageBody, null, searchWord)}
                  </AppText>
                )}
                <AppText style={styles.messageTimestamp}>
                  {createdAt.slice(11, 16)}
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
          {sentBy !== "me" && (
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity title={"reply"} onPress={onDeleteMessage}>
                <AppText style={{ backgroundColor: "red", padding: 5 }}>
                  delete
                </AppText>
                <TouchableOpacity
                  title={"reply"}
                  onPress={() =>
                    navigationRef.current.navigate(routes.READ_BY_LIST, message)
                  }
                >
                  <AppText
                    style={{
                      backgroundColor: "blue",
                      padding: 5,
                      marginTop: 2,
                      color: "white",
                    }}
                  >
                    seen
                  </AppText>
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          )}
          {sentBy !== "me" && (
            <View style={{ backgroundColor: "white" }}>
              <AppButton
                title="X"
                onPress={() => dispatch(messageSelectionRemoved())}
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  me: {
    marginTop: 4,
    marginBottom: 4,
    alignSelf: "flex-end",
    backgroundColor: colors.light,
    padding: 10,
    borderTopRightRadius: 5,
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
  senderName: { paddingRight: 10 },
  messageTimestamp: { fontSize: 12, alignSelf: "center" },
  messageHeader: { flexDirection: "row" },
  otherUser: {
    marginTop: 4,
    marginBottom: 4,
    alignSelf: "flex-start",
    backgroundColor: colors.light,
    padding: 10,
    borderTopRightRadius: 5,
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

function areEqual(prevProps, nextProps) {
  // console.log(
  //   prevProps.message.is_deleted,
  //   nextProps.message.is_deleted,
  //   prevProps.message.is_deleted === nextProps.message.is_deleted
  // );
  try {
    if (
      prevProps.message.is_deleted === nextProps.message.is_deleted &&
      prevProps.searchWord === nextProps.searchWord &&
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
