import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  AppState,
} from "react-native";
import colors from "../../../config/colors";
import { useDispatch, useSelector, useStore } from "react-redux";
import AppText from "../AppText";

import MessageItemImage from "./MessageItemImage";

import { selectAllUsersMinimal } from "../../../store/users";
import Screen from "../Screen";
import { selectRoomMembersById } from "../../../store/rooms";
import { getOneMessageById, selectMessageById } from "../../../store/msgStore";
import { selectSocket } from "../../../store/socket";
import MessageHeader from "./MessageHeader";
import messageFuncs from "../../../utility/messageFuncs";
import MessageItemReply from "./MessageItemReply";
function ReadByList(item) {
  const {
    _id: messageId,
    roomId,
    messageBody,
    sentBy,
    postedByUser,
    createdAt,
    is_deleted,
    messageType,
    replyMessageId,
  } = item.route.params;

  const store = useStore();
  const dispatch = useDispatch();
  const currentUserId = store.getState().auth.currentUser._id;
  const roomMemebers = useSelector(selectRoomMembersById(roomId));
  const allUsers = useSelector(selectAllUsersMinimal);
  const currentMessage = useSelector(selectMessageById(roomId, messageId));
  const socket = useSelector(selectSocket);
  const [roomType, setRoomType] = useState(null);

  useEffect(() => {
    setRoomType(store.getState().entities.rooms.allRooms[roomId].type);
    if (!socket) return;

    socket.emit("subscribe_read_at", roomId);

    socket.on("subscribe_read_at", () => {
      getMessageData();
    });

    return () => {
      socket.emit("unsubscribe_read_at", roomId);
      socket.off("subscribe_read_at");
    };
  }, [socket]);

  const getMessageData = () => {
    dispatch(getOneMessageById(roomId, messageId));
  };

  const getIsSeenData = (userId) => {
    const index = currentMessage.readByRecipients.findIndex(
      (item) => item.readByUserId === userId
    );
    if (index === -1) return "-";
    else return currentMessage.readByRecipients[index].readAt;
  };

  const listItem = ({ item, index }) => {
    if (item === currentUserId) return;

    return (
      <View
        style={{
          flexDirection: "row",
          borderBottomWidth: 1,
        }}
        key={item}
      >
        {allUsers && (
          <AppText
            style={{
              color: "black",
            }}
          >
            {allUsers
              ? `${allUsers[item].firstName} ${allUsers[item].lastName}`
              : ""}
          </AppText>
        )}
        {currentMessage ? (
          <AppText
            style={{
              position: "absolute",
              right: 0,
              alingSelf: "center",
            }}
            key={item.id}
          >
            {getIsSeenData(item)}
          </AppText>
        ) : (
          <ActivityIndicator
            animating={true}
            size="small"
            style={{
              opacity: 1,
              marginTop: 20,
            }}
            color="#999999"
          />
        )}
      </View>
    );
  };

  return (
    <Screen>
      <View
        style={{ padding: 20, borderWidth: 1, margin: 7, borderRadius: 10 }}
      >
        <MessageHeader
          sentBy={sentBy}
          roomType={roomType}
          allUsers={allUsers}
          postedByUser={postedByUser}
          createdAt={createdAt.slice(11, 16)}
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
            roomType={roomType}
            allUsers={allUsers}
            isReplyMessage={true}
            postedByUser={postedByUser}
            sentBy={sentBy}
            item={{
              roomId,
              replyMessageId,
            }}
            onScrollToIndex={() => console.log("not")}
          />
        )}

        <AppText>{messageFuncs.autolinkText(messageBody, null)}</AppText>
      </View>
      <View style={{ margin: 20 }}>
        <AppText style={{ marginBottom: 10 }}>Read by</AppText>
        <FlatList
          data={roomMemebers}
          keyExtractor={(member) => member}
          renderItem={listItem}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  me: { alignItems: "flex-end" },
  otherUser: { alignItems: "flex-start" },
});

function areEqual(prevProps, nextProps) {
  return true;
}

export const MemoReadByList = React.memo(ReadByList, areEqual);
