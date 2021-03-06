import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import colors from "../../../config/colors";
import { useDispatch, useSelector, useStore } from "react-redux";
import AppText from "../AppText";
import MessageItemImage from "./MessageItemImage";
import { selectAllUsersMinimal } from "../../../store/users";
import { selectRoomMembersById } from "../../../store/rooms";
import { getOneMessageById, selectMessageById } from "../../../store/msgStore";
import { selectSocket } from "../../../store/socket";
import MessageHeader from "./MessageHeader";
import messageFuncs from "../../../utility/messageFuncs";
import timeFuncs from "../../../utility/timeFuncs";
import { selectCurrentUserId } from "../../../store/currentUser";
import ShowDocumentModal from "../modals/ShowDocumentModal";
import sortObjectArray from "../../../utility/sortObjectArray";
import AppTitle from "../AppTitle";
import appMessages from "../../../config/appMessages";
function ReadByList(item) {
  const {
    _id: messageId,
    roomId,
    messageBody,
    sentBy,
    postedByUser,
    createdAt,
    documentData,
    type: messageType,
  } = item.route.params;

  const store = useStore();
  const dispatch = useDispatch();

  const [roomType, setRoomType] = useState(null);
  const currentUserId = selectCurrentUserId(store);
  const roomMemebers = useSelector(selectRoomMembersById(roomId));
  const allUsers = useSelector(selectAllUsersMinimal);
  const currentMessage = useSelector(selectMessageById(roomId, messageId));
  const socket = useSelector(selectSocket);

  useEffect(() => {
    setRoomType(store.getState().entities.rooms.allRooms[roomId].type);
    if (!socket) {
      return;
    }

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
      (recipients) => recipients.readByUserId === userId
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
    if (member._id === currentUserId) {
      return;
    }

    return (
      <View style={styles.listItemContainer} key={member._id}>
        {allUsers && (
          <AppText>
            {allUsers ? `${member.firstName} ${member.lastName}` : ""}
          </AppText>
        )}
        {currentMessage ? (
          <AppText style={styles.timestamp} key={member._id}>
            {member.timestamp}
          </AppText>
        ) : (
          <ActivityIndicator
            animating={true}
            size="small"
            style={styles.indicator}
            color="#999999"
          />
        )}
      </View>
    );
  };

  return (
    <ScrollView>
      <View style={styles.container}>
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

        <AppText numberOfLines={3} style={styles.messageBody}>
          {messageFuncs.autolinkText(messageBody, null)}
        </AppText>
      </View>
      {roomMemebers.length > 1 ? (
        <View style={styles.listContainer}>
          <AppTitle>Read by</AppTitle>

          {fullData.map((member) => listItem(member))}
        </View>
      ) : (
        <View style={styles.container}>
          <AppText style={{ color: colors.black }}>
            {appMessages.notifications.ONLY_MEMBER}
          </AppText>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingBottom: 0,
    backgroundColor: colors.background1,
    margin: 7,
    borderRadius: 6,
  },
  listItemContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.lightgrey,
    marginBottom: 5,
  },
  listContainer: { padding: 20 },
  indicator: {
    opacity: 1,
    marginTop: 20,
  },
  timestamp: {
    position: "absolute",
    right: 0,
    alignSelf: "center",
  },
  messageBody: { overflow: "hidden", paddingBottom: 10 },
  me: { alignItems: "flex-end" },
  otherUser: { alignItems: "flex-start" },
});

export const MemoReadByList = React.memo(ReadByList);
