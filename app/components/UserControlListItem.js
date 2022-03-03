import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import AppText from "./AppText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../config/colors";

function UserControlListItem({ item, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={onPress}
      style={{
        backgroundColor: item.status === "archived" ? "yellow" : "white",
      }}
    >
      <AppText>{item.firstName}</AppText>
      <MaterialCommunityIcons
        name="chevron-right"
        size={25}
        color={colors.dark}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
export default UserControlListItem;
