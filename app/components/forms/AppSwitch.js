import React, { useState } from "react";
import { StyleSheet, View, Switch } from "react-native";

import colors from "../../../config/colors";

function AppSwitch({ value, onSwitch }) {
  const [switchValue, setSwitchValue] = useState(value);

  const toggleSwitch = () => {
    setSwitchValue(!switchValue);
    onSwitch(!switchValue);
  };

  return (
    <Switch
      trackColor={{ false: "#767577", true: colors.primary }}
      thumbColor={value ? colors.white : "#f4f3f4"}
      ios_backgroundColor="#3e3e3e"
      onValueChange={toggleSwitch}
      value={switchValue}
    />
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default AppSwitch;
