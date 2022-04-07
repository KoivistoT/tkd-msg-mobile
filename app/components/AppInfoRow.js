import React from "react";
import { View, StyleSheet } from "react-native";
import AppText from "./AppText";

function AppInfoRow({ info, value }) {
  return (
    <View style={styles.container}>
      <View style={styles.columnLeft}>
        <AppText styles={styles.info}>{info}</AppText>
      </View>
      <View style={styles.columnRight}>
        <AppText style={styles.value}>{value}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 5,
  },
  info: {},
  value: { marginLeft: 10 },
  columnLeft: { width: "40%" },
  columnRight: { width: "60%" },
});

export default AppInfoRow;
