import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../config/colors";

function AppIcon({
  icon = { icon: "user-circle-o", color: "black", size: 40 },
}) {
  return (
    <MaterialCommunityIcons
      name={icon.name}
      size={icon.size}
      color={colors[icon.color]}
    />
  );
}

export default AppIcon;
