import React from "react";
import { View, StyleSheet } from "react-native";
import { DotIndicator } from "react-native-indicators";
import colors from "../../config/colors";
import AppText from "./AppText";

function AppLoadingIndicator({ text }) {
  return (
    <View style={styles.container}>
      <AppText>{text}</AppText>
      <View style={styles.indicatorContainer}>
        <DotIndicator size={4} count={3} color={colors.grey} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignSelf: "center" },
  indicatorContainer: { top: 4 },
});

export default AppLoadingIndicator;
