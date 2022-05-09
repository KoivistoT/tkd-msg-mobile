import React, { useRef, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Keyboard,
  Platform,
} from "react-native";
import colors from "../../../config/colors";
import { useDispatch, useSelector, useStore } from "react-redux";
import AppText from "../AppText";
import routes from "../../navigation/routes";
import MessageItemImage from "./MessageItemImage";
import { Swipeable } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import {
  deleteMessageById,
  msgTasksResived,
  replyMessageIdCleared,
  replyMessageIdResived,
} from "../../../store/msgStore";
import MessageItemReply from "./MessageItemReply";
import { navigate } from "../../navigation/rootNavigation";
import ShowDocumentModal from "../modals/ShowDocumentModal";
import createTask from "../../../utility/createTask";
import {
  messageFormFocusAdded,
  messageSelected,
  messageSelectionRemoved,
  selectSelectedMessage,
} from "../../../store/general";
import MessageOptionsButtonGroup from "./MessageOptionsButtonGroup";
import MessageHeader from "./MessageHeader";
import timeFuncs from "../../../utility/timeFuncs";
import Reactions from "./Reactions";
import MessageText from "./MessageText";
import { selectCurrentUserId } from "../../../store/currentUser";
import confirmAlert from "../../../utility/confirmAlert";
import appMessages from "../../../config/appMessages";
import taskTypes from "../../../config/taskTypes";

const SHOW_IMAGES = 2;

