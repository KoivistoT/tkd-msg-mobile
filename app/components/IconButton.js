import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../config/colors";

function IconButton({
  name,
  onPress,
  paddingRight = 20,
  right = 0,
  color = "dark",
  size = 24,
  ...otherProps
}) {
  return (
    <TouchableOpacity
      style={{
        position: "absolute",
        padding: 20,
        paddingRight,
        right,
        alignSelf: "center",
      }}
      activeOpacity={1}
      onPress={onPress}
      {...otherProps}
    >
      <MaterialCommunityIcons name={name} size={size} color={colors[color]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default IconButton;
