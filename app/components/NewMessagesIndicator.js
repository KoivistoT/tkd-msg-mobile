import React from "react";
import { StyleSheet, View } from "react-native";
import colors from "../../config/colors";
AppText;
import AppText from "./AppText";

function NewMessagesIndicator() {
  return (
    <View style={styles.container}>
      <AppText style={styles.text}>NEW MESSAGES</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    color: colors.danger,
    backgroundColor: colors.success,
    width: "100%",
    margin: 5,
  },
  text: { alignSelf: "center", color: colors.white, padding: 1 },
});
export default NewMessagesIndicator;
