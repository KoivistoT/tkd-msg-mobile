import React from "react";
import { StyleSheet, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import colors from "../../../config/colors";
import SenderName from "./SenderName";

function MessageHeader({ roomType, allUsers, postedByUser }) {
  return (
    <View style={styles.messageHeader}>
      {roomType !== "private" && (
        <SenderName allUsers={allUsers} postedByUser={postedByUser} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  messageHeader: { flexDirection: "row" },
});

export default MessageHeader;
