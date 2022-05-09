import React from "react";
import { StyleSheet } from "react-native";
import AppTouchableIcon from "../AppTouchableIcon";

function AppCloseButton({ onPress, top = 0, size, color }) {
  return (
    <AppTouchableIcon
      size={size}
      color={color}
      name="close"
      onPress={onPress}
      containerStyle={[styles.container, { top }]}
    />
  );
}

const styles = StyleSheet.create({
  container: { position: "absolute", right: 0, zIndex: 2, padding: 20 },
});

export default AppCloseButton;
