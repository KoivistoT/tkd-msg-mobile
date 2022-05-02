import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
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
    padding: 10,
    paddingHorizontal: 20,
  },
});
export default SeenButton;
