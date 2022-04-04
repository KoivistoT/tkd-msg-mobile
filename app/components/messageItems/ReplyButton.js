import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import colors from "../../../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
function ReplyButton({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <MaterialCommunityIcons
        style={styles.icon}
        name="reply-outline"
        size={26}
        color="black"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  icon: { padding: 10, paddingHorizontal: 20 },
});
export default ReplyButton;
