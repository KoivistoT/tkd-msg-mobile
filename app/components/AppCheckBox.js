import React, { useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import defaultStyles from "../../config/styles";
import Checkbox from "expo-checkbox";
import AppText from "./AppText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../config/colors";

function AppCheckBox({
  initialValue = false,
  onPressItem,
  label,
  onPress,
  disabled,
  style,
  ...otherProps
}) {

  const [isChecked, setChecked] = useState(initialValue);

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.container}
      onPress={() => {
        onPress(onPressItem);
        setChecked(!isChecked);
      }}
      disabled={disabled}
    >
     
      {isChecked ? (
        <MaterialCommunityIcons
          name="checkbox-marked-outline"
          size={26}
          color={isChecked ? colors.success : colors.lightgrey}
        />
      ) : (
        <MaterialCommunityIcons
          name="checkbox-blank-outline"
          size={26}
          color={colors.medium}
        />
      )}

      <AppText
        style={[styles.name, { color: colors[disabled ? "primary" : "black"] }]}
      >
        {label} {disabled && "(You)"}
      </AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row",paddingVertical: 3, },
  name: { alignSelf: "center", paddingLeft: 10 },
});

export default AppCheckBox;
