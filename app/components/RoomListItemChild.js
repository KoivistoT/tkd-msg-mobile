import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import routes from "../navigation/routes";
import roomFuncs from "../../utility/roomFuncs";
import AppText from "./AppText";
import OnlineIndicator from "./OnlineIndicator";

function RoomListItemChild({ item, allUsers, currentUserId, navigation }) {
  // console.log("child päivittyy");
  return (
    <>
      <TouchableOpacity
        style={{
          marginBottom: 10,
          backgroundColor: item.status === "active" ? "lightgrey" : "yellow",
        }}
        onPress={() => navigation.navigate(routes.MESSAGE_SCREEN, item)}
      >
        {Object.keys(allUsers).length > 0 && (
          <View style={styles.nameRow}>
            {item.type === "private" && (
              <OnlineIndicator members={item.members} />
            )}
            <AppText
              style={{
                color: "black",

                padding: 10,
              }}
              key={item._id}
            >
              {roomFuncs.getRoomTitle(item, allUsers, currentUserId)}
            </AppText>
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
    prevProps.item.status === nextProps.item.status;

  try {
    var result = [];
    if (prevProps && prevProps.allUsers) {
      nextProps.item.members.forEach((userId2) => {
        if (
          prevProps.allUsers[userId2].firstName ===
            nextProps.allUsers[userId2].firstName &&
          prevProps.allUsers[userId2].lastName ===
            nextProps.allUsers[userId2].lastName &&
          prevProps.allUsers[userId2].displayName ===
            nextProps.allUsers[userId2].displayName
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
    console.log(error, "code 9kf92");
  }
}

export const MemoRoomListItemChild = React.memo(RoomListItemChild, areEqual);
// export default RoomListMainItem;
