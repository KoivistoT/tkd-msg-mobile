import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ScrollView,
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
import timeFuncs from "../../../utility/timeFuncs";
import { selectCurrentUserId } from "../../../store/currentUser";
import ShowDocumentModal from "../modals/ShowDocumentModal";
import sortObjectArray from "../../../utility/sortObjectArray";
function ReadByList(item) {
  const {
    _id: messageId,
    roomId,
    messageBody,
    sentBy,
    postedByUser,
    createdAt,
    is_deleted,
    documentData,
    type: messageType,
    replyMessageId,
  } = item.route.params;

  const store = useStore();
  const dispatch = useDispatch();
  const currentUserId = selectCurrentUserId(store);
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
      dispatch(getOneMessageById(roomId, messageId));
    });

    return () => {
      socket.emit("unsubscribe_read_at", roomId);
      socket.off("subscribe_read_at");
    };
  }, [socket]);

  useEffect(() => {
    const membersFullData = [];
    roomMemebers.forEach((userId) => {
      membersFullData.push({
        ...allUsers[userId],
        timestamp: getIsSeenData(userId),
      });
    });

    const sortedMembersFullData = sortObjectArray(membersFullData, "timestamp");

    setFullData(sortedMembersFullData);
  }, [roomMemebers, currentMessage]);

  const [fullData, setFullData] = useState([]);

  const getIsSeenData = (userId) => {
    const index = currentMessage.readByRecipients.findIndex(
      (item) => item.readByUserId === userId
    );
    if (index === -1) {
      return "-";
    } else {
      return `${timeFuncs.getDate(
        currentMessage.readByRecipients[index].readAt
      )} ${timeFuncs.getTime(currentMessage.readByRecipients[index].readAt)}`;
    }
  };

  const listItem = (member) => {
    if (member._id === currentUserId) return;

    return (
      <View
        style={{
          flexDirection: "row",
          borderBottomWidth: 1,
          borderBottomColor: colors.lightgrey,
          marginBottom: 5,
        }}
        key={member._id}
      >
        {allUsers && (
          <AppText
            style={{
              color: "black",
            }}
          >
            {allUsers ? `${member.firstName} ${member.lastName}` : ""}
          </AppText>
        )}
        {currentMessage ? (
          <AppText
            style={{
              position: "absolute",
              right: 0,
              alignSelf: "center",
            }}
            key={member._id}
          >
            {member.timestamp}
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
      <ScrollView>
        <View
          style={{
            padding: 10,
            paddingBottom: 0,
            backgroundColor: colors.background1,
            margin: 7,
            borderRadius: 6,
            alignItems: "center",
          }}
        >
          <MessageHeader
            sentBy={sentBy}
            roomType={roomType}
            allUsers={allUsers}
            postedByUser={postedByUser}
            createdAt={timeFuncs.getDateAndTime(createdAt)}
          />

          {messageType === "image" && (
            <MessageItemImage
              SHOW_IMAGES={2}
              item={item.route.params}
              showImages={2}
              disapleOnPress
            />
          )}
          {messageType === "document" && (
            <ShowDocumentModal
              disapleOnPress
              name={documentData.documentDisplayName}
              url={documentData.documentDownloadURL}
            />
          )}
          {replyMessageId && (
            // <MessageItemReply
            //   roomType={roomType}
            //   allUsers={allUsers}
            //   isReplyMessage={true}
            //   postedByUser={postedByUser}
            //   sentBy={sentBy}
            //   item={{
            //     roomId,
            //     replyMessageId,
            //   }}
            //   onScrollToIndex={() => console.log("not")}
            // />
            <></>
          )}

          <AppText
            numberOfLines={3}
            style={{ overflow: "hidden", paddingBottom: 10 }}
          >
            {messageFuncs.autolinkText(messageBody, null)}
          </AppText>
        </View>
        {roomMemebers.length > 1 ? (
          <View style={{ margin: 20 }}>
            <AppText style={{ marginBottom: 10 }}>Read by</AppText>

            {fullData.map((member) => listItem(member))}
          </View>
        ) : (
          <View style={styles.container}>
            <AppText style={{ color: colors.black }}>
              You are only member in this chat.
            </AppText>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    paddingTop: 10,
    alignSelf: "center",
  },
  me: { alignItems: "flex-end" },
  otherUser: { alignItems: "flex-start" },
});

function areEqual(prevProps, nextProps) {
  return true;
}

export const MemoReadByList = React.memo(ReadByList, areEqual);
