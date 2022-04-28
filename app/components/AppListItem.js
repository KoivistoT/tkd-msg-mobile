import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../../config/colors";
import AppText from "./AppText";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function AppListItem({ item, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={styles.container}
      onPress={onPress}
    >
      <View style={{ flexDirection: "row" }}>
        <AppText style={styles.name}>{item.name}</AppText>

        <MaterialCommunityIcons
          style={styles.icon}
          name="chevron-right"
          size={25}
          color={colors.white}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    padding: 10,
    backgroundColor: colors.primary,
    width: "90%",
    alignSelf: "center",
    borderRadius: 5,
  },
  icon: { position: "absolute", right: 0, alignSelf: "center" },
  name: { color: colors.white },
});

export default AppListItem;
