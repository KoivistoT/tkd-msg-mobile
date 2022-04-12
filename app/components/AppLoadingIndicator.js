import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from "react-native-indicators";
import colors from "../../config/colors";
import AppText from "./AppText";

function AppLoadingIndicator({ text }) {
  return (
    <View style={styles.container}>
      <AppText>{text}</AppText>
      <View style={{ top: 4 }}>
        <DotIndicator size={4} count={3} color={colors.grey} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignSelf: "center" },
});

export default AppLoadingIndicator;
