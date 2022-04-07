import React from "react";
import { StyleSheet, View } from "react-native";
import colors from "../../config/colors";
AppText;
import AppText from "./AppText";

function NewMessagesIndicator() {
  return (
    <View
      style={{
        alignSelf: "center",
        color: colors.danger,
        backgroundColor: colors.primary,
        width: "100%",
      }}
    >
      <AppText style={{ alignSelf: "center", color: colors.white, padding: 5 }}>
        NEW MESSAGES
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
});
export default NewMessagesIndicator;
