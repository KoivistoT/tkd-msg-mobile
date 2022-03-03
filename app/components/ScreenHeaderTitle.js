import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import AppText from "./AppText";

function ScreenHeaderTitle({ title, subTitle, action = null }) {
  return (
    <TouchableOpacity activeOpacity={1} style={styles.header} onPress={action}>
      <AppText style={styles.title}>{title}</AppText>
      {subTitle && <AppText style={styles.subTitle}>{subTitle}</AppText>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: "center" },
  title: { fontSize: 18 },
  subTitle: { fontSize: 12 },
});
export default ScreenHeaderTitle;
