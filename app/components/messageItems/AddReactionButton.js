import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
function AddReactionButton({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <FontAwesome5
        name="smile"
        size={24}
        color="black"
        style={styles.optionIcon}
      />
      <FontAwesome5
        name="plus"
        size={12}
        color="black"
        style={{ position: "absolute", right: 13, top: 4 }}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  optionIcon: {
    padding: 10,
    paddingHorizontal: 20,
  },
});
export default AddReactionButton;
