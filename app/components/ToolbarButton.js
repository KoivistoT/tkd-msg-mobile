import React from "react";
import { Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import colors from "../../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function ToolBarButton({ onPress, icon, text }) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity="0.5"
    >
      <MaterialCommunityIcons color={colors.black} name={icon} size={24} />
      <Text numberOfLines={1} style={styles.text}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { padding: 7, paddingLeft: 10, flexDirection: "row" },
  text: {
    alignSelf: "center",
    marginLeft: 5,
    maxWidth: Dimensions.get("window").width - 180,
    overflow: "hidden",
  },
});
export default ToolBarButton;
