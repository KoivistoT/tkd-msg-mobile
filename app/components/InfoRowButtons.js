import React from "react";
import { View, StyleSheet } from "react-native";
import colors from "../../config/colors";
import AppTouchableIcon from "./AppTouchableIcon";

function InfoRowButtons({ onSaveChanges, onNotSaveChanges }) {
  return (
    <View style={styles.container}>
      <AppTouchableIcon
        source="mci"
        onPress={onSaveChanges}
        name="content-save"
        size={16}
        color={colors.white}
        containerStyle={[styles.button, { backgroundColor: colors.success }]}
      />
      <AppTouchableIcon
        source="ad"
        color={colors.white}
        onPress={onNotSaveChanges}
        name="closecircleo"
        size={16}
        containerStyle={[styles.button, { backgroundColor: colors.danger }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    position: "absolute",
    right: 10,
    alignSelf: "center",
  },
  button: {
    backgroundColor: colors.success,
    borderRadius: 6,
    alignSelf: "center",
    padding: 7,
    marginLeft: 5,
    width: 30,
    height: 30,
    bottom: 4,
  },
});

export default InfoRowButtons;
