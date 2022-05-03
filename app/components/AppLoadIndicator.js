import React from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator } from "react-native";

function AppLoadIndicator() {
  return (
    <View style={styles.container}>
      <ActivityIndicator
        animating={true}
        size="small"
        style={styles.indicator}
        color="#999999"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
  },
  indicator: {
    opacity: 1,
  },
});

export default AppLoadIndicator;
