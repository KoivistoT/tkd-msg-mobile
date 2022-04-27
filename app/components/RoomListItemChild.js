import React, { useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import routes from "../navigation/routes";
import roomFuncs from "../../utility/roomFuncs";
import userFuncs from "../../utility/userFuncs";
import AppText from "./AppText";
import OnlineIndicator from "./OnlineIndicator";
import { useDispatch, useSelector, useStore } from "react-redux";
import {
  selectCurrentUserData,
  selectLastSeenMessagesById,
} from "../../store/currentUser";
import { MemoUnreadMessagesItem } from "./UnreadMessagesItem";
import { Swipeable } from "react-native-gesture-handler";
import RoomListRightAction from "./RoomListRightAction";
import {
  deleteRoom,
  roomRemoved,
  selectTypersByRoomId,
} from "../../store/rooms";
import AppIcon from "./AppIcon";
import colors from "../../config/colors";
import AppLoadingIndicator from "./AppLoadingIndicator";
import timeFuncs from "../../utility/timeFuncs";
import { messagesRemoved } from "../../store/msgStore";
import { navigate } from "../navigation/rootNavigation";

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
  const { status, type, members, latestMessage, roomCreator } = item;
  const roomRef = useRef(null);
  const dispatch = useDispatch();

  const typer = useSelector(selectTypersByRoomId(roomId));
  const currentUserData = useSelector(selectCurrentUserData);
  const onDeleteRoom = async () => {
    const result = await confirmAlert("Haluatko poistaa huoneen?", "");
    if (!result) return;

    dispatch(deleteRoom(roomId, currentUserId, "deleteRoomSetup"));
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
            style={{
              paddingBottom: 10,
              flexDirection: "row",
              backgroundColor: colors.white,
            }}
            onPress={() => navigation.navigate(routes.MESSAGE_SCREEN, item)}
          >
            <View
              style={{
                width: 80,
                alignItems: "center",
                alignSelf: "center",
                padding: 5,
                top: 5,
              }}
            >
              <AppIcon icon={onGetIcon()} />
            </View>

            <View>
              <View style={styles.nameRow}>
                <AppText
                  style={{
                    color: colors.primary,
                    fontWeight: "600",
                    maxWidth: Dimensions.get("window").width - 160,
                  }}
                  numberOfLines={1}
                >
                  {roomFuncs.getRoomTitle(item, allUsers, currentUserId)}
                </AppText>
              </View>
              {latestMessage && (
                <View style={styles.lastMessage}>
                  {typer ? (
                    <AppLoadingIndicator
                      text={`${userFuncs.displayName(
                        allUsers,
                        typer
                      )} is typing`}
                    />
                  ) : (
                    <AppText
                      style={{
                        color: "black",
                        maxWidth: Dimensions.get("window").width - 160,
                      }}
                      numberOfLines={2}
                    >
                      {`${
                        latestMessage.postedByUser === currentUserId
                          ? "You"
                          : allUsers[latestMessage.postedByUser].displayName
                      }: ${latestMessage.messageBody}`}
                    </AppText>
                  )}
                </View>
              )}
            </View>
            <View
              style={{ position: "absolute", right: 15, alignSelf: "center" }}
            >
              <AppText style={{ fontSize: 14 }}>
                {latestMessage &&
                  timeFuncs.getWeekDayNames(latestMessage.createdAt)}
              </AppText>
              <View style={{ height: 30 }}>
                <MemoUnreadMessagesItem item={item} />
              </View>
            </View>
            {type === "private" && <OnlineIndicator members={members} />}
          </TouchableOpacity>
        )}
      </Swipeable>
    </View>
  );
}

const styles = StyleSheet.create({
  me: { alignItems: "flex-end" },
  otherUser: { alignItems: "flex-start" },
  nameRow: {
    flexDirection: "row",

    alignItems: "center",
    marginTop: 5,
  },
  lastMessage: {
    flexDirection: "row",

    alignItems: "center",
  },
});

function areEqual(prevProps, nextProps) {
  const roomProps =
    prevProps.item.members === nextProps.item.members &&
    prevProps.item.roomName === nextProps.item.roomName &&
    prevProps.item.latestMessage === nextProps.item.latestMessage &&
    prevProps.item.status === nextProps.item.status;
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
    console.log(prevProps.allUsers, "tämä on tässä virheessa");
    console.log(
      error,
      "code 9kf92",
      "jos luo uuden käyttäjän saattaa tulla tämä, koska ei löydä edellisessä sitä käyttäjää"
    );
  }
}

export const MemoRoomListItemChild = React.memo(RoomListItemChild, areEqual);
// export default RoomListMainItem;
