import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useSelector } from "react-redux";
import colors from "../../config/colors";
import { selectLastSeenMessagesById } from "../../store/currentUser";
import AppText from "./AppText";

function UnreadMessagesButton({
  setShowUnreadMessageButton,
  unreadMessagesOnStart,
  onPress,
}) {
  //   unreadMessages;
  //   store.getState().auth.currentUser.last_seen_messages[
  //     store
  //       .getState()
  //       .auth.currentUser.last_seen_messages.findIndex(
  //         (object) => object.roomId === roomId
  //       )
  //   ].lastSeenMessageSum;

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.container}
      onPress={() => {
        onPress(unreadMessagesOnStart - 1);
        setShowUnreadMessageButton(false);
      }}
    >
      <AppText
        style={styles.number}
      >{`New messages ${unreadMessagesOnStart}`}</AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 10,
    borderRadius: 10,
    alignSelf: "center",
    backgroundColor: colors.success,
    zIndex: 200,
  },
  number: { paddingHorizontal: 20, paddingVertical: 5, color: colors.white },
});

export default UnreadMessagesButton;
