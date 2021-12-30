import React from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator } from "react-native";

function AppLoadIndicator() {
  return (
    <View style={styles.indicator}>
      <ActivityIndicator
        animating={true}
        size="small"
        style={{
          opacity: 1,
        }}
        color="#999999"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  indicator: {
    alignSelf: "center",
  },
});

export default AppLoadIndicator;
