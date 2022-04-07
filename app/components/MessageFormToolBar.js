import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ShowSearchBarButton from "./ShowSearchBarButton";

function MessageFormToolBar({ onPress, showOptions }) {
  return (
    <TouchableOpacity
      activeOpacity="0.5"
      onPress={onPress}
      style={styles.container}
    >
      <MaterialCommunityIcons
        // name="attachment"
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
  // container: { flexDirection: "row", justifyContent: "space-around" },
});
export default MessageFormToolBar;
