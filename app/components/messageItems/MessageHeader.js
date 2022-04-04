import React from "react";
import { StyleSheet, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import colors from "../../../config/colors";
import SenderName from "./SenderName";
import AppText from "../AppText";

function MessageHeader({
  sentBy,
  roomType,
  allUsers,
  postedByUser,
  createdAt,
  isReplyMessage = false,
}) {
  return (
    <View style={styles.messageHeader}>
      {roomType !== "private" && (
        <SenderName
          allUsers={allUsers}
          sentBy={sentBy}
          postedByUser={postedByUser}
        />
      )}
      {!isReplyMessage && <View style={{ marginBottom: 20 }}></View>}
      <View style={{ position: "absolute", right: 0 }}>
        <AppText style={styles.messageTimestamp}>{createdAt}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  messageHeader: { flexDirection: "row" },
  messageTimestamp: { fontSize: 10, alignSelf: "flex-end" },
});

export default MessageHeader;