function MessageItemMainChild({
  message,
  sentBy,
  allUsers,
  onScrollToIndex,
  searchWord,
}) {
  const dispatch = useDispatch();
  const {
    roomId,
    _id: messageId,
    deleted,
    postedByUser,
    type: messageType,
    createdAt,
    replyMessageId,
    messageBody,
    documentData,
  } = message;

  const store = useStore();

  const [showAllEmojis, setShowAllEmojis] = useState(false);
  const [showMore, setShowMore] = useState(true);
  const [showImages, setShowImages] = useState(SHOW_IMAGES);
  const elementHeight = useRef(0);
  const messageRef = useRef();

  const onRemoveSelections = () => {
    dispatch(messageSelectionRemoved());
    setIsCurrentMessageSelected(false);
    setIsCurrentMessagePressed(false);
  };
  const onWhoHasSeen = () => {
    navigate(routes.READ_BY_LIST, message);
  };
  const selectedMessage = useSelector(selectSelectedMessage);
  const currentUserId = selectCurrentUserId(store);

  const [isCurrentMessageSelected, setIsCurrentMessageSelected] =
    useState(false);
  const [isCurrentMessagePressed, setIsCurrentMessagePressed] = useState(false);

  useEffect(() => {
    setShowAllEmojis(false);
    setIsCurrentMessageSelected(selectedMessage === messageId);
  }, [selectedMessage]);

  const onSelectMessage = () => {
    if (deleted) {
      onRemoveSelections();
      return;
    }

    setTimeout(() => {
      if (selectedMessage === messageId && isCurrentMessagePressed) {
        onRemoveSelections();
      } else {
        dispatch(messageSelected(messageId));
        setIsCurrentMessageSelected(true);
        setIsCurrentMessagePressed(true);
        setShowAllEmojis(true);
        setShowMore(true);
        setShowImages(SHOW_IMAGES);

        setTimeout(() => {
          scrollToMessage(
            Dimensions.get("window").height - elementHeight.current * 2 < 0
              ? -0.3
              : 0.5
          );
        }, 100);
      }
    }, 10);

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
  const onDeleteMessage = async () => {
    const result = await confirmAlert(
      appMessages.questions.REMOVE_MESSAGE.title,
      appMessages.questions.REMOVE_MESSAGE.body
    );
    if (!result) {
      return;
    }

    dispatch(messageSelectionRemoved());
    const newTask = createTask(taskTypes.messageDeleted, { roomId, messageId });
    dispatch(msgTasksResived(newTask));
    dispatch(deleteMessageById(roomId, messageId, currentUserId));
  };

  const getBackgroundColor = () => {
    if (isCurrentMessageSelected) {
      return colors.selected;
    }

    if (sentBy === "me") {
      return colors.messageMe;
    } else {
      return colors.messageOther;
    }
  };

  const scrollToMessage = (position = 0) => {
    const messageIndex = store
      .getState()
      .entities.msgStore.allMessageIds[roomId].findIndex(
        (message_id) => message_id === messageId
      );

    if (messageIndex !== -1) {
      setTimeout(
        () => {
          onScrollToIndex(messageIndex, position);
        },
        Platform.OS == "ios" ? 100 : 1000
      );
    }
  };

  return (
    <Swipeable
      ref={messageRef}
      rightThreshold={1}
      friction={3}
      onSwipeableRightWillOpen={
        sentBy === "me"
          ? () => {
              if (deleted) {
                messageRef.current?.close();
                return;
              }

              onWhoHasSeen();
              messageRef.current?.close();
            }
          : null
      }
      renderRightActions={
        sentBy === "me"
          ? () => (
              <Feather
                name="eye"
                size={24}
                color={colors.white}
                style={styles.optionIcon}
              />
            )
          : null
      }
    >
      <TouchableOpacity
        activeOpacity={1}
        style={styles.container}
        onPress={() => {
          onRemoveSelections();
        }}
      >
        <View
          style={[
            styles.message,
            { alignSelf: sentBy === "me" ? "flex-end" : "flex-start" },
          ]}
        >
          <View
            style={[
              styles[sentBy],
              {
                backgroundColor: getBackgroundColor(),
              },
            ]}
          >
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <TouchableOpacity
                activeOpacity={1}
                onLongPress={() => onSelectMessage()}
                onPress={() => onRemoveSelections()}
              >
                <MessageHeader
                  sentBy={sentBy}
                  allUsers={allUsers}
                  postedByUser={postedByUser}
                  createdAt={timeFuncs.getWeekDayNamesWithTimes(createdAt)}
                />
                {deleted ? (
                  <AppText style={styles.deletedMessage}>
                    Message deleted
                  </AppText>
                ) : (
                  <>
                    {messageType === "image" && (
                      <MessageItemImage
                        item={message}
                        showImages={showImages}
                        setShowImages={setShowImages}
                        SHOW_IMAGES={SHOW_IMAGES}
                        onLongPress={() => onSelectMessage()}
                      />
                    )}
                    {messageType === "document" && (
                      <ShowDocumentModal
                        name={documentData.documentDisplayName}
                        url={documentData.documentDownloadURL}
                      />
                    )}
                    {replyMessageId && (
                      <MessageItemReply
                        messageBody={messageBody}
                        searchWord={searchWord}
                        showMore={showMore}
                        setShowMore={setShowMore}
                        showImages={showImages}
                        setShowImages={setShowImages}
                        SHOW_IMAGES={SHOW_IMAGES}
                        allUsers={allUsers}
                        isReplyMessage={true}
                        postedByUser={postedByUser}
                        sentBy={sentBy}
                        item={{
                          roomId,
                          replyMessageId,
                        }}
                        onScrollToIndex={onScrollToIndex}
                      />
                    )}

                    {messageBody !== "" && (
                      <MessageText
                        numberOfLines={1000}
                        messageBody={messageBody}
                        searchWord={searchWord}
                        showMore={showMore}
                        setShowMore={setShowMore}
                      />
                    )}
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View
          style={{
            alignSelf: sentBy === "me" ? "flex-end" : "flex-start",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignSelf: sentBy === "me" ? "flex-end" : "flex-start",
            }}
          >
            {!deleted && (
              <Reactions
                onRemoveSelections={() => onRemoveSelections()}
                showAllEmojis={showAllEmojis}
                message={message}
                sentBy={sentBy}
              ></Reactions>
            )}
          </View>

          {isCurrentMessagePressed && isCurrentMessageSelected && !deleted && (
            <MessageOptionsButtonGroup
              sentBy={sentBy}
              onDelete={() => onDeleteMessage()}
              onSeen={() => onWhoHasSeen()}
              isDeleted={deleted}
              onReply={() => onReply()}
            />
          )}
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", paddingHorizontal: 12 },
  deletedMessage: { fontStyle: "italic", fontSize: 12 },
  me: {
    flexDirection: "row",
    marginTop: 4,
    marginBottom: 4,
    alignSelf: "flex-end",
    backgroundColor: "#43ded6",
    padding: 5,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    maxWidth: "82%",
    borderBottomLeftRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  message: { flexDirection: "row" },
  optionIcon: {
    paddingTop: 10,
    paddingRight: 20,
  },
  optionButtons: {
    backgroundColor: "red",
  },
  otherUser: {
    flexDirection: "row",
    marginTop: 4,
    marginBottom: 4,
    alignSelf: "flex-start",
    backgroundColor: colors.light,
    padding: 5,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    maxWidth: "82%",
    borderBottomRightRadius: 5,
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
  return (
    prevProps.message.deleted === nextProps.message.deleted &&
    prevProps.searchWord === nextProps.searchWord &&
    prevProps.message.messageBody === nextProps.message.messageBody &&
    prevProps.message.reactions.length === nextProps.message.reactions.length
  );
}

export const MemoMessageItemMainChild = React.memo(
  MessageItemMainChild,
  areEqual
);
