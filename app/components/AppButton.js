import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../config/colors";
import AppText from "./AppText";

function AppButton({
  title,
  onPress,
  color = "primary",
  width,
  buttonWidth,
  fontSize,
  fontWeight,
  iconSize,
  margin = 0,
  icon,
}) {
  return (
    <TouchableOpacity
      activeOpacity="0.7"
      style={{ padding: 15 }}
      onPress={onPress}
      color="primary"
    >
      <View
        style={[
          styles.button,
          {
            flexDirection: "row",
            justifyContent: "center",
            backgroundColor: colors[color],
            width: buttonWidth,
            margin: margin,
          },
        ]}
      >
        <AppText
          style={[styles.text, { fontSize: fontSize, fontWeight: fontWeight }]}
        >
          {title}
        </AppText>
        {icon && (
          <MaterialCommunityIcons
            style={styles.icon}
            name={icon}
            size={iconSize}
            color={colors.white}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignSelf: "center",
  },
  text: {
    margin: 5,
    marginHorizontal: 10,
    fontWeight: "900",
    color: colors.white,
    padding: 5,
    alignSelf: "center",
  },
  icon: {
    fontWeight: "900",
    color: colors.white,
    paddingRight: 10,

    alignSelf: "center",
  },
});

export default AppButton;