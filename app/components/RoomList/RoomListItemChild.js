import React, { useRef } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";

import OnlineIndicator from "../OnlineIndicator";
import RoomListLatestMessage from "./RoomListLatestMessage";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUserData } from "../../../store/currentUser";
import { Swipeable } from "react-native-gesture-handler";
import RoomListRightAction from "./RoomListRightAction";
import {
  deleteRoom,
  roomRemoved,
  selectTypersByRoomId,
} from "../../../store/rooms";
import AppIcon from "../AppIcon";
import { messagesRemoved } from "../../../store/msgStore";
import { navigate } from "../../navigation/rootNavigation";
import RoomListItemDate from "./RoomListItemDate";
import RoomListItemName from "./RoomListItemName";
import routes from "../../navigation/routes";
import colors from "../../../config/colors";

const ICON_SET = {
  private: { name: "account-lock", color: "primary", size: 32 },
  channel: { name: "playlist-edit", color: "secondary", size: 32 },
  direct: { name: "account-group-outline", color: "dark", size: 32 },
  default: { name: "user-circle-o", color: "black", size: 32 },
};

function RoomListItemChild({
  item,
  allUsers,
  currentUserId,
  navigation,
  roomId,
}) {
  const { type, members, latestMessage, roomCreator } = item;
  const roomRef = useRef(null);
  const dispatch = useDispatch();

  const typer = useSelector(selectTypersByRoomId(roomId));
  const currentUserData = useSelector(selectCurrentUserData);
  const onDeleteRoom = async () => {
    const result = await confirmAlert("Haluatko poistaa huoneen?", "");
    if (!result) return;

    dispatch(deleteRoom(roomId, currentUserId));
    dispatch(roomRemoved(roomId));
    dispatch(messagesRemoved(roomId));
    navigate(routes.ROOM_SCREEN);
  };
  const onGetIcon = () => (type ? ICON_SET[type] : ICON_SET.default);

  return (
    <View>
      <Swipeable
        ref={roomRef}
        rightThreshold={80}
        renderRightActions={() => (
          <RoomListRightAction
            currentUserData={currentUserData}
            roomType={type}
            roomCreator={roomCreator}
            onPress={() => onDeleteRoom()}
            item={item}
            onClose={() => roomRef.current?.close()}
          />
        )}
      >
        {Object.keys(allUsers).length > 0 && (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.button}
            onPress={() => navigation.navigate(routes.MESSAGE_SCREEN, item)}
          >
            <View style={styles.iconContainer}>
              <AppIcon icon={onGetIcon()} />
            </View>

            <View>
              <RoomListItemName
                item={item}
                allUsers={allUsers}
                currentUserId={currentUserId}
              />

              {latestMessage && (
                <RoomListLatestMessage
                  latestMessage={latestMessage}
                  allUsers={allUsers}
                  typer={typer}
                  currentUserId={currentUserId}
                />
              )}
            </View>
            <RoomListItemDate latestMessage={latestMessage} item={item} />

            {type === "private" && <OnlineIndicator members={members} />}
          </TouchableOpacity>
        )}
      </Swipeable>
    </View>
  );
}

const styles = StyleSheet.create({
  me: { alignItems: "flex-end" },
  button: {
    paddingBottom: 10,
    flexDirection: "row",
    backgroundColor: colors.white,
  },
  iconContainer: {
    width: 80,
    alignItems: "center",
    alignSelf: "center",
    padding: 5,
    top: 5,
  },
  otherUser: { alignItems: "flex-start" },
});

function areEqual(prevProps, nextProps) {
  const roomProps =
    prevProps.item.members === nextProps.item.members &&
    prevProps.item.roomName === nextProps.item.roomName &&
    prevProps.item.latestMessage === nextProps.item.latestMessage &&
    prevProps.item.status === nextProps.item.status &&
    prevProps.item.roomId === nextProps.item.roomId;

  try {
    var result = [];
    if (
      prevProps &&
      prevProps.allUsers &&
      Object.keys(prevProps.allUsers).length > 0 &&
      nextProps.item.members
    ) {
      nextProps.item.members.forEach((userId) => {
        const prev = prevProps.allUsers[userId];
        const next = nextProps.allUsers[userId];
        if (
          prev.firstName === next.firstName &&
          prev.lastName === next.lastName &&
          prev.displayName === next.displayName
        ) {
          result.push("sameProps");
        } else {
          result.push("notSameProps");
        }
      });
    }
    if (result.includes("notSameProps") || roomProps === false) return false;
    return true;
  } catch (error) {
    console.log(error, "code 9kf92");
  }
}

export const MemoRoomListItemChild = React.memo(RoomListItemChild, areEqual);
