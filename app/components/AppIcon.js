import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../config/colors";

function AppIcon({ icon = "user-circle-o", size = 40 }) {
  return (
    // <FontAwesome
    //   style={styles.icon}
    //   name={icon}
    //   size={50}
    //   color={colors.primary}
    // />
    <Feather name="user" size={size} color={colors.primary} />
  );
}

const styles = StyleSheet.create({});
export default AppIcon;