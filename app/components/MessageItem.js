import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../../config/colors";

import AppText from "./AppText";
function MessageItem({ item, userId }) {
  return (
    <TouchableOpacity
      style={item.postedByUser === userId ? styles.me : styles.otherUser}
    >
      <AppText key={item._id}>{item.messageBody}</AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  me: { alignItems: "flex-end" },
  otherUser: { alignItems: "flex-start" },
});
export default MessageItem;
