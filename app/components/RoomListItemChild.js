import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import routes from "../navigation/routes";
import roomFuncs from "../../utility/roomFuncs";
import AppText from "./AppText";
import OnlineIndicator from "./OnlineIndicator";
import { useSelector, useStore } from "react-redux";
import { selectLastSeenMessagesById } from "../../store/currentUser";

function RoomListItemChild({ item, allUsers, currentUserId, navigation }) {
  const {
    status,
    type,
    members,
    messageSum,
    latestMessage,
    _id: roomId,
  } = item;

  console.log(
    "siirrä tämä vielä childiksi, montako luettu, niin ei päivitä kuin kerran"
  );
  const lastSeenMessagesNow = useSelector(selectLastSeenMessagesById(roomId));

  const unreadMessages = () => messageSum - lastSeenMessagesNow;

  return (
    <>
      <TouchableOpacity
        style={{
          marginBottom: 10,
          backgroundColor: status === "active" ? "lightgrey" : "yellow",
        }}
        onPress={() => navigation.navigate(routes.MESSAGE_SCREEN, item)}
      >
        {Object.keys(allUsers).length > 0 && (
          <View style={styles.nameRow}>
            {type === "private" && <OnlineIndicator members={members} />}
            <AppText
              style={{
                color: "black",

                padding: 10,
              }}
            >
              {roomFuncs.getRoomTitle(item, allUsers, currentUserId)}
            </AppText>
            {/* tämä itemlatestMessage tsekkaus voi olla turha jatkoss */}
            <AppText>{unreadMessages()}</AppText>
            {latestMessage && (
              <AppText
                style={{
                  color: "black",

                  padding: 10,
                }}
              >
                last: {latestMessage.messageBody}
              </AppText>
            )}
          </View>
        )}
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  me: { alignItems: "flex-end" },
  otherUser: { alignItems: "flex-start" },
  nameRow: {
    flexDirection: "row",
    marginRight: 5,
    marginLeft: 5,
    alignItems: "center",
  },
});

function areEqual(prevProps, nextProps) {
  const roomProps =
    prevProps.item.members === nextProps.item.members &&
    prevProps.item.roomName === nextProps.item.roomName &&
    prevProps.item.latestMessage === nextProps.item.latestMessage &&
    prevProps.item.messageSum === nextProps.item.messageSum &&
    prevProps.item.status === nextProps.item.status;

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
