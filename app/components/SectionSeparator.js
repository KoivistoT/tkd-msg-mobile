import React from "react";
import { StyleSheet, View } from "react-native";
import colors from "../../config/colors";

function SectionSeparator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  separator: {
    width: "100%",
    height: 1,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: colors.lightgrey,
  },
});
export default SectionSeparator;
