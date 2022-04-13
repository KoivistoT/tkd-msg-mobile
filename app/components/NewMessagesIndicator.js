import React from "react";
import { StyleSheet, View, Text } from "react-native";
import colors from "../../config/colors";
AppText;
import AppText from "./AppText";

function NewMessagesIndicator() {
  return (
    <View
      style={{
        alignSelf: "center",
        color: colors.danger,
        backgroundColor: colors.success,
        width: "100%",
        margin: 5,
      }}
    >
      <AppText style={{ alignSelf: "center", color: colors.white, padding: 1 }}>
        NEW MESSAGES
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
});
export default NewMessagesIndicator;
