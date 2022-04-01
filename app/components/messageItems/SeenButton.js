import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

function SeenButton({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Feather name="eye" size={24} color="black" style={styles.optionIcon} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  optionIcon: {
    padding: 10,
    paddingHorizontal: 20,
  },
});
export default SeenButton;
