import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import routes from "../../app/navigation/routes";
import colors from "../../config/colors";
import { useDispatch, useSelector, useStore } from "react-redux";
import roomFuncs from "../../utility/roomFuncs";
import AppText from "./AppText";
import { selectRoomDataById } from "../../store/rooms";
import {
  selectAllUsersMinimal,
  selectMultipleUsersById,
  selectMultipleUsersById2,
  selectUsersOnline,
  selectWithArray,
  usersOnlineResived,
} from "../../store/users";
import showOnlineIndicator from "../../utility/showOnlineIndicator";

import OnlineIndicator from "./OnlineIndicator";
function RoomListMainItem({ item, allUsers, currentUserId, navigation }) {
  console.log("main päivittyy");
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
  console.log(
    prevProps,
    "tähän loop, missä katsoo kuuluuko uusi tieto tähän huoneeseen"
  );
  // Ei ehkä vaikutusta tästä?
  // /*
  // return true if passing nextProps to render would return
  // the same result as passing prevProps to render,
  // otherwise return false
  // */
}

export const MemoRoomListMainItem = React.memo(RoomListMainItem, areEqual);
// export default RoomListMainItem;
