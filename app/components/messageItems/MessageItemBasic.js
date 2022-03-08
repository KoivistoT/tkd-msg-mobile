import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import colors from "../../../config/colors";

import AppText from "../AppText";
import ShowImageModal from "../imageComponents/ShowImageModal";

function MessageItemBasic({ messageData }) {
  const { sentBy, item, senderName } = messageData;

  return (
    <TouchableOpacity style={styles[sentBy]}>
      <AppText>sender: {senderName}</AppText>
      <AppText key={item._id}>{item.messageBody}</AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  me: { alignItems: "flex-end" },
  otherUser: { alignItems: "flex-start" },
});
export default MessageItemBasic;
