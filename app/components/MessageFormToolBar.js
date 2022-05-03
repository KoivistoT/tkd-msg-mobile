import React from "react";
import { StyleSheet } from "react-native";
import AppTouchableIcon from "./AppTouchableIcon";

function MessageFormToolBar({ onPress, showOptions }) {
  return (
    <AppTouchableIcon
      name={!showOptions ? "plus" : "close"}
      activeOpacity="0.5"
      onPress={onPress}
      style={styles.container}
      source="mci"
      size={24}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});
export default MessageFormToolBar;
