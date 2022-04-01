import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

function DeleteButton({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.optionIcon}>
      <MaterialIcons name="delete-outline" size={24} color="black" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  optionIcon: {
    padding: 10,
    paddingHorizontal: 20,
  },
});
export default DeleteButton;
