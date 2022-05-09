import React from "react";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import colors from "../../config/colors";

function LoadingMessagesIndicator() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color={colors.primary} />
      <Text style={styles.text}>Loading messages</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    borderRadius: 10,
    alignSelf: "center",
    backgroundColor: colors.white,
    zIndex: 200,
    borderColor: colors.primary,
    flexDirection: "row",
    padding: 5,
  },
  text: { color: colors.primary, paddingHorizontal: 10 },
});

export default LoadingMessagesIndicator;
