import React, { useState } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import AppText from "./AppText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../config/colors";

const AppCheckBox = ({
  initialValue = false,
  onPressItem,
  label,
  onPress,
  disabled,
}) => {
  const [isChecked, setChecked] = useState(initialValue);

  const getIsCheckedColor = (isItemSelected) => {
    return isItemSelected ? colors.success : colors.lightgrey;
  };
  const getIsDisapledColor = (isItemDisapled) => {
    return colors[isItemDisapled ? "primary" : "black"];
  };

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
          color={getIsCheckedColor(isChecked)}
        />
      ) : (
        <MaterialCommunityIcons
          name="checkbox-blank-outline"
          size={26}
          color={colors.medium}
        />
      )}

      <AppText style={[styles.name, { color: getIsDisapledColor(disabled) }]}>
        {label} {disabled && "(You)"}
      </AppText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row", paddingVertical: 3 },
  name: { alignSelf: "center", paddingLeft: 10 },
});

export default AppCheckBox;
