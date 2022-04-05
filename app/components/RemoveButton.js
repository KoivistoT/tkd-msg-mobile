import React from "react";
import { Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import colors from "../../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function RemoveButton({ onPress, text }) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={1}
    >
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 4,
    paddingHorizontal: 5,
    borderRadius: 5,
    marginBottom: 4,
    alignSelf: "center",
    backgroundColor: colors.danger,
  },
  text: {
    alignSelf: "center",
    color: colors.white,
  },
});
export default RemoveButton;
