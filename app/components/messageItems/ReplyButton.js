import React from "react";
import { StyleSheet } from "react-native";
import AppTouchableIcon from "../AppTouchableIcon";

function ReplyButton({ onPress }) {
  return (
    <AppTouchableIcon
      onPress={onPress}
      name="reply-outline"
      size={26}
      style={styles.icon}
    />
  );
}

const styles = StyleSheet.create({
  icon: { padding: 10, paddingHorizontal: 20 },
});
export default ReplyButton;
