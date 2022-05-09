import React from "react";
import { StyleSheet } from "react-native";
import AppTouchableIcon from "./AppTouchableIcon";

function ShowSearchBarButton({ onPress }) {
  return (
    <AppTouchableIcon
      activeOpacity="0.5"
      style={styles.icon}
      onPress={onPress}
      source="ad"
      name="search1"
    />
  );
}

const styles = StyleSheet.create({
  icon: { paddingHorizontal: 10, paddingVertical: 7 },
});

export default ShowSearchBarButton;
