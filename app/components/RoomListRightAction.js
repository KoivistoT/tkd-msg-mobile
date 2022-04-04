import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import colors from "../../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function RoomListRightAction({ onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: 80,
        height: 80,
        backgroundColor: colors.danger,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <MaterialCommunityIcons
        name="delete-outline"
        size={24}
        color={colors.white}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  leftActionIcon: { padding: 5, alignSelf: "center" },
});

export default RoomListRightAction;
