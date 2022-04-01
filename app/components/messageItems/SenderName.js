import React from "react";
import { StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import colors from "../../../config/colors";
import AppText from "../AppText";

function SenderName({ allUsers, postedByUser }) {
  return (
    <AppText style={styles.senderName}>
      {allUsers ? allUsers[postedByUser].displayName : "unknown user"}
    </AppText>
  );
}

const styles = StyleSheet.create({
  senderName: { paddingRight: 10 },
});

export default SenderName;
