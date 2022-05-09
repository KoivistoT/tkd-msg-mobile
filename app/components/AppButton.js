import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import colors from "../../config/colors";
import AppText from "./AppText";

const AppButton = ({
  title,
  onPress,
  color = "white",
  backgroundColor = "primary",
  fontSize,
  fontWeight,
  style,
}) => {
  return (
    <TouchableOpacity
      activeOpacity="0.7"
      style={[styles.container, style]}
      onPress={onPress}
      color={"primary"}
    >
      <View
        style={[
          styles.button,
          {
            backgroundColor: colors[backgroundColor],
          },
        ]}
      >
        <AppText
          style={[
            styles.text,
            {
              color: colors[color],
              fontSize: fontSize,
              fontWeight: fontWeight,
            },
          ]}
        >
          {title}
        </AppText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { padding: 5 },
  button: {
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignSelf: "center",
    flexDirection: "row",
    minWidth: 145,
    justifyContent: "center",
  },
  text: {
    margin: 5,
    marginHorizontal: 10,
    fontWeight: "900",

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
