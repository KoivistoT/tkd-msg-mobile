import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function AppCloseButton({ onPress, top = 0 }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <MaterialCommunityIcons
        style={[styles.icon, { top }]}
        name="close"
        size={20}
      ></MaterialCommunityIcons>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-end",
    padding: 20,
    position: "absolute",
    zIndex: 100,
  },
});

export default AppCloseButton;
