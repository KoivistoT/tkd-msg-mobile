import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function MessageFormToolBar({ onPress, showOptions }) {
  return (
    <TouchableOpacity
      activeOpacity="0.5"
      onPress={onPress}
      style={styles.container}
    >
      <MaterialCommunityIcons
        name={!showOptions ? "plus" : "close"}
        size={24}
      ></MaterialCommunityIcons>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});
export default MessageFormToolBar;
