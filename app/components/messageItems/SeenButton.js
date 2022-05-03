import React from "react";
import { StyleSheet } from "react-native";
import AppTouchableIcon from "../AppTouchableIcon";

function SeenButton({ onPress }) {
  return (
    <AppTouchableIcon
      onPress={onPress}
      name="eye"
      source="f"
      style={styles.icon}
    />
  );
}

const styles = StyleSheet.create({
  icon: {
    padding: 12,
    paddingHorizontal: 20,
  },
});
export default SeenButton;
