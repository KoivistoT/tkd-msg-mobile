import React from "react";
import { StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import colors from "../../../config/colors";

function LeftAction() {
  return (
    <FontAwesome5
      name="reply"
      style={styles.leftActionIcon}
      size={24}
      color={colors.lightgrey}
    />
  );
}

const styles = StyleSheet.create({
  leftActionIcon: { padding: 5, alignSelf: "center" },
});

export default LeftAction;
