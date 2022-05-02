import React from "react";
import { StyleSheet, View } from "react-native";
import SenderName from "./SenderName";
import AppText from "../AppText";

function MessageHeader({
  sentBy,
  allUsers,
  postedByUser,
  createdAt,
  isReplyMessage = false,
}) {
  return (
    <View style={styles.container}>
      <SenderName
        allUsers={allUsers}
        sentBy={sentBy}
        postedByUser={postedByUser}
      />
      {!isReplyMessage && <View style={styles.placeHolder} />}
      <AppText style={styles.text}>{createdAt}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row" },

  messageTimestamp: { fontSize: 10, alignSelf: "flex-end" },
  placeHolder: { marginBottom: 20 },
  text: { fontSize: 10 },
});

export default MessageHeader;
