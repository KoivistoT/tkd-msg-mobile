import React, { useRef, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Keyboard,
} from "react-native";

import colors from "../../../config/colors";
import { useDispatch, useSelector, useStore } from "react-redux";
import AppText from "../AppText";
import routes from "../../navigation/routes";
import MessageItemImage from "./MessageItemImage";
import { Swipeable } from "react-native-gesture-handler";
import GestureRecognizer, {
  swipeDirections,
} from "react-native-swipe-gestures";
import { AntDesign } from "@expo/vector-icons";
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
import messageFuncs from "../../../utility/messageFuncs";
import createTask from "../../../utility/createTask";
import {
  messageFormFocusAdded,
  messageSelected,
  messageSelectionRemoved,
  selectSelectedMessage,
} from "../../../store/general";

import MessageOptionsButtonGroup from "./MessageOptionsButtonGroup";
import MessageHeader from "./MessageHeader";
import LeftAction from "./LeftAction";
import timeFuncs from "../../../utility/timeFuncs";
import SeenButton from "./SeenButton";
import Reactions from "./Reactions";
import MessageText from "./MessageText";
import { useIsFocused } from "@react-navigation/native";
import { selectCurrentUserId } from "../../../store/currentUser";
import confirmAlert from "../../../utility/confirmAlert";

const SHOW_IMAGES = 2;

function MessageItemMainChild({
  message,
  sentBy,
  allUsers,
  onScrollToIndex,
  searchWord,
}) {
  const dispatch = useDispatch();
  // console.log("child päivittyy ---");
  // const isFocused = useIsFocused();
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

  // const [roomType, setRoomType] = useState(null);
  const [isCurrentMessageSelected, setIsCurrentMessageSelected] =
    useState(false);
  const [isCurrentMessagePressed, setIsCurrentMessagePressed] = useState(false);

  useEffect(() => {
    setShowAllEmojis(false);
    setIsCurrentMessageSelected(selectedMessage === messageId);
  }, [selectedMessage]);

  const onSelectMessage = () => {
    if (is_deleted) {
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
          ); // tämä ei tarve välttämättä, maku asia
        }, 100); //jos tarvii pienentää, pienentää ensin ja sittten vasta scroll
      }
    }, 10);

    Keyboard.dismiss();
  };

  const onSwipeRight = (gestureState) => {
    navigate.goBack();
  };

  // const onSwipe = (gestureName, gestureState) => {
  //   const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;

  //   switch (gestureName) {
  //     case SWIPE_LEFT:
  //       alert("yellow");
  //       break;
  //   }
  // };
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
    const result = await confirmAlert("Haluatko poistaa viestin?", "");
    if (!result) return;

    dispatch(messageSelectionRemoved());
    const newTask = createTask("messageDeleted", { roomId, messageId });
    dispatch(msgTasksResived(newTask));
    dispatch(deleteMessageById(roomId, messageId, currentUserId));
  };

  const messageRef = useRef();

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
  const config = {
    velocityThreshold: 0.1,
    directionalOffsetThreshold: 80,
  };
  const [showAllEmojis, setShowAllEmojis] = useState(false);
  const [showMore, setShowMore] = useState(true);
  const [showImages, setShowImages] = useState(SHOW_IMAGES);
  // console.log(showAllEmojis);
  const elementHeight = useRef(0);
  return (
    // <GestureRecognizer
    //   onSwipeRight={(state) => onSwipeRight(state)}
    //   config={config}
    //   // style={{
    //   //   flex: 1,
    //   //   backgroundColor: this.state.backgroundColor,
    //   // }}
    // >
    <Swipeable
      ref={messageRef}
      // leftThreshold={60}

      // onSwipeableLeftOpen={() => {
      //   setTimeout(() => {
      //     onReply();
      //     messageRef.current?.close();
      //   }, 10);
      // }}
      // renderLeftActions={() => <LeftAction />}

      rightThreshold={1}
      friction={3}
      onSwipeableRightWillOpen={
        sentBy === "me"
          ? () => {
              if (is_deleted) {
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
        style={{ width: "100%", paddingHorizontal: 12 }}
        onPress={() => {
          onRemoveSelections();
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignSelf: sentBy === "me" ? "flex-end" : "flex-start",
          }}
          onLayout={(event) => {
            var { height } = event.nativeEvent.layout;

            elementHeight.current = height;
          }}
        >
          <View
            style={[
              styles[sentBy],
              {
                flexDirection: "row",
                backgroundColor: isCurrentMessageSelected
                  ? colors.selected
                  : sentBy === "me"
                  ? colors.messageMe
                  : colors.messageOther,
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
                  // roomType={roomType}
                  allUsers={allUsers}
                  postedByUser={postedByUser}
                  createdAt={timeFuncs.getWeekDayNamesWithTimes(createdAt)}
                />
                {is_deleted ? (
                  <AppText style={{ fontStyle: "italic", fontSize: 12 }}>
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
                        // roomType={roomType}

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
            {/* <AntDesign name="pluscircleo" size={24} color="black" /> */}

            {!is_deleted && (
              <Reactions
                onRemoveSelections={() => onRemoveSelections()}
                showAllEmojis={showAllEmojis}
                message={message}
                sentBy={sentBy}
              ></Reactions>
            )}
          </View>

          {isCurrentMessagePressed && isCurrentMessageSelected && !is_deleted && (
            <MessageOptionsButtonGroup
              sentBy={sentBy}
              // message={message}
              onDelete={() => onDeleteMessage()}
              onSeen={() => onWhoHasSeen()}
              isDeleted={is_deleted}
              onReply={() => onReply()}
            />
          )}
        </View>
      </TouchableOpacity>
    </Swipeable>
    // </GestureRecognizer>
  );
}

const styles = StyleSheet.create({
  me: {
    marginTop: 4,
    marginBottom: 4,
    alignSelf: "flex-end",
    backgroundColor: "#43ded6",
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

function areEqual(prevProps, nextProps) {
  // console.log(
  //   prevProps.message.is_deleted,
  //   nextProps.message.is_deleted,
  //   prevProps.message.is_deleted === nextProps.message.is_deleted
  // );
  // console.log(
  //   prevProps.message.reactions.length === nextProps.message.reactions.length,
  //   prevProps.message.reactions.length,
  //   nextProps.message.reactions.length,
  //   "täällä memossa"
  // );
  try {
    if (
      prevProps.message.is_deleted === nextProps.message.is_deleted &&
      prevProps.searchWord === nextProps.searchWord &&
      prevProps.message.messageBody === nextProps.message.messageBody &&
      prevProps.message.reactions.length === nextProps.message.reactions.length
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
