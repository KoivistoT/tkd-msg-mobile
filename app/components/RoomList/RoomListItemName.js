import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import colors from "../../../config/colors";
import roomFuncs from "../../../utility/roomFuncs";
import AppText from "../AppText";

function RoomListItemName({ item, allUsers, currentUserId }) {
  return (
    <View style={styles.container}>
      <AppText style={styles.title} numberOfLines={1}>
        {roomFuncs.getRoomTitle(item, allUsers, currentUserId)}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  title: {
    color: colors.primary,
    fontWeight: "600",
    maxWidth: Dimensions.get("window").width - 160,
  },
});

export default RoomListItemName;
