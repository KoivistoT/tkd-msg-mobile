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
import { MaterialIcons } from "@expo/vector-icons";
import Swipeable from "react-native-gesture-handler/Swipeable";

import { Feather } from "@expo/vector-icons";
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

import MessageOptionsButtonGroup from "./MessageOptionsButtonGroup";
import LeftAction from "./LeftAction";
import SenderName from "./SenderName";
import MessageHeader from "./MessageHeader";
function MessageItemMainChild({
  message,
  sentBy,
  allUsers,
  onScrollToIndex,
  searchWord,
}) {
  const dispatch = useDispatch();
  // console.log("child päivittyy ---");
  const onWhoHasSeen = () => {
    dispatch(messageSelectionRemoved());
    navigationRef.current.navigate(routes.READ_BY_LIST, message);
  };
  const selectedMessage = useSelector(selectSelectedMessage);

  const [roomType, setRoomType] = useState(null);
  const [isCurrentMessageSelected, setIsCurrentMessageSelected] =
    useState(false);

  useEffect(() => {
    setIsCurrentMessageSelected(selectedMessage === messageId);
    // return () => {
    //   dispatch(messageSelectionRemoved())
    // }
  }, [selectedMessage]);
  useEffect(() => {
    setRoomType(store.getState().entities.rooms.allRooms[roomId].type);
  }, []);

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
    if (selectedMessage === messageId) {
      dispatch(messageSelectionRemoved());
    } else {
      dispatch(messageSelected(messageId));
    }

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
    dispatch(messageSelectionRemoved());
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
          leftThreshold={60}
          onSwipeableLeftWillOpen={() => {
            setTimeout(() => {
              onReply();
              messageRef.current?.close();
            }, 50);
          }}
          renderLeftActions={() => <LeftAction />}
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
            >
              <MessageHeader
                roomType={roomType}
                allUsers={allUsers}
                postedByUser={postedByUser}
              />

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
          {/* {sentBy === "me" && (
            <View style={{ backgroundColor: "white" }}>
              <AppButton
                title="X"
                onPress={() => dispatch(messageSelectionRemoved())}
              />
            </View>
          )} */}
          {sentBy === "me" && (
            <MessageOptionsButtonGroup
              onDelete={() => onDeleteMessage()}
              onSeen={() => onWhoHasSeen()}
              isDeleted={is_deleted}
            />
          )}

          <View style={[styles[sentBy], { flexDirection: "row" }]}>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => onSelectMessage()}
              >
                <MessageHeader
                  roomType={roomType}
                  allUsers={allUsers}
                  postedByUser={postedByUser}
                />

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
            <MessageOptionsButtonGroup
              onDelete={() => onDeleteMessage()}
              onSeen={() => onWhoHasSeen()}
              isDeleted={is_deleted}
            />
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
  optionIcon: {
    paddingTop: 10,
    paddingRight: 20,
  },
  optionButtons: {
    backgroundColor: "red",
  },

  messageTimestamp: { fontSize: 12, alignSelf: "center" },

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
