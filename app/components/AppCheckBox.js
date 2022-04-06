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
      style={{ flexDirection: "row" }}
      onPress={() => {
        onPress(onPressItem);
        setChecked(!isChecked);
      }}
      disabled={disabled}
    >
      {/* <Checkbox
        style={styles.checkbox}
        value={isChecked}
        color={isChecked ? "#4630EB" : undefined}
      /> */}

      {/* <View
        style={{
          borderRadius: 4,
          backgroundColor: isChecked ? colors.success : colors.lightgrey,
          height: 22,
          width: 20,
          margin: 5,
          paddingHorizontal: 6,
          justifyContent: "center",
        }}
      > */}
      {isChecked ? (
        // <AppText
        //   style={{
        //     color: colors.white,
        //     fontSize: 12,
        //   }}
        // ></AppText>
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
      {/* </View> */}

      <AppText
        style={[styles.name, { color: colors[disabled ? "primary" : "black"] }]}
      >
        {label} {disabled && "(You)"}
      </AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  name: { alignSelf: "center", paddingLeft: 10 },
});

export default AppCheckBox;
