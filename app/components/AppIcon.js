import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../config/colors";

function AppIcon({
  icon = { icon: "user-circle-o", color: "black", size: 40 },
}) {
  console.log(icon);
  return (
    <MaterialCommunityIcons
      name={icon.name}
      size={icon.size}
      color={colors[icon.color]}
    />
  );
}

const styles = StyleSheet.create({});
export default AppIcon;
