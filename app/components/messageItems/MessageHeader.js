import React from "react";
import { StyleSheet, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import colors from "../../../config/colors";
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
    <View style={styles.messageHeader}>
      {/* {roomType !== "private" && ( */}
      <SenderName
        allUsers={allUsers}
        sentBy={sentBy}
        postedByUser={postedByUser}
      />
      {/* )} */}
      {!isReplyMessage && <View style={{ marginBottom: 20 }}></View>}

      <AppText style={{ fontSize: 10 }}>{createdAt}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  messageHeader: { flexDirection: "row" },
  messageTimestamp: { fontSize: 10, alignSelf: "flex-end" },
});

export default MessageHeader;
