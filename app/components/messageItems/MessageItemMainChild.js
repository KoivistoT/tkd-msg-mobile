import React, { useRef } from "react";
import {
  View,
  StyleSheet,
  Linking,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import colors from "../../../config/colors";
import { useDispatch, useSelector, useStore } from "react-redux";
import AppText from "../AppText";
import routes from "../../navigation/routes";
import MessageItemImage from "./MessageItemImage";
import Autolink from "react-native-autolink";
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
import { messageFormFocusAdded } from "../../../store/general";

function MessageItemMainChild({
  message,
  sentBy,
  allUsers,
  onScrollToIndex,
  searchWord,
}) {
  const dispatch = useDispatch();
  // console.log("child päivittyy ---");

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

  const onReply = () => {
    const selectedMessageId = Object.keys(
      store.getState().entities.msgStore.allMessages[roomId].messages
    ).findIndex((message_id) => message_id === messageId);

    setTimeout(
      () => {
        onScrollToIndex(selectedMessageId);
      },
      Platform.OS == "ios" ? 100 : 1000
    );

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
  // console.log("message Child päivittyy---------------------");
  const messageRef = useRef();

  return (
    <Swipeable
      ref={messageRef}
      onSwipeableLeftWillOpen={() => {
        setTimeout(() => {
          onReply();
          messageRef.current.close();
        }, 50);
      }}
      renderLeftActions={() => <View style={{ width: 50 }}></View>}
    >
      <TouchableOpacity
        key={messageId}
        style={[styles[sentBy]]}
        onLongPress={() =>
          navigationRef.current.navigate(routes.READ_BY_LIST, message)
        }
      >
        <AppText style={{ backgroundColor: "red" }}>
          {createdAt.slice(11, 19)}
        </AppText>
        <TouchableOpacity title={"reply"} onPress={onReply}>
          <AppText>Reply</AppText>
        </TouchableOpacity>
        <TouchableOpacity title={"reply"} onPress={onDeleteMessage}>
          <AppText>delete</AppText>
        </TouchableOpacity>
        {is_deleted && <AppText>TÄMÄ ON DELETOIUTU</AppText>}
        <AppText>
          sender:
          {allUsers ? allUsers[postedByUser].displayName : "unknown user"}
        </AppText>
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
        <AppText>
          {messageFuncs.autolinkText(messageBody, null, searchWord)}
        </AppText>
      </TouchableOpacity>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  me: { alignItems: "flex-end" },
  otherUser: { alignItems: "flex-start" },
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
