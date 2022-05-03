import React from "react";
import { StyleSheet } from "react-native";
import colors from "../../config/colors";
import AppTouchableIcon from "./AppTouchableIcon";

function ScrollDownButton({ onPress }) {
  return (
    <AppTouchableIcon
      containerStyle={styles.container}
      source="mci"
      onPress={onPress}
      color={colors.white}
      size={35}
      name="arrow-down-drop-circle-outline"
      styles={styles.icon}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    width: 70,
    height: 45,
    position: "absolute",
    bottom: 10,
    right: 0,
    backgroundColor: colors.primary,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: { margin: 20, padding: 20 },
});
export default ScrollDownButton;
