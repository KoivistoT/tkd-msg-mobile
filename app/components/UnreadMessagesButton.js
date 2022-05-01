import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import colors from "../../config/colors";
import AppText from "./AppText";

function UnreadMessagesButton({
  setShowUnreadMessageButton,
  unreadMessagesOnStart,
  onPress,
}) {
  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.container}
      onPress={() => {
        onPress(unreadMessagesOnStart - 1, 1);
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
