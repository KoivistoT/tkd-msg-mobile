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
      style={[
        styles.container,
        {
          backgroundColor:
            colors[item.status === "archived" ? "khaki" : "primary"],
        },
      ]}
    >
      <AppText
        style={{
          color: colors[item.status === "archived" ? "black" : "white"],
        }}
      >{`${item.firstName} ${item.lastName}`}</AppText>
      <MaterialCommunityIcons
        style={styles.icon}
        name="chevron-right"
        size={25}
        color={colors[item.status === "archived" ? "black" : "white"]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 20,
    padding: 10,
    marginBottom: 2,
    width: "90%",
    alignSelf: "center",
    borderRadius: 5,
  },
  icon: { position: "absolute", right: 5, alignSelf: "center" },
});
export default UserControlListItem;
