import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import routes from "../../app/navigation/routes";
import colors from "../../config/colors";

import roomFuncs from "../../utility/roomFuncs";
import AppText from "./AppText";

function RoomsListItem({
  item,
  navigation,
  allUsers,
  currentUserId,
  showOnlineIndicator,
}) {
  return (
    <TouchableOpacity
      style={{
        marginBottom: 10,
        backgroundColor: item.status === "active" ? "lightgrey" : "yellow",
      }}
      onPress={() => navigation.navigate(routes.MESSAGE_SCREEN, item)}
    >
      {Object.keys(allUsers).length > 0 && (
        <View style={styles.nameRow}>
          {showOnlineIndicator ? (
            <View style={styles.onlineIndicator}></View>
          ) : (
            <View style={styles.indicatorSpace}></View>
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
  onlineIndicator: {
    width: 14,
    height: 14,
    backgroundColor: colors.success,
    borderRadius: 7,
  },
  indicatorSpace: {
    width: 14,
    height: 14,

    borderRadius: 7,
  },
});

export default RoomsListItem;
