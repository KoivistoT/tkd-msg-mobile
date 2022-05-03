import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

function AppTouchableIcon({
  onPress,
  name,
  color = "black",
  size = 20,
  source = "mci",
  activeOpacity = 1,
  containerStyle,
  style,
}) {
  const getIcon = () => {
    const iconStyle = [style];

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
          <Feather style={iconStyle} name={name} size={size} color={color} />
        );
      case "ad":
        return (
          <AntDesign style={iconStyle} name={name} size={size} color={color} />
        );
      case "fa":
        return (
          <FontAwesome5
            style={iconStyle}
            name={name}
            size={size}
            color={color}
          />
        );
      case "e":
        return (
          <Entypo style={iconStyle} name={name} size={size} color={color} />
        );

      default:
        break;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPress={onPress}
      style={[containerStyle]}
    >
      {getIcon()}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});

export default AppTouchableIcon;
