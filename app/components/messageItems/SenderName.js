import React from "react";
import { StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import colors from "../../../config/colors";
import AppText from "../AppText";

function SenderName({ allUsers, postedByUser, sentBy }) {
  return (
    <AppText
      style={[
        styles.senderName,
        { color: sentBy === "me" ? colors.primary : colors.secondary },
      ]}
    >
      {allUsers ? allUsers[postedByUser].displayName : ""}
    </AppText>
  );
}

const styles = StyleSheet.create({
  senderName: { paddingRight: 10, marginRight: 40 },
});

export default SenderName;
