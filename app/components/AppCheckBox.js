import React, { useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import defaultStyles from "../../config/styles";
import Checkbox from "expo-checkbox";
import AppText from "./AppText";
function AppCheckBox({
  initialValue = false,
  onPressItem,
  label,
  onPress,
  style,
  ...otherProps
}) {
  const [isChecked, setChecked] = useState(initialValue);

  return (
    <TouchableOpacity
      style={{ flexDirection: "row" }}
      onPress={() => {
        onPress(onPressItem);
        setChecked(!isChecked);
      }}
    >
      <Checkbox
        style={styles.checkbox}
        value={isChecked}
        color={isChecked ? "#4630EB" : undefined}
      />

      <AppText style={styles.name}>{label}</AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});

export default AppCheckBox;
