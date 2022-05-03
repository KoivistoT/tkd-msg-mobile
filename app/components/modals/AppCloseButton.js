import React from "react";
import { View, StyleSheet } from "react-native";
import AppTouchableIcon from "../AppTouchableIcon";

function AppCloseButton({ onPress, top = 0, size, color }) {
  return (
    <View style={[styles.container, { top }]}>
      <AppTouchableIcon
        size={size}
        color={color}
        name="close"
        onPress={onPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: "absolute", right: 0, zIndex: 2, padding: 20 },
});

export default AppCloseButton;
