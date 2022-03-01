import React, { useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import defaultStyles from "../../config/styles";
import Checkbox from "expo-checkbox";
import AppText from "./AppText";
function AppCheckBox({
  initialValue = false,
  item,
  onPress,
  style,
  ...otherProps
}) {
  const [isChecked, setChecked] = useState(initialValue);

  return (
    <TouchableOpacity
      style={{ flexDirection: "row" }}
      onPress={() => {
        onPress(item._id);
        setChecked(!isChecked);
      }}
    >
      <Checkbox
        style={styles.checkbox}
        value={isChecked}
        color={isChecked ? "#4630EB" : undefined}
      />
      {/* tämä hard code pois */}
      <AppText style={styles.name}>{item.firstName}</AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});

export default AppCheckBox;
