import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import colors from "../../config/colors";

function AppTouchableIcon({
  onPress,
  name,
  color = "black",
  size = 20,
  source = "mci",
  containerWidth,
  style,
}) {
  const getIcon = () => {
    const iconStyle = [styles.icon, style];

    switch (source) {
      case "mci":
        return (
          <MaterialCommunityIcons
            style={iconStyle}
            name={name}
            size={size}
            color={color}
          />
        );
      case "mi":
        return (
          <MaterialIcons
            style={iconStyle}
            name={name}
            size={size}
            color={color}
          />
        );
      case "f":
        return (
          <Feather
            style={iconStyle}
            name={name}
            size={size}
            color={colors.white}
          />
        );

      default:
        break;
    }
  };

  return (
    <TouchableOpacity activeOpacity={1} onPress={onPress}>
      {getIcon()}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  icon: { padding: 20 },
});

export default AppTouchableIcon;
